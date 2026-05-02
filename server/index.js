/**
 * 头像上传服务：接收前端上传的图片，上传到阿里云 OSS，返回访问 URL
 * 请配置 .env 中的 OSS 密钥，勿将 .env 提交到版本库
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { Readable } = require('stream');
const OSS = require('ali-oss');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 8082;

// 通义千问 API 配置
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || 'sk-baf790350f5949a1a37ac5ce3137cc5c';
const DASHSCOPE_BASE_URL = 'dashscope.aliyuncs.com';

// 内存存储，限制 2MB，仅允许图片
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp)$/i;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('仅支持 JPG、PNG、GIF、WebP 图片'));
    }
  }
});

// 营业执照：图片或 PDF，5MB
const uploadLicense = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp)|application\/pdf$/i;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('仅支持 JPG、PNG、GIF、WebP、PDF'));
    }
  }
});

app.use(cors({ origin: true }));
app.use(express.json());

// 创建 OSS 客户端（头像用）
function getOSSClient() {
  const region = process.env.OSS_REGION || 'oss-cn-hangzhou';
  const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
  const bucket = process.env.OSS_BUCKET || 'zhili-kids-industry-system';
  if (!accessKeyId || !accessKeySecret) {
    throw new Error('请配置 .env 中的 OSS_ACCESS_KEY_ID 和 OSS_ACCESS_KEY_SECRET');
  }
  return new OSS({
    region,
    accessKeyId,
    accessKeySecret,
    bucket
  });
}

// 创建 OSS 客户端（营业执照用，专用 bucket）
function getLicenseOSSClient() {
  const region = process.env.OSS_LICENSE_REGION || process.env.OSS_REGION || 'oss-cn-beijing';
  const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
  const bucket = process.env.OSS_LICENSE_BUCKET || 'yingyezhizhao-zhili-kids-system';
  if (!accessKeyId || !accessKeySecret) {
    throw new Error('请配置 .env 中的 OSS_ACCESS_KEY_ID 和 OSS_ACCESS_KEY_SECRET');
  }
  return new OSS({
    region,
    accessKeyId,
    accessKeySecret,
    bucket
  });
}

// POST /api/upload/avatar — 上传头像，返回 URL
app.post('/api/upload/avatar', upload.single('file'), async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ code: 400, message: '未选择文件' });
  }
  const ext = path.extname(req.file.originalname) || '.jpg';
  const objectName = `avatars/${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;

  try {
    const client = getOSSClient();
    const stream = Readable.from(req.file.buffer);
    await client.putStream(objectName, stream, {
      contentLength: req.file.size,
      headers: { 'Content-Type': req.file.mimetype }
    });
    // 返回公网访问 URL（需在 OSS 控制台将 bucket 读权限设为公共读）
    const bucket = process.env.OSS_BUCKET || 'zhili-kids-industry-system';
    const region = process.env.OSS_REGION || 'oss-cn-hangzhou';
    const url = `https://${bucket}.${region}.aliyuncs.com/${objectName}`;
    res.json({ code: 200, data: { url } });
  } catch (err) {
    console.error('OSS 上传失败:', err);
    res.status(500).json({ code: 500, message: err.message || '上传失败' });
  }
});

// POST /api/upload/license — 上传营业执照（企业注册用），存入专用 bucket，返回永久有效的公网 URL
app.post('/api/upload/license', uploadLicense.single('file'), async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ code: 400, message: '未选择文件' });
  }
  const ext = path.extname(req.file.originalname) || (req.file.mimetype === 'application/pdf' ? '.pdf' : '.jpg');
  const objectName = `licenses/${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
  try {
    const client = getLicenseOSSClient();
    const stream = Readable.from(req.file.buffer);
    await client.putStream(objectName, stream, {
      contentLength: req.file.size,
      headers: { 'Content-Type': req.file.mimetype }
    });
    // 返回永久有效的公网 URL（需在 OSS 控制台将 bucket 读权限设为公共读）
    const bucket = process.env.OSS_LICENSE_BUCKET || 'yingyezhizhao-zhili-kids-system';
    const region = process.env.OSS_LICENSE_REGION || process.env.OSS_REGION || 'oss-cn-beijing';
    const url = `https://${bucket}.${region}.aliyuncs.com/${objectName}`;
    res.json({ code: 200, data: { url } });
  } catch (err) {
    console.error('OSS 营业执照上传失败:', err);
    res.status(500).json({ code: 500, message: err.message || '上传失败' });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ code: 400, message: '文件大小超过限制' });
  }
  res.status(400).json({ code: 400, message: err.message || '请求错误' });
});

// 通义千问 AI 助手接口
function callDashScopeAPI(messages) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'qwen3.5-omni-plus-2026-03-15',
      messages: messages
    });

    const options = {
      hostname: DASHSCOPE_BASE_URL,
      port: 443,
      path: '/compatible-mode/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.error) {
            reject(new Error(result.error.message || 'API 调用失败'));
          } else {
            resolve(result);
          }
        } catch (e) {
          reject(new Error('解析响应失败: ' + data));
        }
      });
    });

    req.on('error', (e) => reject(new Error('网络请求失败: ' + e.message)));
    req.write(postData);
    req.end();
  });
}

// POST /api/ai/chat — AI 助手对话接口
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ code: 400, message: '参数错误：需要 messages 数组' });
    }

    const result = await callDashScopeAPI(messages);

    // 返回 AI 的回复内容
    const reply = result.choices && result.choices[0] && result.choices[0].message
      ? result.choices[0].message.content
      : '抱歉，未能获取到回复';

    res.json({ code: 200, data: { reply } });
  } catch (err) {
    console.error('AI 助手调用失败:', err);
    res.status(500).json({ code: 500, message: err.message || 'AI 服务暂时不可用' });
  }
});

app.listen(PORT, () => {
  console.log('上传服务已启动: http://localhost:' + PORT);
});

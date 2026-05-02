# 头像上传服务

将用户上传的头像保存到阿里云 OSS（Bucket: zhili-kids-industry-system，华东1 杭州）。

## 配置

1. 复制 `.env.example` 为 `.env`（已提供 `.env` 时可直接使用）。
2. 在 `.env` 中填写：
   - `OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET`：阿里云 AccessKey（勿提交到 Git）。
   - `OSS_BUCKET`、`OSS_REGION`：已按当前 Bucket 填好。

## 运行

```bash
cd server
npm install
npm start
```

服务默认运行在 **http://localhost:8082**。

- 个人中心头像：`POST /api/upload/avatar`（图片，≤2MB）
- 企业注册营业执照：`POST /api/upload/license`（图片或 PDF，≤5MB）

## OSS 权限

如需通过返回的 URL 直接访问图片，请在阿里云 OSS 控制台将该 Bucket 的「读写」或「公共读」权限打开；否则需使用签名 URL。

## 安全说明

- AccessKey 仅保存在服务器端 `.env`，不要写进前端代码。
- `.env` 已加入 `.gitignore`，请勿提交到版本库。

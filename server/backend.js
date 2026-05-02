/**
 * 织里镇童装产业协同管理平台 - 后端 API 服务
 * 支持：订单管理、支付模拟、收货确认、商品评价、购物车、退款/售后
 * 数据存储：内存存储（重启后数据清空，如需持久化请配置数据库）
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.BACKEND_PORT || 8085;

// ==================== 中间件 ====================
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== 内存数据存储 ====================
const db = {
    // 用户（模拟）
    users: {},
    // 购物车 { userId: [cartItems] }
    carts: {},
    // 订单 { orderId: order }
    orders: {},
    // 评价 { reviewId: review }
    reviews: {},
    // 退款申请 { refundId: refund }
    refunds: {},
    // 产品（模拟示例数据）
    products: {}
};

// 初始化示例产品数据
function initProducts() {
    const sampleProducts = [
        { id: 1, name: '2023夏季男童短袖T恤', description: '纯棉材质，透气舒适，适合3-6岁儿童', price: 99, originalPrice: 129, sales: 352, enterpriseName: '浙江童趣服饰有限公司', imageUrl: '../images/products/boys/boys-tshirt-01.jpg', badge: 'new', category: '男童服装', ageRange: '3-6岁', season: '夏季', material: '棉质', certification: 'Oeko-Tex' },
        { id: 2, name: '男童弹力牛仔裤', description: '优质牛仔面料，柔软舒适，弹力设计', price: 78, originalPrice: 98, sales: 475, enterpriseName: '织里优质童装有限公司', imageUrl: '../images/products/boys/boys-pants-01.jpg', badge: 'hot', category: '男童服装', ageRange: '3-12岁', season: '全部', material: '牛仔', certification: '' },
        { id: 3, name: '婴幼儿有机棉连体衣', description: 'GOTS认证有机棉，无荧光剂，安全健康', price: 135, originalPrice: 168, sales: 286, enterpriseName: '快乐童年服饰有限公司', imageUrl: '../images/products/babies/babies-romper-01.jpg', badge: 'organic', category: '婴幼儿服装', ageRange: '0-1岁', season: '全部', material: '棉质', certification: 'GOTS有机' },
        { id: 4, name: '女童公主连衣裙', description: '精致蕾丝花边，甜美可爱，适合3-8岁女童', price: 128, originalPrice: 158, sales: 312, enterpriseName: '湖州小森林童装设计工作室', imageUrl: '../images/products/girls/girls-dress-01.jpg', badge: '', category: '女童服装', ageRange: '3-8岁', season: '夏季', material: '棉质', certification: '' },
        { id: 5, name: '冬季儿童羽绒服', description: '90%白鸭绒填充，保暖舒适，防风防水', price: 289, originalPrice: 389, sales: 265, enterpriseName: '浙江童趣服饰有限公司', imageUrl: '../images/products/seasonal/seasonal-down-01.jpg', badge: 'discount', category: '季节性服装', ageRange: '3-10岁', season: '冬季', material: '涤纶', certification: '' },
        { id: 6, name: '小学生校服', description: '耐磨面料，舒适透气，符合学校规范要求', price: 169, originalPrice: 199, sales: 198, enterpriseName: '织里校服定制中心', imageUrl: '../images/products/uniforms/uniforms-primary-01.jpg', badge: '', category: '校园制服', ageRange: '6-12岁', season: '全部', material: '混纺', certification: 'ISO9001' },
        { id: 7, name: '儿童汉服套装', description: '传统文化设计，精致绣花，适合节日及表演', price: 189, originalPrice: 238, sales: 178, enterpriseName: '织里镇创意童装设计工作室', imageUrl: '../images/products/special/special-hanfu-01.jpg', badge: 'new', category: '特色产品', ageRange: '3-12岁', season: '全部', material: '棉质', certification: '' },
        { id: 8, name: '男童休闲衬衫', description: '100%纯棉面料，休闲百搭，适合4-10岁男童', price: 69, originalPrice: 89, sales: 198, enterpriseName: '织里优质童装有限公司', imageUrl: '../images/products/boys/boys-shirt-01.jpg', badge: '', category: '男童服装', ageRange: '4-10岁', season: '春季', material: '棉质', certification: '' }
    ];
    sampleProducts.forEach(p => {
        db.products[p.id] = p;
    });
}
initProducts();

// ==================== 辅助函数 ====================

// 生成唯一ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

// 获取用户ID（从token模拟）
function getUserId(req) {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
        return null;
    }
    const token = auth.substring(7);
    // 简化处理：用token的hash作为用户ID
    return crypto.createHash('md5').update(token).digest('hex').substring(0, 8);
}

// 认证中间件
function authMiddleware(req, res, next) {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ code: 401, message: '请先登录' });
    }
    req.userId = userId;
    next();
}

// 订单状态映射
const orderStatusText = {
    'pending': '待支付',
    'paid': '已支付，待发货',
    'shipped': '已发货，待收货',
    'completed': '已完成',
    'cancelled': '已取消',
    'refund_pending': '退款中',
    'refund_approved': '退款已通过',
    'refund_rejected': '退款已拒绝',
    'refunded': '已退款'
};

// 退款状态映射
const refundStatusText = {
    'pending': '待审核',
    'approved': '审核通过，退款处理中',
    'rejected': '审核拒绝',
    'completed': '退款完成',
    'cancelled': '已取消'
};

// ==================== 产品 API ====================

// GET /api/products - 获取产品列表
app.get('/api/products', (req, res) => {
    const products = Object.values(db.products);
    res.json({ code: 200, data: products });
});

// GET /api/products/:id - 获取产品详情
app.get('/api/products/:id', (req, res) => {
    const product = db.products[parseInt(req.params.id)];
    if (!product) {
        return res.status(404).json({ code: 404, message: '产品不存在' });
    }
    res.json({ code: 200, data: product });
});

// GET /api/products/:id/reviews/summary - 获取产品评价统计
app.get('/api/products/:id/reviews/summary', (req, res) => {
    const productId = req.params.id;
    const reviews = Object.values(db.reviews).filter(r => r.productId == productId);
    
    if (reviews.length === 0) {
        return res.json({ code: 200, data: { averageRating: 0, reviewCount: 0 } });
    }
    
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    res.json({
        code: 200,
        data: {
            averageRating: Math.round(averageRating * 10) / 10,
            reviewCount: reviews.length
        }
    });
});

// ==================== 购物车 API ====================

// GET /api/auth/cart - 获取购物车列表
app.get('/api/auth/cart', authMiddleware, (req, res) => {
    const cartItems = db.carts[req.userId] || [];
    res.json({ code: 200, data: cartItems });
});

// GET /api/auth/cart/count - 获取购物车数量
app.get('/api/auth/cart/count', authMiddleware, (req, res) => {
    const cartItems = db.carts[req.userId] || [];
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ code: 200, data: count });
});

// POST /api/auth/cart - 添加到购物车
app.post('/api/auth/cart', authMiddleware, (req, res) => {
    const { productId, selectedColor, selectedSize, quantity } = req.body;
    
    const product = db.products[parseInt(productId)];
    if (!product) {
        return res.status(400).json({ code: 400, message: '产品不存在' });
    }
    
    if (!db.carts[req.userId]) {
        db.carts[req.userId] = [];
    }
    
    // 检查是否已存在相同规格的购物车项
    const existingItem = db.carts[req.userId].find(item => 
        item.productId == productId && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
    );
    
    if (existingItem) {
        existingItem.quantity += quantity || 1;
    } else {
        const cartItem = {
            id: generateId(),
            productId: parseInt(productId),
            productName: product.name,
            imageUrl: product.imageUrl,
            price: product.price,
            selectedColor: selectedColor || '默认',
            selectedSize: selectedSize || '默认',
            quantity: quantity || 1
        };
        db.carts[req.userId].push(cartItem);
    }
    
    res.json({ code: 200, message: '添加成功' });
});

// PUT /api/auth/cart/:id - 更新购物车数量
app.put('/api/auth/cart/:id', authMiddleware, (req, res) => {
    const { quantity } = req.body;
    const cartItems = db.carts[req.userId] || [];
    const item = cartItems.find(i => i.id === req.params.id);
    
    if (!item) {
        return res.status(404).json({ code: 404, message: '购物车项不存在' });
    }
    
    item.quantity = quantity;
    res.json({ code: 200, message: '更新成功' });
});

// DELETE /api/auth/cart/:id - 删除购物车项
app.delete('/api/auth/cart/:id', authMiddleware, (req, res) => {
    const cartItems = db.carts[req.userId] || [];
    const index = cartItems.findIndex(i => i.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ code: 404, message: '购物车项不存在' });
    }
    
    cartItems.splice(index, 1);
    res.json({ code: 200, message: '删除成功' });
});

// DELETE /api/auth/cart - 清空购物车
app.delete('/api/auth/cart', authMiddleware, (req, res) => {
    db.carts[req.userId] = [];
    res.json({ code: 200, message: '购物车已清空' });
});

// ==================== 订单 API ====================

// GET /api/auth/orders - 获取用户订单列表
app.get('/api/auth/orders', authMiddleware, (req, res) => {
    const orders = Object.values(db.orders)
        .filter(order => order.userId === req.userId)
        .map(order => ({
            ...order,
            statusText: orderStatusText[order.status] || order.status
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ code: 200, data: orders });
});

// GET /api/auth/orders/:id - 获取订单详情
app.get('/api/auth/orders/:id', authMiddleware, (req, res) => {
    const order = db.orders[req.params.id];
    
    if (!order) {
        return res.status(404).json({ code: 404, message: '订单不存在' });
    }
    
    if (order.userId !== req.userId) {
        return res.status(403).json({ code: 403, message: '无权访问该订单' });
    }
    
    res.json({
        code: 200,
        data: {
            ...order,
            statusText: orderStatusText[order.status] || order.status
        }
    });
});

// POST /api/auth/orders - 创建订单
app.post('/api/auth/orders', authMiddleware, (req, res) => {
    const { receiverName, receiverPhone, receiverAddress, items } = req.body;
    
    if (!receiverName || !receiverPhone || !receiverAddress) {
        return res.status(400).json({ code: 400, message: '请填写完整的收货信息' });
    }
    
    if (!items || items.length === 0) {
        return res.status(400).json({ code: 400, message: '订单项不能为空' });
    }
    
    const orderItems = [];
    let totalAmount = 0;
    
    for (const item of items) {
        const product = db.products[parseInt(item.productId)];
        if (!product) {
            return res.status(400).json({ code: 400, message: `产品 ${item.productId} 不存在` });
        }
        
        const quantity = item.quantity || 1;
        const orderItem = {
            id: generateId(),
            productId: product.id,
            productName: product.name,
            productImage: product.imageUrl,
            selectedColor: item.selectedColor || '默认',
            selectedSize: item.selectedSize || '默认',
            price: product.price,
            quantity: quantity
        };
        orderItems.push(orderItem);
        totalAmount += product.price * quantity;
    }
    
    const orderId = 'ORD' + generateId();
    const order = {
        id: orderId,
        userId: req.userId,
        receiverName,
        receiverPhone,
        receiverAddress,
        items: orderItems,
        totalAmount,
        status: 'pending', // 待支付
        trackingNo: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    db.orders[orderId] = order;
    
    // 如果是直接购买（不是从购物车），清空对应购物车项
    if (items.length === 1 && items[0].fromCart) {
        const cartItems = db.carts[req.userId] || [];
        const remaining = cartItems.filter(item => 
            !(item.productId == items[0].productId && 
              item.selectedColor === (items[0].selectedColor || '默认') && 
              item.selectedSize === (items[0].selectedSize || '默认'))
        );
        db.carts[req.userId] = remaining;
    }
    
    res.json({ code: 200, message: '订单创建成功', data: { orderId } });
});

// POST /api/auth/orders/:id/pay - 模拟支付
app.post('/api/auth/orders/:id/pay', authMiddleware, (req, res) => {
    const order = db.orders[req.params.id];
    
    if (!order) {
        return res.status(404).json({ code: 404, message: '订单不存在' });
    }
    
    if (order.userId !== req.userId) {
        return res.status(403).json({ code: 403, message: '无权操作该订单' });
    }
    
    if (order.status !== 'pending') {
        return res.status(400).json({ code: 400, message: '订单状态不允许支付' });
    }
    
    // 模拟支付成功
    order.status = 'paid';
    order.paidAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    
    res.json({ code: 200, message: '支付成功' });
});

// POST /api/auth/orders/:id/cancel - 取消订单
app.post('/api/auth/orders/:id/cancel', authMiddleware, (req, res) => {
    const order = db.orders[req.params.id];
    
    if (!order) {
        return res.status(404).json({ code: 404, message: '订单不存在' });
    }
    
    if (order.userId !== req.userId) {
        return res.status(403).json({ code: 403, message: '无权操作该订单' });
    }
    
    if (order.status !== 'pending') {
        return res.status(400).json({ code: 400, message: '订单状态不允许取消' });
    }
    
    order.status = 'cancelled';
    order.cancelledAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    
    res.json({ code: 200, message: '订单已取消' });
});

// POST /api/auth/orders/:id/confirm - 确认收货
app.post('/api/auth/orders/:id/confirm', authMiddleware, (req, res) => {
    const order = db.orders[req.params.id];
    
    if (!order) {
        return res.status(404).json({ code: 404, message: '订单不存在' });
    }
    
    if (order.userId !== req.userId) {
        return res.status(403).json({ code: 403, message: '无权操作该订单' });
    }
    
    if (order.status !== 'shipped') {
        return res.status(400).json({ code: 400, message: '订单状态不允许确认收货' });
    }
    
    order.status = 'completed';
    order.completedAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    
    res.json({ code: 200, message: '确认收货成功' });
});

// ==================== 销售订单 API（商家视角）====================

// GET /api/auth/orders/sales - 获取销售订单（商家订单）
app.get('/api/auth/orders/sales', authMiddleware, (req, res) => {
    // 获取当前用户的企业ID（这里简化为用userId关联）
    // 实际项目中应该根据企业认证信息查询
    const salesOrders = Object.values(db.orders)
        .filter(order => {
            // 模拟：只有已支付的订单才显示给商家
            return order.status === 'paid' || order.status === 'shipped' || order.status === 'completed';
        })
        .map(order => ({
            ...order,
            statusText: orderStatusText[order.status] || order.status
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ code: 200, data: salesOrders });
});

// POST /api/auth/orders/:id/ship - 商家发货
app.post('/api/auth/orders/:id/ship', authMiddleware, (req, res) => {
    const { trackingNo } = req.body;
    const order = db.orders[req.params.id];
    
    if (!order) {
        return res.status(404).json({ code: 404, message: '订单不存在' });
    }
    
    if (order.status !== 'paid') {
        return res.status(400).json({ code: 400, message: '订单状态不允许发货' });
    }
    
    if (!trackingNo) {
        return res.status(400).json({ code: 400, message: '请填写快递单号' });
    }
    
    order.status = 'shipped';
    order.trackingNo = trackingNo;
    order.shippedAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    
    res.json({ code: 200, message: '发货成功' });
});

// ==================== 商品评价 API ====================

// GET /api/auth/reviews/product/:productId - 获取产品评价列表
app.get('/api/auth/reviews/product/:productId', authMiddleware, (req, res) => {
    const productId = req.params.productId;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    
    const reviews = Object.values(db.reviews)
        .filter(r => r.productId == productId)
        .map(review => ({
            ...review,
            userNickname: review.userNickname || '匿名用户',
            userAvatar: review.userAvatar || ''
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 分页
    const startIndex = (page - 1) * pageSize;
    const pagedReviews = reviews.slice(startIndex, startIndex + pageSize);
    
    // 计算平均评分
    let averageRating = 0;
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        averageRating = totalRating / reviews.length;
    }
    
    res.json({
        code: 200,
        data: {
            reviews: pagedReviews,
            averageRating: Math.round(averageRating * 10) / 10,
            reviewCount: reviews.length
        }
    });
});

// POST /api/auth/reviews - 提交评价
app.post('/api/auth/reviews', authMiddleware, (req, res) => {
    const { orderId, orderItemId, productId, rating, content } = req.body;
    
    if (!productId || !rating || !content) {
        return res.status(400).json({ code: 400, message: '请填写完整的评价信息' });
    }
    
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ code: 400, message: '评分必须在1-5之间' });
    }
    
    if (content.length > 500) {
        return res.status(400).json({ code: 400, message: '评价内容不能超过500字' });
    }
    
    // 检查是否已评价过该订单项
    if (orderItemId) {
        const existingReview = Object.values(db.reviews).find(r => 
            r.orderItemId == orderItemId && r.userId === req.userId
        );
        if (existingReview) {
            return res.status(400).json({ code: 400, message: '您已评价过该商品' });
        }
    }
    
    const reviewId = generateId();
    const review = {
        id: reviewId,
        userId: req.userId,
        userNickname: '用户' + req.userId.substring(0, 4),
        orderId: orderId || null,
        orderItemId: orderItemId ? parseInt(orderItemId) : null,
        productId: parseInt(productId),
        rating: parseInt(rating),
        content: content.trim(),
        replyContent: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    db.reviews[reviewId] = review;
    
    res.json({ code: 200, message: '评价成功', data: { reviewId } });
});

// PUT /api/auth/reviews/:id/reply - 商家回复评价（可选功能）
app.put('/api/auth/reviews/:id/reply', authMiddleware, (req, res) => {
    const { replyContent } = req.body;
    const review = db.reviews[req.params.id];
    
    if (!review) {
        return res.status(404).json({ code: 404, message: '评价不存在' });
    }
    
    if (!replyContent) {
        return res.status(400).json({ code: 400, message: '请填写回复内容' });
    }
    
    review.replyContent = replyContent.trim();
    review.replyAt = new Date().toISOString();
    review.updatedAt = new Date().toISOString();
    
    res.json({ code: 200, message: '回复成功' });
});

// ==================== 退款/售后 API ====================

// GET /api/auth/refunds - 获取用户的退款申请列表
app.get('/api/auth/refunds', authMiddleware, (req, res) => {
    const refunds = Object.values(db.refunds)
        .filter(r => r.userId === req.userId)
        .map(refund => ({
            ...refund,
            statusText: refundStatusText[refund.status] || refund.status
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ code: 200, data: refunds });
});

// GET /api/auth/refunds/:id - 获取退款详情
app.get('/api/auth/refunds/:id', authMiddleware, (req, res) => {
    const refund = db.refunds[req.params.id];
    
    if (!refund) {
        return res.status(404).json({ code: 404, message: '退款申请不存在' });
    }
    
    if (refund.userId !== req.userId) {
        return res.status(403).json({ code: 403, message: '无权访问该退款申请' });
    }
    
    res.json({
        code: 200,
        data: {
            ...refund,
            statusText: refundStatusText[refund.status] || refund.status
        }
    });
});

// POST /api/auth/refunds - 提交退款申请
app.post('/api/auth/refunds', authMiddleware, (req, res) => {
    const { orderId, reason, type, description } = req.body;
    
    if (!orderId || !reason) {
        return res.status(400).json({ code: 400, message: '请填写完整的退款信息' });
    }
    
    const order = db.orders[orderId];
    if (!order) {
        return res.status(404).json({ code: 404, message: '订单不存在' });
    }
    
    if (order.userId !== req.userId) {
        return res.status(403).json({ code: 403, message: '无权操作该订单' });
    }
    
    // 检查订单状态：已支付或已发货或已完成可以申请退款
    const refundableStatuses = ['paid', 'shipped', 'completed'];
    if (!refundableStatuses.includes(order.status)) {
        return res.status(400).json({ code: 400, message: '该订单状态不允许申请退款' });
    }
    
    // 检查是否有待处理的退款申请
    const existingRefund = Object.values(db.refunds).find(r => 
        r.orderId === orderId && r.status === 'pending'
    );
    if (existingRefund) {
        return res.status(400).json({ code: 400, message: '该订单已有待处理的退款申请' });
    }
    
    // 计算退款金额（默认全额退款）
    const refundAmount = order.totalAmount;
    
    const refundId = 'REF' + generateId();
    const refund = {
        id: refundId,
        userId: req.userId,
        orderId: orderId,
        order: {
            id: order.id,
            items: order.items,
            totalAmount: order.totalAmount,
            receiverName: order.receiverName,
            receiverPhone: order.receiverPhone,
            receiverAddress: order.receiverAddress
        },
        type: type || 'refund', // refund=仅退款, return=退货退款
        reason: reason,
        description: description || '',
        refundAmount: refundAmount,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    db.refunds[refundId] = refund;
    
    // 更新订单状态为退款中
    order.status = 'refund_pending';
    order.refundId = refundId;
    order.updatedAt = new Date().toISOString();
    
    res.json({ code: 200, message: '退款申请提交成功', data: { refundId } });
});

// DELETE /api/auth/refunds/:id - 取消退款申请
app.delete('/api/auth/refunds/:id', authMiddleware, (req, res) => {
    const refund = db.refunds[req.params.id];
    
    if (!refund) {
        return res.status(404).json({ code: 404, message: '退款申请不存在' });
    }
    
    if (refund.userId !== req.userId) {
        return res.status(403).json({ code: 403, message: '无权操作该退款申请' });
    }
    
    if (refund.status !== 'pending') {
        return res.status(400).json({ code: 400, message: '只有待审核的退款申请可以取消' });
    }
    
    // 更新退款状态
    refund.status = 'cancelled';
    refund.cancelledAt = new Date().toISOString();
    refund.updatedAt = new Date().toISOString();
    
    // 恢复订单状态（根据之前的状态恢复）
    const order = db.orders[refund.orderId];
    if (order && order.status === 'refund_pending') {
        // 查找是否有之前的退款记录，如果有则保持退款状态
        const otherRefunds = Object.values(db.refunds).filter(r => 
            r.orderId === refund.orderId && r.id !== refund.id && r.status !== 'cancelled'
        );
        if (otherRefunds.length === 0) {
            // 恢复订单到已完成状态（因为原来的订单状态可能是completed）
            order.status = 'completed';
        } else {
            // 保持退款中状态
            order.status = 'refund_pending';
        }
        delete order.refundId;
        order.updatedAt = new Date().toISOString();
    }
    
    res.json({ code: 200, message: '退款申请已取消' });
});

// ==================== 商家退款管理 API ====================

// GET /api/auth/refunds/seller - 商家获取退款申请列表
app.get('/api/auth/refunds/seller', authMiddleware, (req, res) => {
    // 获取所有退款申请（实际项目中应该根据商家店铺筛选）
    const refunds = Object.values(db.refunds)
        .filter(r => r.status !== 'cancelled')
        .map(refund => ({
            ...refund,
            statusText: refundStatusText[refund.status] || refund.status
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ code: 200, data: refunds });
});

// POST /api/auth/refunds/:id/approve - 商家审核通过退款
app.post('/api/auth/refunds/:id/approve', authMiddleware, (req, res) => {
    const { remark } = req.body;
    const refund = db.refunds[req.params.id];
    
    if (!refund) {
        return res.status(404).json({ code: 404, message: '退款申请不存在' });
    }
    
    if (refund.status !== 'pending') {
        return res.status(400).json({ code: 400, message: '只有待审核的退款申请可以审核' });
    }
    
    // 更新退款状态为审核通过
    refund.status = 'approved';
    refund.approvedAt = new Date().toISOString();
    refund.approvedRemark = remark || '';
    refund.updatedAt = new Date().toISOString();
    
    // 更新订单状态
    const order = db.orders[refund.orderId];
    if (order) {
        order.status = 'refund_approved';
        order.updatedAt = new Date().toISOString();
    }
    
    res.json({ code: 200, message: '退款申请已通过，款项将退回您的账户' });
});

// POST /api/auth/refunds/:id/reject - 商家审核拒绝退款
app.post('/api/auth/refunds/:id/reject', authMiddleware, (req, res) => {
    const { remark } = req.body;
    const refund = db.refunds[req.params.id];
    
    if (!refund) {
        return res.status(404).json({ code: 404, message: '退款申请不存在' });
    }
    
    if (refund.status !== 'pending') {
        return res.status(400).json({ code: 400, message: '只有待审核的退款申请可以审核' });
    }
    
    if (!remark) {
        return res.status(400).json({ code: 400, message: '请填写拒绝原因' });
    }
    
    // 更新退款状态为审核拒绝
    refund.status = 'rejected';
    refund.rejectedAt = new Date().toISOString();
    refund.rejectedRemark = remark;
    refund.updatedAt = new Date().toISOString();
    
    // 更新订单状态（根据原状态恢复）
    const order = db.orders[refund.orderId];
    if (order) {
        // 恢复订单到之前的状态
        if (order.refundId === refund.id) {
            order.status = 'completed';
            delete order.refundId;
        }
        order.updatedAt = new Date().toISOString();
    }
    
    res.json({ code: 200, message: '退款申请已拒绝' });
});

// POST /api/auth/refunds/:id/complete - 完成退款（模拟）
app.post('/api/auth/refunds/:id/complete', authMiddleware, (req, res) => {
    const refund = db.refunds[req.params.id];
    
    if (!refund) {
        return res.status(404).json({ code: 404, message: '退款申请不存在' });
    }
    
    if (refund.status !== 'approved') {
        return res.status(400).json({ code: 400, message: '只有审核通过的退款可以完成' });
    }
    
    // 模拟退款完成
    refund.status = 'completed';
    refund.completedAt = new Date().toISOString();
    refund.updatedAt = new Date().toISOString();
    
    // 更新订单状态为已退款
    const order = db.orders[refund.orderId];
    if (order) {
        order.status = 'refunded';
        order.updatedAt = new Date().toISOString();
    }
    
    res.json({ code: 200, message: '退款已完成，款项已退回您的账户' });
});

// ==================== 课程订单 API（简化版）====================

// GET /api/auth/training-orders - 获取课程订单
app.get('/api/auth/training-orders', authMiddleware, (req, res) => {
    // 简化处理：返回空列表或示例数据
    res.json({ code: 200, data: [] });
});

// POST /api/auth/training-orders - 创建课程订单
app.post('/api/auth/training-orders', authMiddleware, (req, res) => {
    const { courseId, courseName, price } = req.body;
    
    const orderId = 'TRN' + generateId();
    const order = {
        id: orderId,
        userId: req.userId,
        courseId: courseId,
        courseName: courseName || '培训课程',
        price: price || 0,
        status: 'paid',
        createdAt: new Date().toISOString()
    };
    
    db.orders[orderId] = order;
    
    res.json({ code: 200, message: '订单创建成功', data: { orderId } });
});

// ==================== 健康检查 ====================
app.get('/api/health', (req, res) => {
    res.json({ code: 200, message: 'OK', timestamp: new Date().toISOString() });
});

// ==================== 启动服务器 ====================
app.listen(PORT, () => {
    console.log(`后端API服务已启动: http://localhost:${PORT}`);
    console.log('支持的功能:');
    console.log('  - 产品列表/详情');
    console.log('  - 购物车管理');
    console.log('  - 订单管理（创建/支付/取消/发货/确认收货）');
    console.log('  - 商品评价');
    console.log('  - 退款/售后');
    console.log('  - 课程订单');
});

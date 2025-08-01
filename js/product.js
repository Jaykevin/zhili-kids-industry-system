document.addEventListener('DOMContentLoaded', function () {
    // 全局筛选状态对象
    window.filterState = {
        category: "全部产品",
        ageRange: "全部",
        season: "全部",
        priceRange: "全部",
        material: "全部",
        certification: "全部",
        sortMethod: "recommend"
    };

    // 全局购物车数据
    window.cartItems = [];

    // 原始产品数据备份
    window.originalProductData = [];

    // 初始化产品数据和分页
    initProductData();
    // 备份原始数据
    window.originalProductData = [...window.productData];
    initPagination();

    // 初始化模态框
    initProductModal();

    // 初始化购物车图标
    initCartIcon();

    // 产品分类切换
    const categories = document.querySelectorAll('.product-categories .category');

    categories.forEach(category => {
        category.addEventListener('click', function () {
            // 移除所有分类的active类
            categories.forEach(cat => cat.classList.remove('active'));

            // 添加当前点击分类的active类
            this.classList.add('active');

            // 获取分类名称
            const categoryName = this.querySelector('span').textContent;

            // 更新筛选状态
            window.filterState.category = categoryName;

            // 筛选产品
            applyFilters();
        });
    });

    // 筛选选项点击
    const filterOptions = document.querySelectorAll('.filter-option');

    filterOptions.forEach(option => {
        option.addEventListener('click', function () {
            // 获取当前选项所在的筛选组
            const filterGroup = this.parentElement;

            // 移除该组内其他选项的active类
            filterGroup.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('active'));

            // 添加当前选项的active类
            this.classList.add('active');

            // 更新筛选状态
            const filterType = this.parentElement.previousElementSibling.textContent.replace('：', '');
            const filterValue = this.textContent;

            switch (filterType) {
                case '年龄段':
                    window.filterState.ageRange = filterValue;
                    break;
                case '季节':
                    window.filterState.season = filterValue;
                    break;
                case '价格':
                    window.filterState.priceRange = filterValue;
                    break;
                case '材质':
                    window.filterState.material = filterValue;
                    break;
                case '认证':
                    window.filterState.certification = filterValue;
                    break;
            }

            // 应用所有筛选条件
            applyFilters();
        });
    });

    // 排序选择
    const sortSelect = document.getElementById('product-sort');

    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            // 获取排序方式
            const sortMethod = this.value;

            // 更新筛选状态
            window.filterState.sortMethod = sortMethod;
            
            // 应用排序
            applyFilters();
        });
    }

    // 搜索功能
    const searchBox = document.querySelector('.search-box');

    if (searchBox) {
        searchBox.querySelector('button').addEventListener('click', function (e) {
            e.preventDefault();

            // 获取搜索关键词
            const keyword = searchBox.querySelector('input').value.trim();

            if (keyword) {
                // 执行搜索
                searchProducts(keyword);
            } else {
                showNotification('请输入搜索关键词', 'warning');
            }
        });
        
        // 回车键搜索
        searchBox.querySelector('input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const keyword = this.value.trim();
                if (keyword) {
                    searchProducts(keyword);
                } else {
                    showNotification('请输入搜索关键词', 'warning');
                }
            }
        });
    }
    
    // 应用所有筛选条件并更新显示
    function applyFilters() {
        showNotification('正在应用筛选条件...', 'info');
        
        // 重置产品数据为原始数据
        window.productData = [...window.originalProductData];
        
        // 应用类别筛选
        if (window.filterState.category !== "全部产品") {
            window.productData = window.productData.filter(product => 
                product.category.includes(window.filterState.category));
        }
        
        // 应用年龄段筛选
        if (window.filterState.ageRange !== "全部") {
            window.productData = window.productData.filter(product => {
                // 检查产品年龄段是否包含或匹配所选年龄段
                if (!product.ageRange) return false;
                return product.ageRange.includes(window.filterState.ageRange) || 
                       product.ageRange === "全部";
            });
        }
        
        // 应用季节筛选
        if (window.filterState.season !== "全部") {
            window.productData = window.productData.filter(product => {
                if (!product.season) return false;
                return product.season.includes(window.filterState.season) || 
                       product.season === "全部";
            });
        }
        
        // 应用价格筛选
        if (window.filterState.priceRange !== "全部") {
            window.productData = window.productData.filter(product => {
                const price = parseFloat(product.price.current.replace('¥', ''));
                
                switch (window.filterState.priceRange) {
                    case '50元以下':
                        return price < 50;
                    case '50-100元':
                        return price >= 50 && price <= 100;
                    case '100-200元':
                        return price > 100 && price <= 200;
                    case '200-500元':
                        return price > 200 && price <= 500;
                    case '500元以上':
                        return price > 500;
                    default:
                        return true;
                }
            });
        }
        
        // 应用材质筛选
        if (window.filterState.material !== "全部") {
            window.productData = window.productData.filter(product => {
                if (!product.material) return false;
                return product.material === window.filterState.material;
            });
        }
        
        // 应用认证筛选
        if (window.filterState.certification !== "全部") {
            window.productData = window.productData.filter(product => {
                if (!product.certification) return false;
                return product.certification.includes(window.filterState.certification);
            });
        }
        
        // 应用排序
        applySorting(window.filterState.sortMethod);
        
        // 更新页面显示
        if (window.productData.length > 0) {
            showPage(1);
            showNotification(`找到${window.productData.length}个符合条件的产品`, 'success');
        } else {
            // 无筛选结果时显示提示信息
            const productList = document.querySelector('.product-list');
            productList.innerHTML = '<div class="no-results">没有找到符合条件的产品，请尝试其他筛选条件</div>';
            showNotification('没有找到符合条件的产品', 'warning');
            
            // 隐藏分页
            document.querySelector('.pagination').style.display = 'none';
        }
    }
    
    // 应用排序
    function applySorting(sortMethod) {
        switch (sortMethod) {
            case 'price-asc':
                window.productData.sort((a, b) => {
                    const priceA = parseFloat(a.price.current.replace('¥', ''));
                    const priceB = parseFloat(b.price.current.replace('¥', ''));
                    return priceA - priceB;
                });
                break;
            case 'price-desc':
                window.productData.sort((a, b) => {
                    const priceA = parseFloat(a.price.current.replace('¥', ''));
                    const priceB = parseFloat(b.price.current.replace('¥', ''));
                    return priceB - priceA;
                });
                break;
            case 'sales':
                window.productData.sort((a, b) => b.sales - a.sales);
                break;
            case 'new':
                // 这里我们假设新品都有new标签
                window.productData.sort((a, b) => {
                    if (a.badge && a.badge.type === 'new') return -1;
                    if (b.badge && b.badge.type === 'new') return 1;
                    return 0;
                });
                break;
            case 'recommend':
            default:
                // 默认排序保持原样，假设原始数据已经是按推荐排序的
                break;
        }
    }
    
    // 搜索产品
    function searchProducts(keyword) {
        showNotification(`正在搜索"${keyword}"...`, 'info');
        
        // 重置产品数据为原始数据
        window.productData = [...window.originalProductData];
        
        // 执行搜索过滤
        window.productData = window.productData.filter(product => {
            return product.title.includes(keyword) || 
                   product.description.includes(keyword) ||
                   product.company.includes(keyword) ||
                   product.category.includes(keyword) ||
                   (product.material && product.material.includes(keyword));
        });
        
        // 更新页面显示
        if (window.productData.length > 0) {
            showPage(1);
            showNotification(`找到${window.productData.length}个与"${keyword}"相关的产品`, 'success');
        } else {
            // 无搜索结果时显示提示信息
            const productList = document.querySelector('.product-list');
            productList.innerHTML = '<div class="no-results">没有找到与"' + keyword + '"相关的产品</div>';
            showNotification(`未找到与"${keyword}"相关的产品`, 'warning');
            
            // 隐藏分页
            document.querySelector('.pagination').style.display = 'none';
        }
    }
    
    // 重置所有筛选条件
    function resetFilters() {
        // 重置筛选状态
        window.filterState = {
            category: "全部产品",
            ageRange: "全部",
            season: "全部",
            priceRange: "全部",
            material: "全部",
            certification: "全部",
            sortMethod: "recommend"
        };
        
        // 重置UI状态
        document.querySelectorAll('.category').forEach(cat => {
            cat.classList.remove('active');
            if (cat.querySelector('span').textContent === "全部产品") {
                cat.classList.add('active');
            }
        });
        
        document.querySelectorAll('.filter-options').forEach(group => {
            group.querySelectorAll('.filter-option').forEach((opt, index) => {
                opt.classList.remove('active');
                if (index === 0) opt.classList.add('active'); // 第一个选项是"全部"
            });
        });
        
        // 重置排序选择
        if (document.getElementById('product-sort')) {
            document.getElementById('product-sort').value = 'recommend';
        }
        
        // 重置产品数据
        window.productData = [...window.originalProductData];
        
        // 更新显示
        showPage(1);
        
        // 显示分页
        document.querySelector('.pagination').style.display = 'flex';
        
        showNotification('已重置所有筛选条件', 'success');
    }
    
    // 将重置筛选函数暴露给全局，以便可以从UI调用
    window.resetProductFilters = resetFilters;

    // ===== 产品分页功能 =====
    function initPagination() {
        let currentPage = 1;
        const totalPages = Math.ceil(productData.length / 6); // 每页6个产品

        // 获取分页按钮
        const pageLinks = document.querySelectorAll('.pagination a');

        // 初始化页面显示
        showPage(currentPage);

        // 为所有分页按钮添加点击事件
        pageLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                const pageAction = this.getAttribute('data-page');
                console.log("点击分页按钮:", pageAction);

                let newPage = currentPage;

                // 处理不同的分页操作
                if (pageAction === 'prev' && currentPage > 1) {
                    newPage = currentPage - 1;
                } else if (pageAction === 'next' && currentPage < totalPages) {
                    newPage = currentPage + 1;
                } else if (!isNaN(parseInt(pageAction))) {
                    newPage = parseInt(pageAction);
                }

                // 如果页码改变，则更新显示
                if (newPage !== currentPage) {
                    currentPage = newPage;
                    showPage(currentPage);
                }
            });
        });
    }

    // 显示指定页面的产品卡片
    function showPage(pageNum) {
        console.log("显示产品页面:", pageNum);

        // 1. 更新分页按钮状态
        const pageLinks = document.querySelectorAll('.pagination a');
        const totalPages = Math.ceil(productData.length / 6); // 每页6个产品

        pageLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');

            // 移除所有active类
            link.classList.remove('active');

            // 设置当前页为active
            if (linkPage == pageNum) {
                link.classList.add('active');
            }

            // 处理上一页和下一页按钮
            if (linkPage === 'prev') {
                if (pageNum <= 1) {
                    link.classList.add('disabled');
                } else {
                    link.classList.remove('disabled');
                }
            } else if (linkPage === 'next') {
                if (pageNum >= totalPages) {
                    link.classList.add('disabled');
                } else {
                    link.classList.remove('disabled');
                }
            }
        });

        // 2. 计算当前页的产品索引范围
        const startIndex = (pageNum - 1) * 6;
        const endIndex = Math.min(startIndex + 6, productData.length);

        // 3. 清空产品列表
        const productList = document.querySelector('.product-list');
        productList.innerHTML = '';

        // 4. 添加当前页的产品
        for (let i = startIndex; i < endIndex; i++) {
            const product = productData[i];

            // 创建产品卡片元素
            const productCard = createProductCard(product);

            // 将产品卡片添加到产品列表
            productList.appendChild(productCard);
        }

        // 5. 重新绑定产品卡片事件
        initProductCardEvents();

        console.log(`第${pageNum}页显示了${endIndex - startIndex}个产品`);
    }

    // 创建产品卡片HTML元素
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';

        // 添加徽章
        if (product.badge) {
            const badge = document.createElement('div');
            badge.className = `product-badge ${product.badge.type}`;
            badge.textContent = product.badge.text;
            card.appendChild(badge);
        }

        // 添加产品图片
        const imageContainer = document.createElement('div');
        imageContainer.className = 'product-image';
        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.title;
        imageContainer.appendChild(image);
        card.appendChild(imageContainer);

        // 添加产品信息
        const infoContainer = document.createElement('div');
        infoContainer.className = 'product-info';

        // 产品标题
        const title = document.createElement('h3');
        title.textContent = product.title;
        infoContainer.appendChild(title);

        // 产品描述
        const description = document.createElement('p');
        description.className = 'product-desc';
        description.textContent = product.description;
        infoContainer.appendChild(description);

        // 价格和销量
        const meta = document.createElement('div');
        meta.className = 'product-meta';

        const price = document.createElement('div');
        price.className = 'product-price';

        const currentPrice = document.createElement('span');
        currentPrice.className = 'price-current';
        currentPrice.textContent = product.price.current;
        price.appendChild(currentPrice);

        const originalPrice = document.createElement('span');
        originalPrice.className = 'price-original';
        originalPrice.textContent = product.price.original;
        price.appendChild(originalPrice);

        meta.appendChild(price);

        const sales = document.createElement('div');
        sales.className = 'product-sales';
        sales.textContent = `月销 ${product.sales}件`;
        meta.appendChild(sales);

        infoContainer.appendChild(meta);

        // 企业信息和操作按钮
        const footer = document.createElement('div');
        footer.className = 'product-footer';

        const company = document.createElement('div');
        company.className = 'product-company';
        company.textContent = product.company;
        footer.appendChild(company);

        const actions = document.createElement('div');
        actions.className = 'product-actions';

        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'btn-outline btn-sm';
        addToCartBtn.innerHTML = '<i class="bi bi-cart-plus"></i> 加入购物车';
        actions.appendChild(addToCartBtn);

        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'btn-icon btn-sm';
        favoriteBtn.innerHTML = '<i class="bi bi-heart"></i>';
        actions.appendChild(favoriteBtn);

        footer.appendChild(actions);
        infoContainer.appendChild(footer);

        card.appendChild(infoContainer);

        return card;
    }

    // 初始化产品卡片事件
    function initProductCardEvents() {
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            // 给产品图片添加点击事件，打开产品预览模态框
            card.querySelector('.product-image').addEventListener('click', function () {
                openProductPreview(card);
            });

            // 给产品标题添加点击事件，打开产品预览模态框
            card.querySelector('h3').addEventListener('click', function () {
                openProductPreview(card);
            });

            // 给加入购物车按钮添加点击事件
            const addToCartBtn = card.querySelector('.btn-outline');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', function (e) {
                    e.stopPropagation(); // 阻止事件冒泡

                    // 获取产品信息
                    const productTitle = card.querySelector('h3').textContent;
                    const productImage = card.querySelector('.product-image img').src;

                    // 模拟添加购物车
                    simulateAddToCart(productTitle, productImage);
                });
            }

            // 给收藏按钮添加点击事件
            const favoriteBtn = card.querySelector('.btn-icon');
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', function (e) {
                    e.stopPropagation(); // 阻止事件冒泡

                    // 切换收藏状态
                    this.classList.toggle('favorited');

                    if (this.classList.contains('favorited')) {
                        this.style.color = '#f44336';
                        this.style.borderColor = '#f44336';

                        // 获取产品信息
                        const productTitle = card.querySelector('h3').textContent;

                        // 显示收藏成功提示
                        showNotification(`已收藏商品：${productTitle}`, 'success');
                    } else {
                        this.style.color = '';
                        this.style.borderColor = '';
                    }
                });
            }
        });
    }

    // ===== 初始化产品数据 =====
    function initProductData() {
        // 这里定义产品数据，实际应用中可以通过API获取
        window.productData = [
            {
                title: "2023夏季男童短袖T恤",
                description: "纯棉材质，透气舒适，适合3-6岁儿童",
                price: { current: "¥99.00", original: "¥129.00" },
                sales: 352,
                company: "浙江童趣服饰有限公司",
                image: "../images/products/boys/boys-tshirt-01.jpg",
                badge: { type: "new", text: "新品" },
                category: "全部产品,男童服装",
                ageRange: "3-6岁",
                season: "夏季",
                material: "棉质"
            },
            {
                title: "男童弹力牛仔裤",
                description: "优质牛仔面料，柔软舒适，弹力设计，活动自如",
                price: { current: "¥78.00", original: "¥98.00" },
                sales: 475,
                company: "织里优质童装有限公司",
                image: "../images/products/boys/boys-pants-01.jpg",
                badge: { type: "hot", text: "热销" },
                category: "全部产品,男童服装",
                ageRange: "6-9岁",
                season: "春季,秋季",
                material: "牛仔"
            },
            {
                title: "婴幼儿有机棉连体衣",
                description: "GOTS认证有机棉，无荧光剂，安全健康，适合0-1岁宝宝",
                price: { current: "¥135.00", original: "¥168.00" },
                sales: 286,
                company: "快乐童年服饰有限公司",
                image: "../images/products/babies/babies-romper-01.jpg",
                badge: { type: "organic", text: "有机" },
                category: "全部产品,婴幼儿服装",
                ageRange: "0-1岁",
                season: "全部",
                material: "棉质",
                certification: "GOTS有机"
            },
            {
                title: "女童公主连衣裙",
                description: "精致蕾丝花边，甜美可爱，适合3-8岁女童，多色可选",
                price: { current: "¥128.00", original: "¥158.00" },
                sales: 312,
                company: "湖州小森林童装设计工作室",
                image: "../images/products/girls/girls-dress-01.jpg",
                badge: null,
                category: "全部产品,女童服装",
                ageRange: "3-6岁",
                season: "春季,夏季",
                material: "混纺"
            },
            {
                title: "冬季儿童羽绒服",
                description: "90%白鸭绒填充，保暖舒适，防风防水，适合3-10岁儿童",
                price: { current: "¥289.00", original: "¥389.00" },
                sales: 265,
                company: "浙江童趣服饰有限公司",
                image: "../images/products/seasonal/seasonal-down-01.jpg",
                badge: { type: "discount", text: "特惠" },
                category: "全部产品,男童服装,女童服装,季节性服装",
                ageRange: "3-6岁,6-9岁",
                season: "冬季",
                material: "羊毛"
            },
            {
                title: "男童休闲衬衫",
                description: "100%纯棉面料，休闲百搭，适合4-10岁男童",
                price: { current: "¥69.00", original: "¥89.00" },
                sales: 198,
                company: "织里优质童装有限公司",
                image: "../images/products/boys/boys-shirt-01.jpg",
                badge: null,
                category: "全部产品,男童服装",
                ageRange: "3-6岁,6-9岁",
                season: "春季,秋季",
                material: "棉质"
            },
            {
                title: "小学生校服",
                description: "耐磨面料，舒适透气，符合学校规范要求，多尺码可选",
                price: { current: "¥169.00", original: "¥199.00" },
                sales: 203,
                company: "织里校服定制中心",
                image: "../images/products/uniforms/uniforms-primary-01.jpg",
                badge: null,
                category: "全部产品,校园制服",
                ageRange: "6-9岁,9-12岁",
                season: "春季,秋季",
                material: "混纺"
            },
            {
                title: "儿童汉服套装",
                description: "传统文化设计，精致绣花，适合节日及表演活动，多种款式",
                price: { current: "¥189.00", original: "¥238.00" },
                sales: 178,
                company: "织里镇创意童装设计工作室",
                image: "../images/products/special/special-hanfu-01.jpg",
                badge: { type: "new", text: "新品" },
                category: "全部产品,特色产品",
                ageRange: "3-6岁,6-9岁,9-12岁",
                season: "全部",
                material: "棉麻"
            },
            {
                title: "幼儿园校服",
                description: "柔软舒适，活泼可爱，易于穿脱，适合2-6岁儿童",
                price: { current: "¥158.00", original: "¥188.00" },
                sales: 203,
                company: "织里校服定制中心",
                image: "../images/products/uniforms/uniforms-kindergarten-01.jpg",
                badge: null,
                category: "全部产品,校园制服",
                ageRange: "1-3岁,3-6岁",
                season: "春季,秋季",
                material: "棉质"
            },
            {
                title: "婴儿连体爬服",
                description: "柔软针织面料，宽松设计，不勒不紧，适合0-2岁宝宝",
                price: { current: "¥89.00", original: "¥109.00" },
                sales: 325,
                company: "快乐童年服饰有限公司",
                image: "../images/products/babies/babies-romper-02.jpg",
                badge: { type: "hot", text: "热销" },
                category: "全部产品,婴幼儿服装",
                ageRange: "0-1岁,1-3岁",
                season: "春季,秋季",
                material: "针织",
                certification: "Oeko-Tex"
            },
            {
                title: "女童蓬蓬裙",
                description: "立体设计，轻盈飘逸，适合3-8岁小女孩参加派对活动",
                price: { current: "¥128.00", original: "¥168.00" },
                sales: 156,
                company: "湖州小森林童装设计工作室",
                image: "../images/products/girls/girls-skirt-01.jpg",
                badge: null,
                category: "全部产品,女童服装",
                ageRange: "3-6岁,6-9岁",
                season: "春季,夏季",
                material: "混纺"
            },
            {
                title: "儿童防晒衣",
                description: "UPF50+防晒面料，轻薄透气，适合夏季户外活动",
                price: { current: "¥79.00", original: "¥99.00" },
                sales: 289,
                company: "动感童年运动服饰有限公司",
                image: "../images/products/seasonal/seasonal-sun-01.jpg",
                badge: { type: "discount", text: "特惠" },
                category: "全部产品,男童服装,女童服装,季节性服装",
                ageRange: "3-6岁,6-9岁,9-12岁",
                season: "夏季",
                material: "涤纶"
            },
            {
                title: "儿童毛衣",
                description: "柔软亲肤羊毛混纺，保暖不扎身，适合3-10岁儿童",
                price: { current: "¥119.00", original: "¥149.00" },
                sales: 178,
                company: "织里优质童装有限公司",
                image: "../images/products/seasonal/seasonal-sweater-01.jpg",
                badge: null,
                category: "全部产品,男童服装,女童服装,季节性服装",
                ageRange: "3-6岁,6-9岁",
                season: "秋季,冬季",
                material: "羊毛"
            },
            {
                title: "儿童睡衣套装",
                description: "纯棉面料，柔软舒适，可爱卡通图案，适合2-12岁儿童",
                price: { current: "¥89.00", original: "¥119.00" },
                sales: 253,
                company: "浙江童趣服饰有限公司",
                image: "../images/products/special/special-pajamas-01.jpg",
                badge: null,
                category: "全部产品,特色产品",
                ageRange: "1-3岁,3-6岁,6-9岁,9-12岁",
                season: "全部",
                material: "棉质"
            },
            {
                title: "女童牛仔背带裙",
                description: "优质牛仔面料，经典设计，百搭易搭配，适合3-10岁女童",
                price: { current: "¥108.00", original: "¥138.00" },
                sales: 178,
                company: "织里优质童装有限公司",
                image: "../images/products/girls/girls-pants-01.jpg",
                badge: null,
                category: "全部产品,女童服装",
                ageRange: "3-6岁,6-9岁",
                season: "春季,秋季",
                material: "牛仔"
            },
            {
                title: "婴儿保暖背心",
                description: "天然彩棉填充，轻薄保暖，适合0-3岁宝宝四季穿着",
                price: { current: "¥69.00", original: "¥89.00" },
                sales: 213,
                company: "快乐童年服饰有限公司",
                image: "../images/products/babies/babies-vest-01.jpg",
                badge: null,
                category: "全部产品,婴幼儿服装",
                ageRange: "0-1岁,1-3岁",
                season: "秋季,冬季",
                material: "棉质",
                certification: "Oeko-Tex"
            },
            {
                title: "男童马甲背心",
                description: "轻便保暖，内外可穿，多色可选，适合3-12岁儿童",
                price: { current: "¥79.00", original: "¥99.00" },
                sales: 167,
                company: "浙江童趣服饰有限公司",
                image: "../images/products/boys/boys-vest-01.jpg",
                badge: null,
                category: "全部产品,男童服装,季节性服装",
                ageRange: "3-6岁,6-9岁,9-12岁",
                season: "春季,秋季",
                material: "混纺"
            }
        ];

        console.log(`产品数据初始化完成，共${productData.length}个产品`);
    }

    // 初始化产品预览模态框
    function initProductModal() {
        const modal = document.getElementById('productPreviewModal');

        if (modal) {
            // 关闭模态框
            const closeModal = modal.querySelector('.close-modal');
            if (closeModal) {
                closeModal.addEventListener('click', function () {
                    modal.style.display = 'none';
                });
            }

            // 点击模态框外部关闭模态框
            window.addEventListener('click', function (event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });

            // 颜色和尺码选项点击
            const options = modal.querySelectorAll('.select-options .option');
            options.forEach(option => {
                option.addEventListener('click', function () {
                    // 获取当前选项组
                    const optionGroup = this.parentElement;

                    // 移除该组内其他选项的active类
                    optionGroup.querySelectorAll('.option').forEach(opt => opt.classList.remove('active'));

                    // 添加当前选项的active类
                    this.classList.add('active');
                });
            });

            // 数量增减
            const quantityDecrease = modal.querySelector('.quantity-decrease');
            const quantityIncrease = modal.querySelector('.quantity-increase');
            const quantityInput = modal.querySelector('.quantity-control input');

            quantityDecrease.addEventListener('click', function () {
                let currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            });

            quantityIncrease.addEventListener('click', function () {
                let currentValue = parseInt(quantityInput.value);
                const maxValue = parseInt(quantityInput.getAttribute('max') || '99');
                if (currentValue < maxValue) {
                    quantityInput.value = currentValue + 1;
                } else {
                    showNotification('已达到最大购买数量', 'warning');
                }
            });

            // 加入购物车按钮
            const addToCartBtn = modal.querySelector('.btn-primary');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', function () {
                    // 获取商品信息
                    const productTitle = modal.querySelector('.preview-details h2').textContent;
                    const selectedColor = modal.querySelector('.select-item:nth-child(1) .option.active').textContent;
                    const selectedSize = modal.querySelector('.select-item:nth-child(2) .option.active').textContent;
                    const quantity = quantityInput.value;
                    const productImage = modal.querySelector('.gallery-main img').src;

                    // 模拟添加购物车
                    simulateAddToCartWithDetails(productTitle, selectedColor, selectedSize, quantity, productImage);

                    // 显示添加成功动画
                    addToCartAnimation(this);
                });
            }

            // 立即购买按钮
            const buyNowBtn = modal.querySelector('.btn-outline');
            if (buyNowBtn) {
                buyNowBtn.addEventListener('click', function () {
                    // 获取商品信息
                    const productTitle = modal.querySelector('.preview-details h2').textContent;
                    const selectedColor = modal.querySelector('.select-item:nth-child(1) .option.active').textContent;
                    const selectedSize = modal.querySelector('.select-item:nth-child(2) .option.active').textContent;
                    const quantity = quantityInput.value;
                    const productImage = modal.querySelector('.gallery-main img').src;

                    // 模拟立即购买
                    simulateBuyNow(productTitle, selectedColor, selectedSize, quantity, productImage);
                });
            }

            // 收藏按钮
            const favoriteBtn = modal.querySelector('.btn-icon');
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', function () {
                    this.classList.toggle('favorited');

                    if (this.classList.contains('favorited')) {
                        this.querySelector('i').classList.remove('bi-heart');
                        this.querySelector('i').classList.add('bi-heart-fill');
                        this.style.color = '#f44336';

                        const productTitle = modal.querySelector('.preview-details h2').textContent;
                        showNotification(`已收藏商品：${productTitle}`, 'success');
                    } else {
                        this.querySelector('i').classList.remove('bi-heart-fill');
                        this.querySelector('i').classList.add('bi-heart');
                        this.style.color = '';

                        const productTitle = modal.querySelector('.preview-details h2').textContent;
                        showNotification(`已取消收藏：${productTitle}`, 'info');
                    }
                });
            }

            console.log('产品预览模态框初始化完成');
        }
    }

    // 打开产品预览模态框
    function openProductPreview(productCard) {
        // 获取产品信息
        const productTitle = productCard.querySelector('h3').textContent;
        const productImage = productCard.querySelector('.product-image img').src.replace('300x400', '600x800');
        const productPrice = productCard.querySelector('.price-current').textContent;
        const productOriginalPrice = productCard.querySelector('.price-original').textContent;

        // 更新模态框内容
        const modal = document.getElementById('productPreviewModal');

        if (modal) {
            // 更新产品标题
            modal.querySelector('.preview-details h2').textContent = productTitle;

            // 更新产品图片
            modal.querySelector('.gallery-main img').src = productImage;

            // 更新产品价格
            modal.querySelector('.preview-price .price-current').textContent = productPrice;
            modal.querySelector('.preview-price .price-original').textContent = productOriginalPrice;

            // 显示模态框
            modal.style.display = 'block';
        }
    }

    // 模拟按分类筛选产品
    function simulateFilterByCategory(categoryName) {
        console.log(`按分类筛选: ${categoryName}`);

        // 显示通知
        showNotification(`正在加载${categoryName}分类的产品...`, 'info');

        // 在实际应用中，这里会发送AJAX请求到服务器获取筛选结果
        // 这里仅作为演示，模拟筛选过程

        // 筛选产品并重置显示
        setTimeout(() => {
            // 重新渲染产品列表
            showPage(1);
            showNotification(`已加载${categoryName}的产品`, 'success');
        }, 500);
    }

    // 模拟按选项筛选产品
    function simulateFilterByOption(filterType, filterValue) {
        console.log(`按${filterType}筛选: ${filterValue}`);

        // 显示通知
        showNotification(`正在筛选${filterType}: ${filterValue}的产品...`, 'info');

        // 在实际应用中，这里会发送AJAX请求到服务器获取筛选结果
        // 这里仅作为演示，模拟筛选过程

        // 筛选产品并重置显示
        setTimeout(() => {
            // 重新渲染产品列表
            showPage(1);
            showNotification(`已筛选${filterType}: ${filterValue}的产品`, 'success');
        }, 500);
    }

    // 模拟产品排序
    function simulateSortProducts(sortMethod) {
        console.log(`按${sortMethod}排序`);

        // 显示通知
        let sortText = '';
        switch (sortMethod) {
            case 'recommend': sortText = '推荐排序'; break;
            case 'new': sortText = '最新上架'; break;
            case 'price-asc': sortText = '价格从低到高'; break;
            case 'price-desc': sortText = '价格从高到低'; break;
            case 'sales': sortText = '销量优先'; break;
        }

        showNotification(`正在${sortText}...`, 'info');

        // 在实际应用中，这里会发送AJAX请求到服务器获取排序结果
        // 这里仅作为演示，模拟排序过程
        setTimeout(() => {
            // 重新渲染产品列表
            if (sortMethod === 'price-asc') {
                // 模拟按价格从低到高排序
                productData.sort((a, b) => {
                    const priceA = parseFloat(a.price.current.replace('¥', ''));
                    const priceB = parseFloat(b.price.current.replace('¥', ''));
                    return priceA - priceB;
                });
            } else if (sortMethod === 'price-desc') {
                // 模拟按价格从高到低排序
                productData.sort((a, b) => {
                    const priceA = parseFloat(a.price.current.replace('¥', ''));
                    const priceB = parseFloat(b.price.current.replace('¥', ''));
                    return priceB - priceA;
                });
            } else if (sortMethod === 'sales') {
                // 模拟按销量排序
                productData.sort((a, b) => b.sales - a.sales);
            }

            showPage(1);
            showNotification(`已完成${sortText}`, 'success');
        }, 500);
    }

    // 模拟搜索产品
    function simulateSearchProducts(keyword) {
        console.log(`搜索关键词: ${keyword}`);

        // 显示通知
        showNotification(`正在搜索"${keyword}"...`, 'info');

        // 在实际应用中，这里会发送AJAX请求到服务器获取搜索结果
        // 这里仅作为演示，模拟搜索过程
        setTimeout(() => {
            // 模拟搜索结果
            const searchResults = productData.filter(product => {
                return product.title.includes(keyword) || 
                       product.description.includes(keyword) ||
                       product.company.includes(keyword) ||
                       product.category.includes(keyword);
            });

            if (searchResults.length > 0) {
                // 临时替换产品数据进行展示
                const originalData = [...productData];
                window.productData = searchResults;
                
                showPage(1);
                
                // 恢复原始数据
                setTimeout(() => {
                    window.productData = originalData;
                }, 5000);

                showNotification(`找到${searchResults.length}个与"${keyword}"相关的产品`, 'success');
            } else {
                showNotification(`未找到与"${keyword}"相关的产品`, 'warning');
            }
        }, 800);
    }

    // 模拟添加购物车
    function simulateAddToCart(productTitle, productImage) {
        console.log(`添加到购物车: ${productTitle}`);

        // 构建购物车商品对象
        const cartItem = {
            id: Date.now().toString() + Math.floor(Math.random() * 1000),
            name: productTitle,
            image: productImage || "../images/products/boys/boys-tshirt-01.jpg",
            color: "默认",
            size: "默认",
            price: 99.00,
            quantity: 1
        };

        // 添加到购物车
        window.cartItems.push(cartItem);

        // 更新购物车图标
        updateCartIcon(1);

        // 显示添加成功通知
        showNotification(`已将 ${productTitle} 添加到购物车`, 'success');
    }

    // 模拟带详情添加购物车
    function simulateAddToCartWithDetails(productTitle, color, size, quantity, productImage) {
        console.log(`添加到购物车: ${productTitle}, 颜色: ${color}, 尺码: ${size}, 数量: ${quantity}`);

        // 获取当前产品价格
        let price = 99.00; // 默认价格
        try {
            const priceElement = document.querySelector('#productPreviewModal .preview-price .price-current');
            if (priceElement) {
                price = parseFloat(priceElement.textContent.replace('¥', ''));
            }
        } catch (e) {
            console.error("获取价格失败，使用默认价格", e);
        }

        // 构建购物车商品对象
        const cartItem = {
            id: Date.now().toString() + Math.floor(Math.random() * 1000),
            name: productTitle,
            image: productImage || "../images/products/boys/boys-tshirt-01.jpg",
            color: color || "默认",
            size: size || "默认",
            price: price,
            quantity: parseInt(quantity) || 1
        };

        // 添加到购物车
        window.cartItems.push(cartItem);

        // 更新购物车图标
        updateCartIcon(parseInt(quantity) || 1);

        // 显示添加成功通知
        showNotification(`已将 ${quantity}件 ${color} ${size} ${productTitle} 添加到购物车`, 'success');
    }

    // 模拟立即购买
    function simulateBuyNow(productTitle, color, size, quantity, imageUrl) {
        console.log(`立即购买: ${productTitle}, 颜色: ${color}, 尺码: ${size}, 数量: ${quantity}`);
        showNotification(`正在跳转到结算页面...`, 'info');

        // 模拟跳转到结算页面
        setTimeout(() => {
            // 创建结算页面模态框
            showCheckoutModal(productTitle, color, size, quantity, imageUrl);
        }, 1000);
    }

    // 更新购物车图标
    function updateCartIcon(count) {
        // 获取导航中的购物车图标
        let cartIcon = document.querySelector('.user-info .cart-icon');

        // 如果不存在，创建一个
        if (!cartIcon) {
            const userInfo = document.querySelector('.user-info');

            // 创建购物车图标
            cartIcon = document.createElement('div');
            cartIcon.className = 'cart-icon';

            // 创建图标元素
            const iconElement = document.createElement('i');
            iconElement.className = 'bi bi-cart';
            cartIcon.appendChild(iconElement);

            // 创建数量元素
            const countElement = document.createElement('span');
            countElement.className = 'cart-count';
            countElement.textContent = '0';
            cartIcon.appendChild(countElement);

            // 添加到用户信息区
            userInfo.prepend(cartIcon);

            // 添加点击事件
            cartIcon.addEventListener('click', function () {
                showShoppingCart();
            });
        }

        // 获取当前数量
        const countElement = cartIcon.querySelector('.cart-count');
        let currentCount = parseInt(countElement.textContent);

        // 更新数量
        currentCount += count;
        countElement.textContent = currentCount;

        // 添加动画效果
        cartIcon.classList.add('shake');
        setTimeout(() => {
            cartIcon.classList.remove('shake');
        }, 500);
    }

    // 添加到购物车的动画效果
    function addToCartAnimation(button) {
        // 创建一个飞向购物车的元素
        const flyElement = document.createElement('div');
        flyElement.className = 'fly-to-cart';
        flyElement.innerHTML = '<i class="bi bi-cart-plus"></i>';

        // 获取按钮位置
        const buttonRect = button.getBoundingClientRect();

        // 设置初始位置
        flyElement.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
        flyElement.style.top = `${buttonRect.top + buttonRect.height / 2}px`;

        // 添加到页面
        document.body.appendChild(flyElement);

        // 获取购物车位置
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            const cartRect = cartIcon.getBoundingClientRect();

            // 设置动画终点
            setTimeout(() => {
                flyElement.style.left = `${cartRect.left + cartRect.width / 2}px`;
                flyElement.style.top = `${cartRect.top + cartRect.height / 2}px`;
                flyElement.style.opacity = '0';
                flyElement.style.transform = 'scale(0.3)';
            }, 10);

            // 动画结束后移除元素
            setTimeout(() => {
                document.body.removeChild(flyElement);
            }, 1000);
        } else {
            // 如果没有购物车图标，直接移除
            document.body.removeChild(flyElement);
        }
    }

    // 显示结算页面模态框
    function showCheckoutModal(productTitle, color, size, quantity, imageUrl) {
        // 创建模态框
        const checkoutModal = document.createElement('div');
        checkoutModal.className = 'checkout-modal';

        // 如果没有提供图片URL，尝试从产品预览模态框获取
        if (!imageUrl) {
            const previewModal = document.getElementById('productPreviewModal');
            if (previewModal && previewModal.querySelector('.gallery-main img')) {
                imageUrl = previewModal.querySelector('.gallery-main img').src;
            } else {
                // 默认图片
                imageUrl = "../images/products/boys/boys-tshirt-01.jpg";
            }
        }

        // 模拟订单信息
        let price = "¥99.00"; // 默认价格
        try {
            // 尝试获取当前产品的价格
            const priceElement = document.querySelector('#productPreviewModal .preview-price .price-current');
            if (priceElement) {
                price = priceElement.textContent;
            }
        } catch (e) {
            console.error("获取价格失败，使用默认价格", e);
        }

        const totalPrice = `¥${(parseFloat(price.replace('¥', '')) * parseInt(quantity || 1)).toFixed(2)}`;

        // 添加模态框内容
        checkoutModal.innerHTML = `
            <div class="checkout-content">
                <span class="close-modal"><i class="bi bi-x-lg"></i></span>
                <h2>确认订单</h2>
                <div class="checkout-info">
                    <div class="checkout-product">
                        <h3>商品信息</h3>
                        <div class="product-item">
                            <div class="item-image">
                                <img src="${imageUrl}" alt="${productTitle}">
                            </div>
                            <div class="item-info">
                                <h4>${productTitle}</h4>
                                <p>颜色：${color || '默认'} | 尺码：${size || '默认'}</p>
                                <p>数量：${quantity || 1}件 × ${price} = ${totalPrice}</p>
                            </div>
                        </div>
                    </div>
                    <div class="checkout-address">
                        <h3>收货地址</h3>
                        <div class="address-item">
                            <p><span>收货人：</span>张三</p>
                            <p><span>手机号：</span>1391234****</p>
                            <p><span>收货地址：</span>浙江省湖州市织里镇XX路XX号</p>
                        </div>
                    </div>
                    <div class="checkout-payment">
                        <h3>支付方式</h3>
                        <div class="payment-options">
                            <label class="payment-option active">
                                <input type="radio" name="payment" value="weixin" checked>
                                <span>微信支付</span>
                            </label>
                            <label class="payment-option">
                                <input type="radio" name="payment" value="alipay">
                                <span>支付宝</span>
                            </label>
                            <label class="payment-option">
                                <input type="radio" name="payment" value="bank">
                                <span>银行卡</span>
                            </label>
                        </div>
                    </div>
                    <div class="checkout-summary">
                        <div class="summary-item">
                            <span>商品金额：</span>
                            <span>${totalPrice}</span>
                        </div>
                        <div class="summary-item">
                            <span>运费：</span>
                            <span>¥0.00</span>
                        </div>
                        <div class="summary-item total">
                            <span>订单总计：</span>
                            <span>${totalPrice}</span>
                        </div>
                    </div>
                    <div class="checkout-actions">
                        <button class="btn-primary btn-lg confirm-order">确认支付</button>
                    </div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .checkout-modal {
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .checkout-content {
                background-color: #fff;
                border-radius: 8px;
                width: 80%;
                max-width: 800px;
                padding: 20px;
                position: relative;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .checkout-content h2 {
                text-align: center;
                margin-bottom: 20px;
                color: #333;
            }
            
            .checkout-product, .checkout-address, .checkout-payment, .checkout-summary {
                margin-bottom: 20px;
                padding: 15px;
                border-radius: 4px;
                background-color: #f9f9f9;
            }
            
            .product-item {
                display: flex;
                padding: 10px 0;
            }
            
            .item-image {
                width: 80px;
                height: 80px;
                margin-right: 15px;
            }
            
            .item-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 4px;
            }
            
            .item-info h4 {
                margin: 0 0 5px 0;
                font-size: 16px;
            }
            
            .item-info p {
                margin: 5px 0;
                color: #666;
                font-size: 14px;
            }
            
            .checkout-address .address-item p {
                margin: 5px 0;
                font-size: 14px;
            }
            
            .checkout-address .address-item p span {
                color: #666;
            }
            
            .payment-options {
                display: flex;
                gap: 15px;
            }
            
            .payment-option {
                display: flex;
                align-items: center;
                padding: 8px 15px;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .payment-option.active {
                border-color: #4a6bdf;
                background-color: #f0f4ff;
            }
            
            .payment-option input {
                margin-right: 5px;
            }
            
            .checkout-summary {
                border-top: 1px solid #eee;
            }
            
            .summary-item {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
            }
            
            .summary-item.total {
                font-size: 18px;
                font-weight: bold;
                color: #e74c3c;
                border-top: 1px solid #eee;
                padding-top: 10px;
                margin-top: 10px;
            }
            
            .checkout-actions {
                text-align: center;
                margin-top: 20px;
            }
            
            .close-modal {
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            }
            
            .close-modal:hover {
                color: #333;
            }
            
            /* 动画效果 */
            @keyframes flyToCart {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(0.3);
                    opacity: 0;
                }
            }
            
            .fly-to-cart {
                position: fixed;
                font-size: 24px;
                color: #4a6bdf;
                z-index: 2000;
                transition: all 1s cubic-bezier(0.18, 0.89, 0.32, 1.28);
            }
            
            @keyframes shakeCart {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .cart-icon {
                position: relative;
                margin-right: 15px;
                cursor: pointer;
            }
            
            .cart-icon i {
                font-size: 20px;
                color: #4a6bdf;
            }
            
            .cart-count {
                position: absolute;
                top: -8px;
                right: -8px;
                background-color: #e74c3c;
                color: white;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .cart-icon.shake {
                animation: shakeCart 0.5s;
            }
            
            /* 模态框动画 */
            .checkout-modal {
                animation: fadeIn 0.3s;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;

        // 添加到页面
        document.head.appendChild(style);
        document.body.appendChild(checkoutModal);

        // 添加关闭事件
        const closeBtn = checkoutModal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function () {
            document.body.removeChild(checkoutModal);
        });

        // 添加支付选项切换事件
        const paymentOptions = checkoutModal.querySelectorAll('.payment-option');
        paymentOptions.forEach(option => {
            option.addEventListener('click', function () {
                paymentOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                this.querySelector('input').checked = true;
            });
        });

        // 添加确认订单事件
        const confirmBtn = checkoutModal.querySelector('.confirm-order');
        confirmBtn.addEventListener('click', function () {
            // 显示支付成功提示
            document.body.removeChild(checkoutModal);
            showNotification('支付成功！商品将尽快发货', 'success');

            // 关闭产品预览模态框
            const productModal = document.getElementById('productPreviewModal');
            if (productModal) {
                productModal.style.display = 'none';
            }
        });
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // 添加到页面
        document.body.appendChild(notification);

        // 淡入显示
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // 几秒后淡出删除
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 初始化购物车图标
    function initCartIcon() {
        const userInfo = document.querySelector('.user-info');
        if (!userInfo) return;

        // 检查购物车图标是否已经存在
        let cartIcon = userInfo.querySelector('.cart-icon');
        if (cartIcon) return;

        // 创建购物车图标
        cartIcon = document.createElement('div');
        cartIcon.className = 'cart-icon';

        // 创建图标元素
        const iconElement = document.createElement('i');
        iconElement.className = 'bi bi-cart';
        cartIcon.appendChild(iconElement);

        // 创建数量元素
        const countElement = document.createElement('span');
        countElement.className = 'cart-count';
        countElement.textContent = '0';
        cartIcon.appendChild(countElement);

        // 将购物车图标插入到登录和注册按钮之前
        userInfo.insertBefore(cartIcon, userInfo.firstChild);

        // 添加点击事件
        cartIcon.addEventListener('click', function () {
            showShoppingCart();
        });

        console.log('购物车图标初始化完成');
    }

    // 显示购物车内容
    function showShoppingCart() {
        // 创建购物车模态框
        const cartModal = document.createElement('div');
        cartModal.className = 'checkout-modal';

        // 购物车内容
        let cartContent = '';

        if (window.cartItems.length > 0) {
            // 计算商品总额
            const totalAmount = window.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            
            // 计算优惠金额（这里简化为总额的10%）
            const discountAmount = totalAmount * 0.1;
            
            // 计算应付金额
            const payableAmount = totalAmount - discountAmount;

            // 构建购物车内容
            cartContent = `
                <div class="checkout-content">
                    <span class="close-modal"><i class="bi bi-x-lg"></i></span>
                    <h2>购物车</h2>
                    <div class="checkout-info">
                        <div class="checkout-product">
                            <h3>已选商品（${window.cartItems.length}）</h3>
                            ${generateCartItemsHTML(window.cartItems)}
                        </div>
                        <div class="checkout-summary">
                            <div class="summary-item">
                                <span>商品总额：</span>
                                <span id="cart-total-amount">¥${totalAmount.toFixed(2)}</span>
                            </div>
                            <div class="summary-item">
                                <span>优惠金额：</span>
                                <span id="cart-discount-amount">-¥${discountAmount.toFixed(2)}</span>
                            </div>
                            <div class="summary-item total">
                                <span>应付金额：</span>
                                <span id="cart-payable-amount">¥${payableAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="checkout-actions">
                            <button class="btn-outline btn-md continue-shopping">继续购物</button>
                            <button class="btn-primary btn-md checkout-btn">去结算</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // 购物车为空
            cartContent = `
                <div class="checkout-content">
                    <span class="close-modal"><i class="bi bi-x-lg"></i></span>
                    <h2>购物车</h2>
                    <div class="empty-cart">
                        <i class="bi bi-cart-x"></i>
                        <p>购物车空空如也</p>
                        <button class="btn-primary btn-md">去逛逛</button>
                    </div>
                </div>
            `;
        }

        cartModal.innerHTML = cartContent;
        document.body.appendChild(cartModal);

        // 添加关闭事件
        const closeBtn = cartModal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function () {
            document.body.removeChild(cartModal);
        });

        // 点击模态框外部关闭模态框
        cartModal.addEventListener('click', function (event) {
            if (event.target === cartModal) {
                document.body.removeChild(cartModal);
            }
        });

        // 如果购物车不为空，添加购物车操作事件
        if (window.cartItems.length > 0) {
            // 添加数量增减和删除事件
            addCartItemEvents(cartModal);

        // 继续购物按钮
        const continueBtn = cartModal.querySelector('.continue-shopping');
        if (continueBtn) {
            continueBtn.addEventListener('click', function () {
                document.body.removeChild(cartModal);
            });
        }

        // 去结算按钮
        const checkoutBtn = cartModal.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function () {
                document.body.removeChild(cartModal);
                showNotification('正在跳转到结算页面...', 'info');
                    
                    // 计算总数量
                    const totalQuantity = window.cartItems.reduce((sum, item) => sum + item.quantity, 0);
                    
                    // 使用第一件商品的图片
                    const firstItem = window.cartItems[0];
                    
                setTimeout(() => {
                        showCheckoutModal('购物车商品', '', '', totalQuantity, firstItem.image);
                }, 500);
            });
        }
        } else {
        // 去逛逛按钮
        const shopBtn = cartModal.querySelector('.empty-cart .btn-primary');
        if (shopBtn) {
            shopBtn.addEventListener('click', function () {
                document.body.removeChild(cartModal);
            });
        }
        }
    }

    // 生成购物车商品HTML
    function generateCartItemsHTML(items) {
        let itemsHTML = '';

        items.forEach((item, index) => {
            if (index < 5) { // 只显示前5件商品
            itemsHTML += `
                    <div class="product-item" data-id="${item.id}">
                    <div class="item-image">
                            <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-info">
                            <h4>${item.name}</h4>
                            <p>颜色：${item.color} | 尺码：${item.size}</p>
                        <div class="item-price">
                                <span class="price">¥${item.price.toFixed(2)}</span>
                            <div class="quantity-control">
                                <button class="quantity-decrease"><i class="bi bi-dash"></i></button>
                                    <input type="number" value="${item.quantity}" min="1" max="99" readonly>
                                <button class="quantity-increase"><i class="bi bi-plus"></i></button>
                                <button class="delete-item"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        });

        if (items.length > 5) {
            itemsHTML += `<div class="more-items">还有${items.length - 5}件商品 <a href="#">查看全部</a></div>`;
        }

        return itemsHTML;
    }

    // 添加购物车操作事件
    function addCartItemEvents(cartModal) {
        // 获取所有商品项
        const productItems = cartModal.querySelectorAll('.product-item');
        
        productItems.forEach(item => {
            const itemId = item.getAttribute('data-id');
            const quantityInput = item.querySelector('input[type="number"]');
            const decreaseBtn = item.querySelector('.quantity-decrease');
            const increaseBtn = item.querySelector('.quantity-increase');
            const deleteBtn = item.querySelector('.delete-item');
            
            // 减少数量
            decreaseBtn.addEventListener('click', function() {
                const cartItem = window.cartItems.find(c => c.id === itemId);
                if (cartItem && cartItem.quantity > 1) {
                    cartItem.quantity--;
                    quantityInput.value = cartItem.quantity;
                    updateCartTotal(cartModal);
                }
            });
            
            // 增加数量
            increaseBtn.addEventListener('click', function() {
                const cartItem = window.cartItems.find(c => c.id === itemId);
                if (cartItem && cartItem.quantity < 99) {
                    cartItem.quantity++;
                    quantityInput.value = cartItem.quantity;
                    updateCartTotal(cartModal);
                }
            });
            
            // 删除商品
            deleteBtn.addEventListener('click', function() {
                // 从数组中移除商品
                const index = window.cartItems.findIndex(c => c.id === itemId);
                if (index > -1) {
                    const removedItem = window.cartItems.splice(index, 1)[0];
                    
                    // 更新购物车图标数量
                    const cartCount = document.querySelector('.cart-count');
                    if (cartCount) {
                        const currentCount = parseInt(cartCount.textContent);
                        cartCount.textContent = Math.max(0, currentCount - removedItem.quantity);
                    }
                    
                    // 从DOM中移除商品项
                    item.remove();
                    
                    // 更新总价
                    updateCartTotal(cartModal);
                    
                    // 如果购物车为空，重新加载购物车页面
                    if (window.cartItems.length === 0) {
                        document.body.removeChild(cartModal);
                        showShoppingCart();
                    }
                }
            });
        });
    }
    
    // 更新购物车总价
    function updateCartTotal(cartModal) {
        // 计算商品总额
        const totalAmount = window.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        // 计算优惠金额（这里简化为总额的10%）
        const discountAmount = totalAmount * 0.1;
        
        // 计算应付金额
        const payableAmount = totalAmount - discountAmount;
        
        // 更新DOM
        const totalAmountElement = cartModal.querySelector('#cart-total-amount');
        const discountAmountElement = cartModal.querySelector('#cart-discount-amount');
        const payableAmountElement = cartModal.querySelector('#cart-payable-amount');
        
        if (totalAmountElement) totalAmountElement.textContent = `¥${totalAmount.toFixed(2)}`;
        if (discountAmountElement) discountAmountElement.textContent = `-¥${discountAmount.toFixed(2)}`;
        if (payableAmountElement) payableAmountElement.textContent = `¥${payableAmount.toFixed(2)}`;
    }
}); 
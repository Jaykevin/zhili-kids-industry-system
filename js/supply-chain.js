document.addEventListener('DOMContentLoaded', function() {
    // 选项卡切换功能
    const navItems = document.querySelectorAll('.supply-chain-nav li');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有导航项的active类
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // 给当前点击的导航项添加active类
            this.classList.add('active');
            
            // 获取对应的选项卡ID
            const tabId = this.getAttribute('data-tab');
            
            // 隐藏所有选项卡内容
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // 显示当前选项卡内容
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // 需求供应列表头部切换
    const headerTabs = document.querySelectorAll('.header-tab');
    
    headerTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有选项卡的active类
            headerTabs.forEach(t => t.classList.remove('active'));
            
            // 给当前点击的选项卡添加active类
            this.classList.add('active');
            
            // 这里可以添加切换需求/供应列表显示的逻辑
            toggleDemandSupplyList(this.textContent);
        });
    });
    
    function toggleDemandSupplyList(tabText) {
        // 模拟切换需求/供应列表
        const cardList = document.querySelector('.card-list');
        
        // 保存当前滚动位置
        const scrollPos = window.pageYOffset;
        
        // 应用淡出效果
        cardList.style.opacity = '0';
        
        // 500毫秒后切换内容并应用淡入效果
        setTimeout(() => {
            if (tabText === '供应信息') {
                // 这里可以替换为实际的供应信息卡片
                cardList.innerHTML = `
                    <!-- 供应卡片1 -->
                    <div class="demand-card">
                        <div class="card-header">
                            <span class="card-type material">面料供应</span>
                            <span class="card-urgency medium">现货</span>
                        </div>
                        <div class="card-body">
                            <h3>高品质有机棉针织面料供应</h3>
                            <div class="card-info">
                                <p><strong>供应企业：</strong>织里优质面料有限公司</p>
                                <p><strong>供应描述：</strong>有机棉针织面料，32支/40支可选，多种颜色现货供应，通过Oeko-Tex Standard 100认证，适合婴幼儿服装使用。</p>
                                <p><strong>库存量：</strong>32支：白色8000米，浅蓝6000米；40支：白色5000米，粉色3000米</p>
                            </div>
                            <div class="card-tags">
                                <span class="tag">有机棉</span>
                                <span class="tag">针织面料</span>
                                <span class="tag">现货</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <span class="publish-time">发布时间：2023-06-20</span>
                            <button class="btn-outline">查看详情</button>
                            <button class="btn-primary">获取报价</button>
                        </div>
                    </div>
                    
                    <!-- 供应卡片2 -->
                    <div class="demand-card">
                        <div class="card-header">
                            <span class="card-type processing">加工服务</span>
                            <span class="card-urgency high">优惠</span>
                        </div>
                        <div class="card-body">
                            <h3>童装印花加工服务</h3>
                            <div class="card-info">
                                <p><strong>供应企业：</strong>湖州印艺数码科技有限公司</p>
                                <p><strong>供应描述：</strong>提供童装数码印花加工服务，设备先进，色彩鲜艳持久，交期快，小批量定制也可接受。现推出暑期优惠活动，7-8月订单享受8折优惠。</p>
                                <p><strong>产能：</strong>日产量3000件</p>
                            </div>
                            <div class="card-tags">
                                <span class="tag">数码印花</span>
                                <span class="tag">优惠活动</span>
                                <span class="tag">小批量</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <span class="publish-time">发布时间：2023-06-25</span>
                            <button class="btn-outline">查看详情</button>
                            <button class="btn-primary">获取报价</button>
                        </div>
                    </div>
                    
                    <!-- 供应卡片3 -->
                    <div class="demand-card">
                        <div class="card-header">
                            <span class="card-type design">设计服务</span>
                            <span class="card-urgency low">长期</span>
                        </div>
                        <div class="card-body">
                            <h3>童装设计服务</h3>
                            <div class="card-info">
                                <p><strong>供应企业：</strong>织里镇创意童装设计工作室</p>
                                <p><strong>供应描述：</strong>专业童装设计团队，擅长3-12岁儿童服装设计，可提供图案设计、款式设计、系列规划等全方位服务，支持商业化批量生产的设计方案。</p>
                                <p><strong>服务方式：</strong>远程合作或驻场服务</p>
                            </div>
                            <div class="card-tags">
                                <span class="tag">童装设计</span>
                                <span class="tag">系列规划</span>
                                <span class="tag">图案设计</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <span class="publish-time">发布时间：2023-06-28</span>
                            <button class="btn-outline">查看详情</button>
                            <button class="btn-primary">联系合作</button>
                        </div>
                    </div>
                `;
            } else {
                // 恢复原来的需求信息卡片
                cardList.innerHTML = `
                    <!-- 需求卡片1 -->
                    <div class="demand-card">
                        <div class="card-header">
                            <span class="card-type material">原材料需求</span>
                            <span class="card-urgency high">紧急</span>
                        </div>
                        <div class="card-body">
                            <h3>高品质全棉针织面料采购需求</h3>
                            <div class="card-info">
                                <p><strong>需求企业：</strong>浙江童趣服饰有限公司</p>
                                <p><strong>需求描述：</strong>采购40支全棉针织面料，用于2023秋冬款童装生产，颜色要求：白色、浅蓝、粉红，规格：175cm宽，每色各需5000米。</p>
                                <p><strong>截止日期：</strong>2023-07-15</p>
                            </div>
                            <div class="card-tags">
                                <span class="tag">全棉</span>
                                <span class="tag">针织面料</span>
                                <span class="tag">40支</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <span class="publish-time">发布时间：2023-06-25</span>
                            <button class="btn-outline">查看详情</button>
                            <button class="btn-primary">我要对接</button>
                        </div>
                    </div>
                    
                    <!-- 需求卡片2 -->
                    <div class="demand-card">
                        <div class="card-header">
                            <span class="card-type processing">加工服务</span>
                            <span class="card-urgency medium">一般</span>
                        </div>
                        <div class="card-body">
                            <h3>童装印花加工服务需求</h3>
                            <div class="card-info">
                                <p><strong>需求企业：</strong>湖州小森林童装设计工作室</p>
                                <p><strong>需求描述：</strong>寻找童装数码印花加工厂，可承接小批量定制印花，要求环保无毒，色牢度高，交货周期短。</p>
                                <p><strong>截止日期：</strong>2023-08-01</p>
                            </div>
                            <div class="card-tags">
                                <span class="tag">数码印花</span>
                                <span class="tag">环保</span>
                                <span class="tag">小批量</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <span class="publish-time">发布时间：2023-06-28</span>
                            <button class="btn-outline">查看详情</button>
                            <button class="btn-primary">我要对接</button>
                        </div>
                    </div>
                    
                    <!-- 需求卡片3 -->
                    <div class="demand-card">
                        <div class="card-header">
                            <span class="card-type design">设计服务</span>
                            <span class="card-urgency low">一般</span>
                        </div>
                        <div class="card-body">
                            <h3>2024春夏童装设计服务需求</h3>
                            <div class="card-info">
                                <p><strong>需求企业：</strong>快乐童年服饰有限公司</p>
                                <p><strong>需求描述：</strong>寻找专业童装设计师，为2024春夏季设计10款0-3岁婴幼儿服装，主题为"自然探索"，设计风格简约自然。</p>
                                <p><strong>截止日期：</strong>2023-09-30</p>
                            </div>
                            <div class="card-tags">
                                <span class="tag">婴幼儿</span>
                                <span class="tag">春夏</span>
                                <span class="tag">设计服务</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <span class="publish-time">发布时间：2023-07-01</span>
                            <button class="btn-outline">查看详情</button>
                            <button class="btn-primary">我要对接</button>
                        </div>
                    </div>
                `;
            }
            
            // 应用淡入效果
            cardList.style.opacity = '1';
            
            // 恢复滚动位置
            window.scrollTo(0, scrollPos);
            
        }, 300);
    }
    
    // 物流查询模拟功能
    const logisticsSearchForm = document.querySelector('.logistics-search .search-form');
    
    if (logisticsSearchForm) {
        logisticsSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取运单号
            const trackingNumber = this.querySelector('input').value.trim();
            
            if (trackingNumber) {
                // 模拟物流查询，实际应用中应该通过API请求物流信息
                simulateLogisticsTracking(trackingNumber);
            } else {
                showNotification('请输入有效的运单号', 'warning');
            }
        });
    }
    
    // 模拟物流查询
    function simulateLogisticsTracking(trackingNumber) {
        // 创建模拟物流跟踪结果
        const trackingResult = document.createElement('div');
        trackingResult.className = 'tracking-result';
        trackingResult.innerHTML = `
            <div class="tracking-header">
                <h4>运单号：${trackingNumber}</h4>
                <p>物流公司：顺丰速运</p>
                <p>当前状态：<span class="status-transit">运输中</span></p>
            </div>
            <div class="tracking-timeline">
                <div class="timeline-item">
                    <div class="timeline-date">2023-07-05 14:30</div>
                    <div class="timeline-content">
                        <h5>【湖州市】已离开湖州中转中心，发往杭州中转中心</h5>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-date">2023-07-05 10:15</div>
                    <div class="timeline-content">
                        <h5>【湖州市】已到达湖州中转中心</h5>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-date">2023-07-04 18:40</div>
                    <div class="timeline-content">
                        <h5>【湖州市】快递员已取件，正在派送中</h5>
                        <p>快递员：张师傅，联系电话：135****8899</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-date">2023-07-04 16:20</div>
                    <div class="timeline-content">
                        <h5>【湖州市】您的订单已出库</h5>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-date">2023-07-04 14:05</div>
                    <div class="timeline-content">
                        <h5>【湖州市】您的订单已打包完成</h5>
                    </div>
                </div>
            </div>
        `;
        
        // 样式
        const style = document.createElement('style');
        style.textContent = `
            .tracking-result {
                background-color: white;
                border-radius: 8px;
                padding: 20px;
                margin-top: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }
            
            .tracking-header {
                border-bottom: 1px solid #eee;
                padding-bottom: 15px;
                margin-bottom: 15px;
            }
            
            .tracking-header h4 {
                margin: 0 0 10px 0;
            }
            
            .tracking-header p {
                margin: 5px 0;
                color: #666;
            }
            
            .status-transit {
                background-color: #fff8e1;
                color: #ff8f00;
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
            }
            
            .tracking-timeline {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .timeline-item {
                display: flex;
                gap: 15px;
                position: relative;
            }
            
            .timeline-item:not(:last-child)::before {
                content: '';
                position: absolute;
                top: 25px;
                left: 80px;
                width: 2px;
                height: calc(100% + 20px);
                background-color: #e0e0e0;
                z-index: -1;
            }
            
            .timeline-date {
                min-width: 160px;
                color: #666;
                font-size: 14px;
                padding-top: 2px;
            }
            
            .timeline-content {
                flex: 1;
            }
            
            .timeline-content h5 {
                margin: 0 0 5px 0;
                color: #333;
                font-size: 16px;
            }
            
            .timeline-content p {
                margin: 0;
                color: #666;
                font-size: 14px;
            }
        `;
        
        document.head.appendChild(style);
        
        // 添加物流查询结果到页面
        const logisticsSearch = document.querySelector('.logistics-search');
        
        // 检查是否已经有结果，如果有则替换
        const existingResult = document.querySelector('.tracking-result');
        if (existingResult) {
            existingResult.parentNode.replaceChild(trackingResult, existingResult);
        } else {
            logisticsSearch.appendChild(trackingResult);
        }
        
        showNotification('物流信息查询成功', 'success');
    }
    
    // 筛选表单提交
    const filterForm = document.querySelector('.filter-form');
    
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取筛选条件
            const filterData = {
                type: document.getElementById('demand-type').value,
                status: document.getElementById('demand-status').value,
                urgency: document.getElementById('demand-urgency').value,
                keyword: document.querySelector('.search-box input').value
            };
            
            // 模拟筛选
            simulateFiltering(filterData);
        });
    }
    
    // 模拟筛选效果
    function simulateFiltering(filterData) {
        // 显示筛选中提示
        showNotification('筛选中...', 'info');
        
        // 模拟延迟加载
        setTimeout(() => {
            // 获取所有需求卡片
            const demandCards = document.querySelectorAll('.demand-card');
            
            // 随机隐藏一些卡片，模拟筛选结果
            demandCards.forEach(card => {
                if (Math.random() > 0.5) {
                    card.style.display = 'none';
                } else {
                    card.style.display = '';
                }
            });
            
            // 获取可见卡片数量
            const visibleCards = document.querySelectorAll('.demand-card[style="display: ;"]');
            
            // 显示筛选结果提示
            showNotification(`筛选完成，找到 ${visibleCards.length} 条符合条件的信息`, 'success');
        }, 800);
    }
    
    // 显示通知提示
    function showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // 根据通知类型设置不同的样式
        let bgColor, textColor;
        
        switch(type) {
            case 'success':
                bgColor = '#4caf50';
                textColor = 'white';
                break;
            case 'warning':
                bgColor = '#ff9800';
                textColor = 'white';
                break;
            case 'error':
                bgColor = '#f44336';
                textColor = 'white';
                break;
            default:
                bgColor = '#4a6bdf';
                textColor = 'white';
        }
        
        // 设置样式
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = bgColor;
        notification.style.color = textColor;
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示通知
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // 3秒后隐藏通知
        setTimeout(() => {
            notification.style.opacity = '0';
            
            // 完全隐藏后移除元素
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 模拟对接按钮点击事件
    const connectButtons = document.querySelectorAll('.btn-primary');
    
    connectButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent.includes('对接') || this.textContent.includes('联系') || this.textContent.includes('报价')) {
                // 获取卡片标题
                const cardTitle = this.closest('.demand-card').querySelector('h3').textContent;
                
                // 显示对接成功通知
                showNotification(`已成功发送对接请求：${cardTitle}`, 'success');
            }
        });
    });

    // 订单数据（可扩展）
    const allOrders = [
      {id:'ORD-20230701-001', customer:'杭州童趣服装店', type:'儿童T恤', amount:'¥12,500', date:'2023-07-01', delivery:'2023-07-20', status:'新订单', statusClass:'new', detail:'纯棉T恤，夏季新款，尺码齐全。'},
      {id:'ORD-20230630-089', customer:'湖州小天使童装', type:'婴儿连体衣', amount:'¥8,200', date:'2023-06-30', delivery:'2023-07-15', status:'生产中', statusClass:'inprocess', detail:'有机棉连体衣，适合0-2岁婴儿。'},
      {id:'ORD-20230629-045', customer:'上海童心服饰', type:'儿童外套', amount:'¥23,800', date:'2023-06-29', delivery:'2023-07-25', status:'生产中', statusClass:'inprocess', detail:'秋冬新款外套，防风保暖。'},
      {id:'ORD-20230628-102', customer:'南京萌宝坊', type:'儿童裤装', amount:'¥9,600', date:'2023-06-28', delivery:'2023-07-10', status:'待发货', statusClass:'shipping', detail:'弹力棉裤，适合户外活动。'},
      {id:'ORD-20230627-056', customer:'苏州童乐汇', type:'儿童套装', amount:'¥18,400', date:'2023-06-27', delivery:'2023-07-12', status:'异常', statusClass:'exception', detail:'订单异常，等待客户确认。'},
      {id:'ORD-20230625-021', customer:'嘉兴贝贝童装', type:'儿童连衣裙', amount:'¥15,600', date:'2023-06-25', delivery:'2023-07-18', status:'新订单', statusClass:'new', detail:'夏季连衣裙，花色多样。'},
      {id:'ORD-20230624-078', customer:'无锡童趣园', type:'儿童牛仔裤', amount:'¥10,900', date:'2023-06-24', delivery:'2023-07-16', status:'待发货', statusClass:'shipping', detail:'耐磨牛仔裤，适合日常穿着。'},
      {id:'ORD-20230623-034', customer:'常州小精灵', type:'儿童卫衣', amount:'¥13,200', date:'2023-06-23', delivery:'2023-07-14', status:'已完成', statusClass:'completed', detail:'秋季卫衣，柔软舒适。'},
      {id:'ORD-20230622-055', customer:'南通童梦坊', type:'儿童马甲', amount:'¥7,800', date:'2023-06-22', delivery:'2023-07-13', status:'已完成', statusClass:'completed', detail:'轻薄马甲，适合春秋季。'},
      {id:'ORD-20230621-099', customer:'镇江童乐园', type:'儿童衬衫', amount:'¥11,300', date:'2023-06-21', delivery:'2023-07-11', status:'新订单', statusClass:'new', detail:'纯棉衬衫，透气吸汗。'},
      {id:'ORD-20230620-066', customer:'扬州童趣服饰', type:'儿童短裤', amount:'¥9,700', date:'2023-06-20', delivery:'2023-07-09', status:'生产中', statusClass:'inprocess', detail:'夏季短裤，轻薄凉爽。'},
      // 可继续扩展更多订单...
    ];
    let orderPage = 1;
    const ORDERS_PER_PAGE = 5;

    function renderOrderTable(page) {
      const tbody = document.querySelector('.order-table tbody');
      tbody.innerHTML = '';
      const start = 0;
      const end = Math.min(page * ORDERS_PER_PAGE, allOrders.length);
      for (let i = 0; i < end; i++) {
        const o = allOrders[i];
        tbody.innerHTML += `<tr>
          <td>${o.id}</td>
          <td>${o.customer}</td>
          <td>${o.type}</td>
          <td>${o.amount}</td>
          <td>${o.date}</td>
          <td>${o.delivery}</td>
          <td><span class="status-badge ${o.statusClass}">${o.status}</span></td>
          <td><button class="btn-sm view-order" data-order="${o.id}">查看</button></td>
        </tr>`;
      }
      // 隐藏查看更多按钮
      const moreBtn = document.getElementById('load-more-orders');
      if (end >= allOrders.length) {
        moreBtn.style.display = 'none';
      } else {
        moreBtn.style.display = '';
      }
      bindOrderDetailEvents();
    }

    function bindOrderDetailEvents() {
      document.querySelectorAll('.view-order').forEach(btn => {
        btn.onclick = function() {
          const orderId = this.getAttribute('data-order');
          showOrderDetail(orderId);
        };
      });
    }

    function showOrderDetail(orderId) {
      const order = allOrders.find(o => o.id === orderId);
      if (!order) return;
      const modal = document.getElementById('order-detail-modal');
      modal.innerHTML = `
        <div class="order-modal-mask" style="position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);z-index:9999;display:flex;align-items:center;justify-content:center;">
          <div class="order-modal-content" style="background:#fff;border-radius:10px;max-width:420px;width:90vw;padding:32px 24px;box-shadow:0 8px 32px rgba(0,0,0,0.18);position:relative;">
            <span class="order-modal-close" style="position:absolute;right:18px;top:12px;font-size:22px;cursor:pointer;">&times;</span>
            <h3 style="text-align:center;margin-bottom:18px;">订单详情</h3>
            <div style="margin-bottom:10px;"><strong>订单编号：</strong>${order.id}</div>
            <div style="margin-bottom:10px;"><strong>客户名称：</strong>${order.customer}</div>
            <div style="margin-bottom:10px;"><strong>产品类型：</strong>${order.type}</div>
            <div style="margin-bottom:10px;"><strong>订单金额：</strong>${order.amount}</div>
            <div style="margin-bottom:10px;"><strong>下单时间：</strong>${order.date}</div>
            <div style="margin-bottom:10px;"><strong>交货期：</strong>${order.delivery}</div>
            <div style="margin-bottom:10px;"><strong>订单状态：</strong><span class="status-badge ${order.statusClass}">${order.status}</span></div>
            <div style="margin-bottom:10px;"><strong>订单备注：</strong>${order.detail}</div>
          </div>
        </div>
      `;
      modal.style.display = 'block';
      // 关闭事件
      modal.querySelector('.order-modal-close').onclick = function() {
        modal.style.display = 'none';
      };
      // 点击遮罩关闭
      modal.querySelector('.order-modal-mask').onclick = function(e) {
        if (e.target === this) modal.style.display = 'none';
      };
    }

    // 分页加载更多订单
    const moreBtn = document.getElementById('load-more-orders');
    if (moreBtn) {
      moreBtn.onclick = function() {
        orderPage++;
        renderOrderTable(orderPage);
      };
    }
    // 首次渲染
    renderOrderTable(orderPage);
    
    // 优化方案模块交互功能
    initOptimizationModule();
});

// 优化方案模块初始化
function initOptimizationModule() {
    // 优化方案导航切换
    const optNavItems = document.querySelectorAll('.opt-nav-item');
    const optContents = document.querySelectorAll('.opt-content');
    
    optNavItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有导航项的active类
            optNavItems.forEach(nav => nav.classList.remove('active'));
            
            // 给当前点击的导航项添加active类
            this.classList.add('active');
            
            // 获取对应的选项卡ID
            const tabId = this.getAttribute('data-opt-tab');
            
            // 隐藏所有选项卡内容
            optContents.forEach(content => content.classList.remove('active'));
            
            // 显示当前选项卡内容
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // 添加淡入动画效果
                targetContent.style.opacity = '0';
                setTimeout(() => {
                    targetContent.style.opacity = '1';
                }, 50);
            }
        });
    });
    
    // 统计卡片动画效果
    animateStatCards();
    
    // 优化前后对比数据动画
    animateComparisonData();
    
    // 综合效益数据动画
    animateBenefitValues();
}

// 统计卡片动画效果
function animateStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    // 使用Intersection Observer API实现滚动动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValue = entry.target.querySelector('.stat-value');
                if (statValue) {
                    animateNumber(statValue);
                }
            }
        });
    }, { threshold: 0.5 });
    
    statCards.forEach(card => {
        observer.observe(card);
    });
}

// 数字动画效果
function animateNumber(element) {
    const finalValue = element.textContent;
    const isPercentage = finalValue.includes('%');
    const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
    
    if (isNaN(numericValue)) return;
    
    let currentValue = 0;
    const increment = numericValue / 50; // 50帧动画
    const duration = 1500; // 1.5秒
    const frameTime = duration / 50;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        
        if (isPercentage) {
            element.textContent = currentValue.toFixed(1) + '%';
        } else if (finalValue.includes('万元')) {
            element.textContent = currentValue.toFixed(0) + '万元/年';
        } else if (finalValue.includes('次/年')) {
            element.textContent = currentValue.toFixed(1) + '次/年';
        } else if (finalValue.includes('件/小时')) {
            element.textContent = currentValue.toFixed(0) + '件/小时';
        } else {
            element.textContent = currentValue.toFixed(1);
        }
    }, frameTime);
}

// 优化前后对比数据动画
function animateComparisonData() {
    const comparisonSections = document.querySelectorAll('.before-after-comparison, .route-optimization, .delivery-network');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const improvedValues = entry.target.querySelectorAll('.metric-value.improved, .value.improved, .stat-value');
                improvedValues.forEach(value => {
                    value.style.transform = 'scale(1.1)';
                    value.style.transition = 'transform 0.3s ease';
                    setTimeout(() => {
                        value.style.transform = 'scale(1)';
                    }, 300);
                });
            }
        });
    }, { threshold: 0.3 });
    
    comparisonSections.forEach(section => {
        observer.observe(section);
    });
}

// 综合效益数据动画
function animateBenefitValues() {
    const benefitValues = document.querySelectorAll('.benefit-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const valueElement = entry.target;
                animateNumber(valueElement);
            }
        });
    }, { threshold: 0.5 });
    
    benefitValues.forEach(value => {
        observer.observe(value);
    });
}

// 优化措施卡片悬停效果增强
document.addEventListener('DOMContentLoaded', function() {
    const measureCards = document.querySelectorAll('.measure-card');
    
    measureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.measure-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.measure-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // 统计卡片悬停效果
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.stat-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.stat-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
    
    // 初始化库存管理功能
    initInventoryManagement();
});

// 库存管理功能初始化
function initInventoryManagement() {
    // 功能卡片点击事件
    const functionCards = document.querySelectorAll('.function-card');
    
    functionCards.forEach(card => {
        card.addEventListener('click', function() {
            const functionType = this.getAttribute('data-function');
            openInventoryModal(functionType);
        });
    });
    
    // 模态框关闭事件
    const modalCloses = document.querySelectorAll('.modal-close');
    modalCloses.forEach(close => {
        close.addEventListener('click', closeModal);
    });
    
    // 点击模态框外部关闭
    const modals = document.querySelectorAll('.inventory-modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    });
    
    // 模态框内导航切换
    initModalNavigation();
    
    // 初始化表单功能
    initFormFunctions();
    
    // 初始化数据
    initInventoryData();
}

// 打开库存管理模态框
function openInventoryModal(functionType) {
    const modalMap = {
        'inbound': 'inboundModal',
        'outbound': 'outboundModal', 
        'transfer': 'transferModal',
        'analysis': 'analysisModal'
    };
    
    const modalId = modalMap[functionType];
    if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // 生成单号
            generateDocumentNumber(functionType);
            
            // 设置默认日期
            setDefaultDate(functionType);
            
            // 加载数据
            loadModalData(functionType);
        }
    }
}

// 关闭模态框
function closeModal() {
    const modals = document.querySelectorAll('.inventory-modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
    document.body.style.overflow = 'auto';
}

// 模态框导航切换
function initModalNavigation() {
    const modalNavItems = document.querySelectorAll('.modal-nav-item');
    
    modalNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const modal = this.closest('.inventory-modal');
            const tabId = this.getAttribute('data-tab');
            
            // 移除所有active类
            modal.querySelectorAll('.modal-nav-item').forEach(nav => nav.classList.remove('active'));
            modal.querySelectorAll('.modal-tab-content').forEach(content => content.classList.remove('active'));
            
            // 添加active类
            this.classList.add('active');
            const targetContent = modal.querySelector('#' + tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// 生成单据号
function generateDocumentNumber(functionType) {
    const today = new Date();
    const dateStr = today.getFullYear().toString() + 
                   (today.getMonth() + 1).toString().padStart(2, '0') + 
                   today.getDate().toString().padStart(2, '0');
    const timeStr = today.getHours().toString().padStart(2, '0') + 
                   today.getMinutes().toString().padStart(2, '0') + 
                   today.getSeconds().toString().padStart(2, '0');
    
    const prefixMap = {
        'inbound': 'RK',
        'outbound': 'CK',
        'transfer': 'DB'
    };
    
    const prefix = prefixMap[functionType];
    if (prefix) {
        const docNumber = prefix + dateStr + timeStr;
        const inputId = functionType + 'No';
        const input = document.getElementById(inputId);
        if (input) {
            input.value = docNumber;
        }
    }
}

// 设置默认日期
function setDefaultDate(functionType) {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = {
        'inbound': 'inboundDate',
        'outbound': 'outboundDate',
        'transfer': 'transferDate'
    };
    
    const inputId = dateInputs[functionType];
    if (inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = today;
        }
    }
}

// 初始化表单功能
function initFormFunctions() {
    // 表单提交事件
    const forms = document.querySelectorAll('.inventory-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    });
}

// 添加商品项
function addProductItem() {
    const productList = document.querySelector('.product-list');
    const newItem = document.createElement('div');
    newItem.className = 'product-item';
    newItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>商品名称</label>
                <input type="text" placeholder="请输入商品名称" required>
            </div>
            <div class="form-group">
                <label>规格型号</label>
                <input type="text" placeholder="请输入规格型号">
            </div>
            <div class="form-group">
                <label>数量</label>
                <input type="number" placeholder="请输入数量" min="1" required>
            </div>
            <div class="form-group">
                <label>单位</label>
                <select required>
                    <option value="">请选择</option>
                    <option value="件">件</option>
                    <option value="米">米</option>
                    <option value="公斤">公斤</option>
                </select>
            </div>
            <div class="form-group">
                <label>单价</label>
                <input type="number" step="0.01" placeholder="请输入单价">
            </div>
            <div class="form-actions">
                <button type="button" class="btn-remove" onclick="removeProductItem(this)">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;
    productList.appendChild(newItem);
}

// 删除商品项
function removeProductItem(button) {
    const productItem = button.closest('.product-item');
    const productList = productItem.parentNode;
    
    // 至少保留一个商品项
    if (productList.children.length > 1) {
        productItem.remove();
    } else {
        alert('至少需要保留一个商品项');
    }
}

// 搜索库存
function searchStock() {
    const searchInput = document.getElementById('stockSearch');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm) {
        // 在产品数据中搜索
        const results = InventoryDB.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.spec.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.id.toLowerCase().includes(searchTerm)
        ).map(product => ({
            id: product.id,
            name: product.name,
            spec: product.spec,
            stock: product.stock,
            unit: product.unit,
            price: product.price,
            category: product.category
        }));
        
        displayStockResults(results);
    } else {
        // 如果搜索为空，显示所有商品
        displayStockResults(InventoryDB.products.map(product => ({
            id: product.id,
            name: product.name,
            spec: product.spec,
            stock: product.stock,
            unit: product.unit,
            price: product.price,
            category: product.category
        })));
    }
}

// 显示库存搜索结果
function displayStockResults(results) {
    const productList = document.getElementById('outboundProductList');
    productList.innerHTML = '';
    
    if (results.length === 0) {
        productList.innerHTML = '<p class="no-data">未找到匹配的商品</p>';
        return;
    }
    
    results.forEach(item => {
        const stockStatus = item.stock < 10 ? 'low-stock' : item.stock > 100 ? 'high-stock' : 'normal-stock';
        const resultItem = document.createElement('div');
        resultItem.className = 'product-item';
        resultItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>商品编码</label>
                    <input type="text" value="${item.id}" readonly>
                </div>
                <div class="form-group">
                    <label>商品名称</label>
                    <input type="text" value="${item.name}" readonly>
                </div>
                <div class="form-group">
                    <label>规格型号</label>
                    <input type="text" value="${item.spec}" readonly>
                </div>
                <div class="form-group">
                    <label>商品分类</label>
                    <input type="text" value="${item.category}" readonly>
                </div>
                <div class="form-group">
                    <label>当前库存</label>
                    <input type="text" value="${item.stock}" readonly class="${stockStatus}">
                </div>
                <div class="form-group">
                    <label>出库数量</label>
                    <input type="number" placeholder="请输入出库数量" min="1" max="${item.stock}" required 
                           onchange="calculateAmount(this, ${item.price})">
                </div>
                <div class="form-group">
                    <label>单位</label>
                    <input type="text" value="${item.unit}" readonly>
                </div>
                <div class="form-group">
                    <label>单价</label>
                    <input type="text" value="¥${item.price}" readonly>
                </div>
                <div class="form-group">
                    <label>金额</label>
                    <input type="text" class="amount-field" readonly placeholder="¥0.00">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-remove" onclick="removeProductItem(this)">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        productList.appendChild(resultItem);
    });
}

// 计算金额
function calculateAmount(quantityInput, price) {
    const quantity = parseInt(quantityInput.value) || 0;
    const amount = quantity * price;
    const amountField = quantityInput.closest('.product-item').querySelector('.amount-field');
    amountField.value = `¥${amount.toFixed(2)}`;
    
    // 更新总金额
    updateTotalAmount();
}

// 更新总金额
function updateTotalAmount() {
    const amountFields = document.querySelectorAll('.amount-field');
    let total = 0;
    
    amountFields.forEach(field => {
        const value = field.value.replace('¥', '').replace(',', '');
        total += parseFloat(value) || 0;
    });
    
    // 如果存在总金额显示区域，更新它
    const totalAmountElement = document.querySelector('.total-amount');
    if (totalAmountElement) {
        totalAmountElement.textContent = `总金额: ¥${total.toFixed(2)}`;
    }
}

// 处理表单提交
function handleFormSubmit(form) {
    const formData = new FormData(form);
    const modal = form.closest('.inventory-modal');
    
    // 模拟保存数据
    console.log('保存数据:', Object.fromEntries(formData));
    
    // 显示成功消息
    alert('保存成功！');
    
    // 刷新列表数据
    refreshTableData(modal.id);
    
    // 切换到列表视图
    switchToListView(modal);
}

// 切换到列表视图
function switchToListView(modal) {
    const navItems = modal.querySelectorAll('.modal-nav-item');
    const tabContents = modal.querySelectorAll('.modal-tab-content');
    
    // 找到列表选项卡
    navItems.forEach((item, index) => {
        if (item.textContent.includes('记录')) {
            // 移除所有active类
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 激活列表选项卡
            item.classList.add('active');
            tabContents[index].classList.add('active');
        }
    });
}

// 刷新表格数据
function refreshTableData(modalId) {
    const tableBodyMap = {
        'inboundModal': 'inboundTableBody',
        'outboundModal': 'outboundTableBody',
        'transferModal': 'transferTableBody'
    };
    
    const tableBodyId = tableBodyMap[modalId];
    if (tableBodyId) {
        loadTableData(tableBodyId);
    }
}

// 加载模态框数据
function loadModalData(functionType) {
    switch (functionType) {
        case 'inbound':
            loadTableData('inboundTableBody');
            break;
        case 'outbound':
            loadTableData('outboundTableBody');
            break;
        case 'transfer':
            loadTableData('transferTableBody');
            break;
        case 'analysis':
            loadAnalysisData();
            break;
    }
}

// 加载表格数据
function loadTableData(tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) return;
    
    let data = [];
    
    switch (tableBodyId) {
        case 'inboundTableBody':
            data = InventoryDB.inboundRecords.map(record => {
                const supplier = InventoryDB.suppliers.find(s => s.id === record.supplier);
                const warehouse = InventoryDB.warehouses.find(w => w.id === record.warehouse);
                const statusText = getStatusText(record.status);
                const productCount = record.products.length;
                
                return [
                    record.id,
                    record.date,
                    supplier ? supplier.name : '未知供应商',
                    warehouse ? warehouse.name : '未知仓库',
                    productCount,
                    `¥${record.totalAmount.toLocaleString()}`,
                    `<span class="status-badge ${record.status}">${statusText}</span>`,
                    `<button class="btn-small" onclick="viewRecord('${record.id}', 'inbound')">查看</button> | 
                     <button class="btn-small" onclick="editRecord('${record.id}', 'inbound')">编辑</button> |
                     <button class="btn-small" onclick="deleteRecord('${record.id}', 'inbound')">删除</button>`
                ];
            });
            break;
            
        case 'outboundTableBody':
            data = InventoryDB.outboundRecords.map(record => {
                const warehouse = InventoryDB.warehouses.find(w => w.id === record.warehouse);
                const customer = InventoryDB.customers.find(c => c.id === record.customer) || 
                               InventoryDB.warehouses.find(w => w.id === record.customer);
                const statusText = getStatusText(record.status);
                const productCount = record.products.length;
                const typeText = getOutboundTypeText(record.type);
                
                return [
                    record.id,
                    record.date,
                    typeText,
                    warehouse ? warehouse.name : '未知仓库',
                    customer ? customer.name : '未知客户',
                    productCount,
                    `<span class="status-badge ${record.status}">${statusText}</span>`,
                    `<button class="btn-small" onclick="viewRecord('${record.id}', 'outbound')">查看</button> | 
                     <button class="btn-small" onclick="editRecord('${record.id}', 'outbound')">编辑</button> |
                     <button class="btn-small" onclick="deleteRecord('${record.id}', 'outbound')">删除</button>`
                ];
            });
            break;
            
        case 'transferTableBody':
            data = InventoryDB.transferRecords.map(record => {
                const fromWarehouse = InventoryDB.warehouses.find(w => w.id === record.fromWarehouse);
                const toWarehouse = InventoryDB.warehouses.find(w => w.id === record.toWarehouse);
                const statusText = getStatusText(record.status);
                const productCount = record.products.length;
                const reasonText = getTransferReasonText(record.reason);
                
                return [
                    record.id,
                    record.date,
                    fromWarehouse ? fromWarehouse.name : '未知仓库',
                    toWarehouse ? toWarehouse.name : '未知仓库',
                    productCount,
                    reasonText,
                    `<span class="status-badge ${record.status}">${statusText}</span>`,
                    `<button class="btn-small" onclick="viewRecord('${record.id}', 'transfer')">查看</button> | 
                     <button class="btn-small" onclick="editRecord('${record.id}', 'transfer')">编辑</button> |
                     <button class="btn-small" onclick="deleteRecord('${record.id}', 'transfer')">删除</button>`
                ];
            });
            break;
    }
    
    tableBody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = row.map(cell => `<td>${cell}</td>`).join('');
        tableBody.appendChild(tr);
    });
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'pending': '待审核',
        'approved': '已审核', 
        'completed': '已完成',
        'processing': '进行中',
        'cancelled': '已取消'
    };
    return statusMap[status] || status;
}

// 获取出库类型文本
function getOutboundTypeText(type) {
    const typeMap = {
        'sale': '销售出库',
        'production': '生产领料',
        'transfer': '调拨出库',
        'return': '退货出库'
    };
    return typeMap[type] || type;
}

// 获取调拨原因文本
function getTransferReasonText(reason) {
    const reasonMap = {
        'shortage': '库存不足',
        'balance': '库存平衡',
        'maintenance': '仓库维护',
        'other': '其他原因'
    };
    return reasonMap[reason] || reason;
}

// 加载分析数据
function loadAnalysisData() {
    // 加载周转分析数据
    loadTurnoverData();
    
    // 加载报表数据
    loadReportData();
    
    // 初始化图表
    setTimeout(() => {
        initCharts();
    }, 100);
}

// 加载周转分析数据
function loadTurnoverData() {
    const tableBody = document.getElementById('turnoverTableBody');
    if (!tableBody) return;
    
    const mockData = [
        ['有机棉针织面料', '原材料', '200', '150', '175', '¥52,500', '8.5', '43', '良好'],
        ['童装印花面料', '原材料', '150', '89', '119.5', '¥35,850', '6.2', '59', '一般'],
        ['纽扣配件', '辅料', '1000', '500', '750', '¥7,500', '12.0', '30', '优秀']
    ];
    
    tableBody.innerHTML = '';
    mockData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = row.map(cell => `<td>${cell}</td>`).join('');
        tableBody.appendChild(tr);
    });
}

// 加载报表数据
function loadReportData() {
    const tableBody = document.getElementById('reportTableBody');
    if (!tableBody) return;
    
    const mockData = [
        ['P001', '有机棉针织面料', '32支', '原料仓库', '200', '50', '100', '150', '¥45,000'],
        ['P002', '童装印花面料', '40支', '主仓库', '150', '30', '91', '89', '¥26,700'],
        ['P003', '纽扣配件', '12mm', '主仓库', '1000', '200', '700', '500', '¥5,000']
    ];
    
    tableBody.innerHTML = '';
    mockData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = row.map(cell => `<td>${cell}</td>`).join('');
        tableBody.appendChild(tr);
    });
}

// 模拟数据库
const InventoryDB = {
    // 商品数据
    products: [
        { id: 'P001', name: '有机棉针织面料', spec: '32支', category: '原材料', unit: '米', price: 25.50, stock: 150, warehouse: 'warehouse2', supplier: 'supplier1' },
        { id: 'P002', name: '童装印花面料', spec: '40支', category: '原材料', unit: '米', price: 32.80, stock: 89, warehouse: 'warehouse1', supplier: 'supplier2' },
        { id: 'P003', name: '纽扣配件', spec: '12mm', category: '辅料', unit: '个', price: 0.50, stock: 500, warehouse: 'warehouse1', supplier: 'supplier3' },
        { id: 'P004', name: '拉链配件', spec: '20cm', category: '辅料', unit: '条', price: 2.30, stock: 280, warehouse: 'warehouse1', supplier: 'supplier3' },
        { id: 'P005', name: '童装T恤', spec: '110-160码', category: '成品', unit: '件', price: 45.00, stock: 120, warehouse: 'warehouse3', supplier: null },
        { id: 'P006', name: '童装连衣裙', spec: '110-150码', category: '成品', unit: '件', price: 68.00, stock: 85, warehouse: 'warehouse3', supplier: null },
        { id: 'P007', name: '弹力牛仔面料', spec: '12oz', category: '原材料', unit: '米', price: 28.90, stock: 200, warehouse: 'warehouse2', supplier: 'supplier1' },
        { id: 'P008', name: '童装外套', spec: '120-170码', category: '成品', unit: '件', price: 89.00, stock: 65, warehouse: 'warehouse3', supplier: null },
        { id: 'P009', name: '绣花线', spec: '多色', category: '辅料', unit: '卷', price: 3.20, stock: 350, warehouse: 'warehouse1', supplier: 'supplier3' },
        { id: 'P010', name: '童装短裤', spec: '110-160码', category: '成品', unit: '件', price: 35.00, stock: 95, warehouse: 'warehouse3', supplier: null },
        { id: 'P011', name: '纯棉里布', spec: '平纹', category: '原材料', unit: '米', price: 18.50, stock: 180, warehouse: 'warehouse2', supplier: 'supplier1' },
        { id: 'P012', name: '魔术贴', spec: '2cm宽', category: '辅料', unit: '米', price: 1.80, stock: 120, warehouse: 'warehouse1', supplier: 'supplier3' }
    ],
    
    // 供应商数据
    suppliers: [
        { id: 'supplier1', name: '织里优质面料有限公司', contact: '张经理', phone: '0572-3856789', address: '湖州市织里镇工业园区A区' },
        { id: 'supplier2', name: '湖州印艺数码科技有限公司', contact: '李总', phone: '0572-3967890', address: '湖州市织里镇数码印花园' },
        { id: 'supplier3', name: '浙江童装辅料供应商', contact: '王主管', phone: '0572-3745612', address: '湖州市织里镇辅料市场B栋' },
        { id: 'supplier4', name: '江苏优质纺织有限公司', contact: '陈经理', phone: '0512-6789012', address: '江苏省苏州市纺织工业园' },
        { id: 'supplier5', name: '广东童装配件厂', contact: '刘总监', phone: '0769-8901234', address: '广东省东莞市童装产业园' }
    ],
    
    // 仓库数据
    warehouses: [
        { id: 'warehouse1', name: '主仓库', address: '织里镇中心仓储区1号', manager: '赵仓管', capacity: 5000 },
        { id: 'warehouse2', name: '原料仓库', address: '织里镇原料存储区2号', manager: '钱仓管', capacity: 3000 },
        { id: 'warehouse3', name: '成品仓库', address: '织里镇成品存储区3号', manager: '孙仓管', capacity: 4000 }
    ],
    
    // 客户/部门数据
    customers: [
        { id: 'dept1', name: '生产部', type: 'department', contact: '生产主管', phone: '内线001' },
        { id: 'dept2', name: '销售部', type: 'department', contact: '销售经理', phone: '内线002' },
        { id: 'dept3', name: '设计部', type: 'department', contact: '设计总监', phone: '内线003' },
        { id: 'customer1', name: '杭州童装批发市场', type: 'customer', contact: '采购部', phone: '0571-8888888' },
        { id: 'customer2', name: '上海儿童服饰连锁店', type: 'customer', contact: '区域经理', phone: '021-9999999' },
        { id: 'customer3', name: '北京童装专卖店', type: 'customer', contact: '店长', phone: '010-7777777' },
        { id: 'customer4', name: '广州童装贸易公司', type: 'customer', contact: '贸易经理', phone: '020-6666666' }
    ],
    
    // 入库记录
    inboundRecords: [
        { id: 'RK20240101001', date: '2024-01-15', supplier: 'supplier1', warehouse: 'warehouse2', products: [{ productId: 'P001', quantity: 100, price: 25.50 }], status: 'completed', operator: '张三', totalAmount: 2550 },
        { id: 'RK20240102002', date: '2024-01-16', supplier: 'supplier2', warehouse: 'warehouse1', products: [{ productId: 'P002', quantity: 50, price: 32.80 }], status: 'approved', operator: '李四', totalAmount: 1640 },
        { id: 'RK20240103003', date: '2024-01-17', supplier: 'supplier3', warehouse: 'warehouse1', products: [{ productId: 'P003', quantity: 200, price: 0.50 }], status: 'pending', operator: '王五', totalAmount: 100 },
        { id: 'RK20240104004', date: '2024-01-18', supplier: 'supplier1', warehouse: 'warehouse2', products: [{ productId: 'P007', quantity: 80, price: 28.90 }], status: 'completed', operator: '张三', totalAmount: 2312 },
        { id: 'RK20240105005', date: '2024-01-19', supplier: 'supplier3', warehouse: 'warehouse1', products: [{ productId: 'P004', quantity: 150, price: 2.30 }], status: 'approved', operator: '赵六', totalAmount: 345 },
        { id: 'RK20240106006', date: '2024-01-20', supplier: 'supplier2', warehouse: 'warehouse1', products: [{ productId: 'P009', quantity: 100, price: 3.20 }], status: 'completed', operator: '李四', totalAmount: 320 }
    ],
    
    // 出库记录
    outboundRecords: [
        { id: 'CK20240101001', date: '2024-01-15', type: 'sale', warehouse: 'warehouse3', customer: 'customer1', products: [{ productId: 'P005', quantity: 20 }], status: 'completed', operator: '销售员A' },
        { id: 'CK20240102002', date: '2024-01-16', type: 'production', warehouse: 'warehouse2', customer: 'dept1', products: [{ productId: 'P001', quantity: 30 }], status: 'completed', operator: '生产员B' },
        { id: 'CK20240103003', date: '2024-01-17', type: 'sale', warehouse: 'warehouse3', customer: 'customer2', products: [{ productId: 'P006', quantity: 15 }], status: 'processing', operator: '销售员C' },
        { id: 'CK20240104004', date: '2024-01-18', type: 'production', warehouse: 'warehouse1', customer: 'dept1', products: [{ productId: 'P003', quantity: 50 }], status: 'completed', operator: '生产员D' },
        { id: 'CK20240105005', date: '2024-01-19', type: 'sale', warehouse: 'warehouse3', customer: 'customer3', products: [{ productId: 'P008', quantity: 10 }], status: 'completed', operator: '销售员E' },
        { id: 'CK20240106006', date: '2024-01-20', type: 'transfer', warehouse: 'warehouse1', customer: 'warehouse3', products: [{ productId: 'P004', quantity: 25 }], status: 'approved', operator: '仓管员F' }
    ],
    
    // 调拨记录
    transferRecords: [
        { id: 'DB20240101001', date: '2024-01-15', fromWarehouse: 'warehouse1', toWarehouse: 'warehouse2', products: [{ productId: 'P003', quantity: 50 }], reason: 'balance', status: 'completed', operator: '调拨员A' },
        { id: 'DB20240102002', date: '2024-01-16', fromWarehouse: 'warehouse2', toWarehouse: 'warehouse3', products: [{ productId: 'P001', quantity: 20 }], reason: 'shortage', status: 'approved', operator: '调拨员B' },
        { id: 'DB20240103003', date: '2024-01-17', fromWarehouse: 'warehouse1', toWarehouse: 'warehouse3', products: [{ productId: 'P004', quantity: 30 }], reason: 'balance', status: 'pending', operator: '调拨员C' },
        { id: 'DB20240104004', date: '2024-01-18', fromWarehouse: 'warehouse3', toWarehouse: 'warehouse1', products: [{ productId: 'P005', quantity: 15 }], reason: 'maintenance', status: 'completed', operator: '调拨员D' }
    ]
};

// 初始化库存数据
function initInventoryData() {
    // 设置今天的日期为默认值
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });
    
    // 初始化下拉选项
    initSelectOptions();
}

// 查看记录详情
function viewRecord(recordId, type) {
    let record = null;
    let title = '';
    
    switch (type) {
        case 'inbound':
            record = InventoryDB.inboundRecords.find(r => r.id === recordId);
            title = '入库单详情';
            break;
        case 'outbound':
            record = InventoryDB.outboundRecords.find(r => r.id === recordId);
            title = '出库单详情';
            break;
        case 'transfer':
            record = InventoryDB.transferRecords.find(r => r.id === recordId);
            title = '调拨单详情';
            break;
    }
    
    if (record) {
        showRecordDetailModal(record, title, type);
    }
}

// 编辑记录
function editRecord(recordId, type) {
    alert(`编辑功能开发中... 记录ID: ${recordId}, 类型: ${type}`);
    // 这里可以实现编辑功能
}

// 删除记录
function deleteRecord(recordId, type) {
    if (confirm('确定要删除这条记录吗？')) {
        switch (type) {
            case 'inbound':
                const inboundIndex = InventoryDB.inboundRecords.findIndex(r => r.id === recordId);
                if (inboundIndex > -1) {
                    InventoryDB.inboundRecords.splice(inboundIndex, 1);
                    loadTableData('inboundTableBody');
                }
                break;
            case 'outbound':
                const outboundIndex = InventoryDB.outboundRecords.findIndex(r => r.id === recordId);
                if (outboundIndex > -1) {
                    InventoryDB.outboundRecords.splice(outboundIndex, 1);
                    loadTableData('outboundTableBody');
                }
                break;
            case 'transfer':
                const transferIndex = InventoryDB.transferRecords.findIndex(r => r.id === recordId);
                if (transferIndex > -1) {
                    InventoryDB.transferRecords.splice(transferIndex, 1);
                    loadTableData('transferTableBody');
                }
                break;
        }
        alert('删除成功！');
    }
}

// 显示记录详情模态框
function showRecordDetailModal(record, title, type) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'inventory-modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <span class="modal-close" onclick="closeDetailModal(this)">&times;</span>
            </div>
            <div class="modal-body">
                <div class="record-detail">
                    ${generateRecordDetailHTML(record, type)}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// 关闭详情模态框
function closeDetailModal(closeBtn) {
    const modal = closeBtn.closest('.inventory-modal');
    modal.remove();
    document.body.style.overflow = 'auto';
}

// 生成记录详情HTML
function generateRecordDetailHTML(record, type) {
    let html = `
        <div class="detail-section">
            <h4>基本信息</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>单据号:</label>
                    <span>${record.id}</span>
                </div>
                <div class="detail-item">
                    <label>日期:</label>
                    <span>${record.date}</span>
                </div>
                <div class="detail-item">
                    <label>状态:</label>
                    <span class="status-badge ${record.status}">${getStatusText(record.status)}</span>
                </div>
                <div class="detail-item">
                    <label>操作员:</label>
                    <span>${record.operator}</span>
                </div>
    `;
    
    // 根据类型添加特定信息
    switch (type) {
        case 'inbound':
            const supplier = InventoryDB.suppliers.find(s => s.id === record.supplier);
            const warehouse = InventoryDB.warehouses.find(w => w.id === record.warehouse);
            html += `
                <div class="detail-item">
                    <label>供应商:</label>
                    <span>${supplier ? supplier.name : '未知供应商'}</span>
                </div>
                <div class="detail-item">
                    <label>仓库:</label>
                    <span>${warehouse ? warehouse.name : '未知仓库'}</span>
                </div>
                <div class="detail-item">
                    <label>总金额:</label>
                    <span>¥${record.totalAmount.toLocaleString()}</span>
                </div>
            `;
            break;
        case 'outbound':
            const outWarehouse = InventoryDB.warehouses.find(w => w.id === record.warehouse);
            const customer = InventoryDB.customers.find(c => c.id === record.customer);
            html += `
                <div class="detail-item">
                    <label>出库类型:</label>
                    <span>${getOutboundTypeText(record.type)}</span>
                </div>
                <div class="detail-item">
                    <label>仓库:</label>
                    <span>${outWarehouse ? outWarehouse.name : '未知仓库'}</span>
                </div>
                <div class="detail-item">
                    <label>客户/部门:</label>
                    <span>${customer ? customer.name : '未知客户'}</span>
                </div>
            `;
            break;
        case 'transfer':
            const fromWarehouse = InventoryDB.warehouses.find(w => w.id === record.fromWarehouse);
            const toWarehouse = InventoryDB.warehouses.find(w => w.id === record.toWarehouse);
            html += `
                <div class="detail-item">
                    <label>调出仓库:</label>
                    <span>${fromWarehouse ? fromWarehouse.name : '未知仓库'}</span>
                </div>
                <div class="detail-item">
                    <label>调入仓库:</label>
                    <span>${toWarehouse ? toWarehouse.name : '未知仓库'}</span>
                </div>
                <div class="detail-item">
                    <label>调拨原因:</label>
                    <span>${getTransferReasonText(record.reason)}</span>
                </div>
            `;
            break;
    }
    
    html += `
            </div>
        </div>
        <div class="detail-section">
            <h4>商品明细</h4>
            <div class="detail-table">
                <table>
                    <thead>
                        <tr>
                            <th>商品编码</th>
                            <th>商品名称</th>
                            <th>规格型号</th>
                            <th>数量</th>
                            <th>单位</th>
                            ${type === 'inbound' ? '<th>单价</th><th>金额</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    record.products.forEach(product => {
        const productInfo = InventoryDB.products.find(p => p.id === product.productId);
        html += `
            <tr>
                <td>${product.productId}</td>
                <td>${productInfo ? productInfo.name : '未知商品'}</td>
                <td>${productInfo ? productInfo.spec : '-'}</td>
                <td>${product.quantity}</td>
                <td>${productInfo ? productInfo.unit : '-'}</td>
                ${type === 'inbound' ? `<td>¥${product.price}</td><td>¥${(product.quantity * product.price).toFixed(2)}</td>` : ''}
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    return html;
}

// 初始化图表
function initCharts() {
    // 库存分布饼图
    initInventoryDistributionChart();
    
    // 库存趋势线图
    initInventoryTrendChart();
    
    // 周转率分析图
    initTurnoverChart();
    
    // 供应商分析图
    initSupplierChart();
}

// 库存分布饼图
function initInventoryDistributionChart() {
    const ctx = document.getElementById('inventoryDistributionChart');
    if (!ctx) return;
    
    // 计算各类别库存分布
    const categoryData = {};
    InventoryDB.products.forEach(product => {
        const category = product.category;
        if (!categoryData[category]) {
            categoryData[category] = { count: 0, value: 0 };
        }
        categoryData[category].count += product.stock;
        categoryData[category].value += product.stock * product.price;
    });
    
    const labels = Object.keys(categoryData);
    const data = labels.map(label => categoryData[label].count);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value}件 (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 库存趋势线图
function initInventoryTrendChart() {
    const ctx = document.getElementById('inventoryTrendChart');
    if (!ctx) return;
    
    // 模拟最近7天的库存变化数据
    const dates = [];
    const inventoryData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        
        // 模拟库存变化（基于当前总库存的波动）
        const totalStock = InventoryDB.products.reduce((sum, product) => sum + product.stock, 0);
        const variation = Math.random() * 200 - 100; // ±100的随机变化
        inventoryData.push(Math.max(0, totalStock + variation));
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '库存总量',
                data: inventoryData,
                borderColor: '#4a6bdf',
                backgroundColor: 'rgba(74, 107, 223, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4a6bdf',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#4a6bdf',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#666'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#666',
                        callback: function(value) {
                            return value + '件';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 周转率分析图
function initTurnoverChart() {
    const ctx = document.getElementById('turnoverChart');
    if (!ctx) return;
    
    // 计算各商品的周转率（模拟数据）
    const products = InventoryDB.products.slice(0, 8); // 取前8个商品
    const labels = products.map(p => p.name.length > 8 ? p.name.substring(0, 8) + '...' : p.name);
    const turnoverData = products.map(() => (Math.random() * 10 + 2).toFixed(1)); // 2-12的随机周转率
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '周转率(次/年)',
                data: turnoverData,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ],
                borderColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ],
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            return `周转率: ${context.parsed.y}次/年`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#666',
                        maxRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#666',
                        callback: function(value) {
                            return value + '次';
                        }
                    }
                }
            }
        }
    });
}

// 供应商分析图
function initSupplierChart() {
    const ctx = document.getElementById('supplierChart');
    if (!ctx) return;
    
    // 计算各供应商的供货量和金额
    const supplierData = {};
    InventoryDB.inboundRecords.forEach(record => {
        const supplier = InventoryDB.suppliers.find(s => s.id === record.supplier);
        if (supplier) {
            if (!supplierData[supplier.name]) {
                supplierData[supplier.name] = { amount: 0, count: 0 };
            }
            supplierData[supplier.name].amount += record.totalAmount;
            supplierData[supplier.name].count += 1;
        }
    });
    
    const labels = Object.keys(supplierData);
    const amounts = labels.map(label => supplierData[label].amount);
    const counts = labels.map(label => supplierData[label].count);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(name => name.length > 10 ? name.substring(0, 10) + '...' : name),
            datasets: [{
                label: '采购金额(元)',
                data: amounts,
                backgroundColor: 'rgba(74, 107, 223, 0.8)',
                borderColor: '#4a6bdf',
                borderWidth: 1,
                yAxisID: 'y',
                borderRadius: 4
            }, {
                label: '采购次数',
                data: counts,
                type: 'line',
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderWidth: 3,
                fill: false,
                yAxisID: 'y1',
                tension: 0.4,
                pointBackgroundColor: '#ff6b6b',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff'
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#666',
                        maxRotation: 45
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#666',
                        callback: function(value) {
                            return '¥' + value.toLocaleString();
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        color: '#666',
                        callback: function(value) {
                            return value + '次';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 初始化下拉选项
function initSelectOptions() {
    // 供应商选项
    const supplierSelects = document.querySelectorAll('#supplier');
    supplierSelects.forEach(select => {
        select.innerHTML = '<option value="">请选择供应商</option>';
        InventoryDB.suppliers.forEach(supplier => {
            select.innerHTML += `<option value="${supplier.id}">${supplier.name}</option>`;
        });
    });
    
    // 仓库选项
    const warehouseSelects = document.querySelectorAll('#warehouse, #outWarehouse, #fromWarehouse, #toWarehouse');
    warehouseSelects.forEach(select => {
        const placeholder = select.id === 'fromWarehouse' ? '请选择调出仓库' : 
                          select.id === 'toWarehouse' ? '请选择调入仓库' : '请选择仓库';
        select.innerHTML = `<option value="">${placeholder}</option>`;
        InventoryDB.warehouses.forEach(warehouse => {
            select.innerHTML += `<option value="${warehouse.id}">${warehouse.name}</option>`;
        });
    });
}

// 添加调拨商品项
function addTransferItem() {
    const productList = document.getElementById('transferProductList');
    if (!productList) return;
    
    const newItem = document.createElement('div');
    newItem.className = 'product-item';
    newItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>商品名称</label>
                <select required>
                    <option value="">请选择商品</option>
                    ${InventoryDB.products.map(product => 
                        `<option value="${product.id}">${product.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>规格型号</label>
                <input type="text" readonly>
            </div>
            <div class="form-group">
                <label>当前库存</label>
                <input type="text" readonly>
            </div>
            <div class="form-group">
                <label>调拨数量</label>
                <input type="number" placeholder="请输入调拨数量" min="1" required>
            </div>
            <div class="form-group">
                <label>单位</label>
                <input type="text" readonly>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-remove" onclick="removeProductItem(this)">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    // 添加商品选择事件
    const select = newItem.querySelector('select');
    select.addEventListener('change', function() {
        const productId = this.value;
        const product = InventoryDB.products.find(p => p.id === productId);
        if (product) {
            const inputs = newItem.querySelectorAll('input');
            inputs[0].value = product.spec; // 规格
            inputs[1].value = product.stock; // 库存
            inputs[2].max = product.stock; // 设置最大调拨数量
            inputs[3].value = product.unit; // 单位
        }
    });
    
    productList.appendChild(newItem);
}

// 导出数据功能
function exportData(type, format) {
    let data = [];
    let filename = '';
    
    switch (type) {
        case 'inbound':
            data = InventoryDB.inboundRecords;
            filename = '入库记录';
            break;
        case 'outbound':
            data = InventoryDB.outboundRecords;
            filename = '出库记录';
            break;
        case 'transfer':
            data = InventoryDB.transferRecords;
            filename = '调拨记录';
            break;
        case 'inventory':
            data = InventoryDB.products;
            filename = '库存清单';
            break;
    }
    
    if (format === 'excel') {
        exportToExcel(data, filename);
    } else if (format === 'csv') {
        exportToCSV(data, filename);
    }
}

// 导出为CSV
function exportToCSV(data, filename) {
    if (data.length === 0) {
        alert('没有数据可导出');
        return;
    }
    
    // 获取表头
    const headers = Object.keys(data[0]);
    let csvContent = headers.join(',') + '\n';
    
    // 添加数据行
    data.forEach(row => {
        const values = headers.map(header => {
            let value = row[header];
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            return `"${value}"`;
        });
        csvContent += values.join(',') + '\n';
    });
    
    // 下载文件
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// 导出为Excel（简化版）
function exportToExcel(data, filename) {
    if (data.length === 0) {
        alert('没有数据可导出');
        return;
    }
    
    let html = '<table border="1">';
    
    // 表头
    const headers = Object.keys(data[0]);
    html += '<tr>';
    headers.forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr>';
    
    // 数据行
    data.forEach(row => {
        html += '<tr>';
        headers.forEach(header => {
            let value = row[header];
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</table>';
    
    // 创建下载
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
}

// 高级搜索功能
function advancedSearch(type) {
    const modal = document.createElement('div');
    modal.className = 'inventory-modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>高级搜索 - ${type === 'inbound' ? '入库记录' : type === 'outbound' ? '出库记录' : '调拨记录'}</h3>
                <span class="modal-close" onclick="closeModal()">&times;</span>
            </div>
            <div class="modal-body">
                <form id="advancedSearchForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>日期范围</label>
                            <input type="date" id="startDate">
                            <span style="margin: 0 10px;">至</span>
                            <input type="date" id="endDate">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>状态</label>
                            <select id="statusFilter">
                                <option value="">全部状态</option>
                                <option value="pending">待审核</option>
                                <option value="approved">已审核</option>
                                <option value="completed">已完成</option>
                                <option value="processing">进行中</option>
                                <option value="cancelled">已取消</option>
                            </select>
                        </div>
                        ${type === 'inbound' ? `
                        <div class="form-group">
                            <label>金额范围</label>
                            <input type="number" placeholder="最小金额" id="minAmount">
                            <input type="number" placeholder="最大金额" id="maxAmount">
                        </div>
                        ` : ''}
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-primary" onclick="performAdvancedSearch('${type}')">搜索</button>
                        <button type="button" class="btn-secondary" onclick="resetAdvancedSearch('${type}')">重置</button>
                        <button type="button" class="btn-secondary" onclick="closeModal()">取消</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// 执行高级搜索
function performAdvancedSearch(type) {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const status = document.getElementById('statusFilter').value;
    const minAmount = parseFloat(document.getElementById('minAmount')?.value) || 0;
    const maxAmount = parseFloat(document.getElementById('maxAmount')?.value) || Infinity;
    
    let records;
    switch (type) {
        case 'inbound':
            records = InventoryDB.inboundRecords;
            break;
        case 'outbound':
            records = InventoryDB.outboundRecords;
            break;
        case 'transfer':
            records = InventoryDB.transferRecords;
            break;
    }
    
    const filteredRecords = records.filter(record => {
        // 日期过滤
        if (startDate && record.date < startDate) return false;
        if (endDate && record.date > endDate) return false;
        
        // 状态过滤
        if (status && record.status !== status) return false;
        
        // 金额过滤（仅对入库记录）
        if (type === 'inbound' && record.totalAmount) {
            if (record.totalAmount < minAmount || record.totalAmount > maxAmount) return false;
        }
        
        return true;
    });
    
    // 显示搜索结果
    displaySearchResults(filteredRecords, type);
    closeModal();
    
    // 显示搜索结果提示
    alert(`找到 ${filteredRecords.length} 条符合条件的记录`);
}

// 显示搜索结果
function displaySearchResults(results, type) {
    // 临时存储原始数据
    const originalData = {
        inbound: [...InventoryDB.inboundRecords],
        outbound: [...InventoryDB.outboundRecords],
        transfer: [...InventoryDB.transferRecords]
    };
    
    // 替换为搜索结果
    switch (type) {
        case 'inbound':
            InventoryDB.inboundRecords = results;
            break;
        case 'outbound':
            InventoryDB.outboundRecords = results;
            break;
        case 'transfer':
            InventoryDB.transferRecords = results;
            break;
    }
    
    // 重新加载表格
    loadTableData(`${type}TableBody`);
    
    // 添加重置按钮
    const tableContainer = document.querySelector(`#${type}TableBody`).closest('.data-table');
    let resetBtn = tableContainer.querySelector('.reset-search-btn');
    if (!resetBtn) {
        resetBtn = document.createElement('button');
        resetBtn.className = 'btn-secondary reset-search-btn';
        resetBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> 显示全部记录';
        resetBtn.onclick = () => resetSearchResults(originalData, type);
        tableContainer.parentNode.insertBefore(resetBtn, tableContainer);
    }
}

// 重置搜索结果
function resetSearchResults(originalData, type) {
    // 恢复原始数据
    switch (type) {
        case 'inbound':
            InventoryDB.inboundRecords = originalData.inbound;
            break;
        case 'outbound':
            InventoryDB.outboundRecords = originalData.outbound;
            break;
        case 'transfer':
            InventoryDB.transferRecords = originalData.transfer;
            break;
    }
    
    // 重新加载表格
    loadTableData(`${type}TableBody`);
    
    // 移除重置按钮
    const resetBtn = document.querySelector('.reset-search-btn');
    if (resetBtn) {
        resetBtn.remove();
    }
}

// 重置高级搜索表单
function resetAdvancedSearch(type) {
    document.getElementById('advancedSearchForm').reset();
} 
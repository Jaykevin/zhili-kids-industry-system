document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM加载完成，开始初始化企业页面功能");

    // 初始化企业详情弹窗
    initEnterpriseDetailModal();

    // 视图切换功能
    const viewToggleButtons = document.querySelectorAll('.view-toggle button');
    const enterpriseList = document.querySelector('.enterprise-list');

    viewToggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            // 移除所有按钮的active类
            viewToggleButtons.forEach(btn => btn.classList.remove('active'));

            // 添加当前按钮的active类
            this.classList.add('active');

            // 获取视图类型
            const viewType = this.getAttribute('data-view');

            // 移除企业列表的所有视图类
            enterpriseList.classList.remove('grid-view', 'list-view');

            // 添加当前视图类
            enterpriseList.classList.add(`${viewType}-view`);
        });
    });

    // 排序功能
    const sortLinks = document.querySelectorAll('.filter-group a');

    sortLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // 移除所有链接的active类
            sortLinks.forEach(lnk => lnk.classList.remove('active'));

            // 添加当前链接的active类
            this.classList.add('active');

            // 这里可以实现实际的排序功能
            // 由于目前使用的是静态数据，所以只是模拟排序效果
            simulateSorting(this.textContent);
        });
    });

    // ===== 重写分页功能 =====
    let currentPage = 1;
    const totalPages = 3;

    // 获取所有分页按钮
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

    // 显示指定页面的企业卡片
    function showPage(pageNum) {
        console.log("显示第", pageNum, "页");

        // 1. 更新分页按钮状态
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

        // 2. 显示当前页的企业卡片，隐藏其他页的卡片
        const allCards = document.querySelectorAll('.enterprise-card');
        let visibleCount = 0;

        allCards.forEach(card => {
            const cardPage = card.getAttribute('data-page');

            if (cardPage == pageNum) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        console.log(`第${pageNum}页显示了${visibleCount}张卡片`);
    }

    // 搜索表单提交
    const searchForm = document.getElementById('enterprise-search');

    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 获取搜索条件
            const searchData = {
                name: document.getElementById('enterprise-name').value,
                type: document.getElementById('enterprise-type').value,
                scale: document.getElementById('enterprise-scale').value,
                cert: document.getElementById('enterprise-cert').value
            };

            // 这里可以实现实际的搜索功能
            // 由于目前使用的是静态数据，所以只是模拟搜索效果
            simulateSearch(searchData);
        });
    }

    // 模拟排序效果
    function simulateSorting(sortType) {
        // 获取所有企业卡片
        const enterpriseCards = document.querySelectorAll('.enterprise-card');
        const enterpriseCardsArray = Array.from(enterpriseCards);

        // 根据排序类型重新排列企业卡片
        switch (sortType) {
            case '注册时间':
                // 模拟按照注册时间排序
                enterpriseCardsArray.sort(() => Math.random() - 0.5);
                break;
            case '企业规模':
                // 模拟按照企业规模排序
                enterpriseCardsArray.sort(() => Math.random() - 0.5);
                break;
            case '认证数量':
                // 模拟按照认证数量排序
                enterpriseCardsArray.sort(() => Math.random() - 0.5);
                break;
            default:
                // 默认排序
                enterpriseCardsArray.sort(() => Math.random() - 0.5);
                break;
        }

        // 清空企业列表
        enterpriseList.innerHTML = '';

        // 将排序后的企业卡片重新添加到企业列表
        enterpriseCardsArray.forEach(card => {
            enterpriseList.appendChild(card);
        });

        console.log(`已按照${sortType}排序`);
    }

    // 模拟搜索效果
    function simulateSearch(searchData) {
        // 获取所有企业卡片
        const enterpriseCards = document.querySelectorAll('.enterprise-card');

        // 模拟搜索延迟
        setTimeout(() => {
            // 随机隐藏一些企业卡片，模拟搜索结果
            let visibleCount = 0;
            enterpriseCards.forEach(card => {
                if (Math.random() > 0.5) {
                    card.style.display = 'none';
                } else {
                    card.style.display = 'block';
                    visibleCount++;
                }
            });

            console.log(`搜索完成，共找到 ${visibleCount} 家符合条件的企业`);
        }, 500);
    }

    // 企业数据
    const enterpriseData = {
        "company1": {
            name: "浙江童趣服饰有限公司",
            logo: "../images/company/company-logo1.jpg",
            type: "生产企业",
            scale: "大型企业",
            cert: "ISO9001",
            address: "浙江省湖州市织里镇开发区创业大道88号",
            phone: "0572-12345678",
            email: "contact@tongqu.com",
            website: "www.tongqu.com",
            description: "浙江童趣服饰有限公司成立于2005年，是一家专注于3-12岁儿童服装的设计和生产企业。公司拥有现代化的生产基地，年产能超过200万件。产品以时尚、舒适、环保为设计理念，远销欧美和东南亚市场。公司注重产品质量和环保标准，通过了ISO9001质量管理体系认证。<br><br>公司拥有专业的设计团队，每年推出春夏、秋冬两季新品，款式新颖，深受消费者喜爱。同时，公司积极履行社会责任，参与公益活动，为儿童健康成长贡献力量。",
            certificates: ["ISO9001质量管理体系", "Oeko-Tex Standard 100", "浙江省著名商标"]
        },
        "company2": {
            name: "湖州小森林童装设计工作室",
            logo: "../images/company/company-logo2.jpg",
            type: "设计企业",
            scale: "中型企业",
            cert: "GOTS认证",
            address: "浙江省湖州市织里镇时尚产业园C区12号",
            phone: "0572-87654321",
            email: "design@xiaosenlin.com",
            website: "www.xiaosenlinkids.com",
            description: "湖州小森林童装设计工作室成立于2012年，是一家专注于环保、可持续童装设计的创意工作室。工作室由资深童装设计师创立，秉承'自然、环保、舒适'的设计理念，每年推出春夏、秋冬四个系列的童装设计。<br><br>工作室使用有机棉、天然亚麻等环保面料，所有产品通过GOTS有机纺织品认证，确保产品从原料到生产全过程符合有机标准和社会责任要求。设计风格以自然、简约为主，融入森林、动物等自然元素，深受家长和孩子喜爱。",
            certificates: ["GOTS有机纺织品认证", "浙江省绿色设计示范企业"]
        },
        "company3": {
            name: "织里优质面料有限公司",
            logo: "../images/company/company-logo3.jpg",
            type: "原材料供应",
            scale: "大型企业",
            cert: "Oeko-Tex",
            address: "浙江省湖州市织里镇工业园区纺织路56号",
            phone: "0572-56781234",
            email: "info@zhilimaterial.com",
            website: "www.zhilimaterial.com",
            description: "织里优质面料有限公司成立于2000年，是织里镇最大的童装面料供应商之一。公司专注于各类高品质童装面料的研发与生产，包括棉、麻、丝、毛等天然材质，以及功能性面料。",
            certificates: ["Oeko-Tex Standard 100", "ISO9001质量管理体系"]
        },
        "company4": {
            name: "快乐童年服饰有限公司",
            logo: "../images/company/company-logo4.jpg",
            type: "生产企业",
            scale: "中型企业",
            cert: "ISO9001",
            address: "浙江省湖州市织里镇产业园A区23号",
            phone: "0572-98765432",
            email: "info@happykids.com",
            website: "www.happykids.com",
            description: "快乐童年服饰有限公司成立于2008年，是一家专注于婴幼儿服装的研发与生产企业。公司坚持使用天然有机面料，注重婴幼儿肌肤健康，产品以舒适、安全、环保为主要特点。<br><br>公司拥有专业的研发团队和现代化的生产线，严格按照国际标准进行生产和质量控制，确保每一件产品都符合婴幼儿穿着需求。",
            certificates: ["ISO9001质量管理体系", "婴幼儿服装安全认证"]
        },
        "company5": {
            name: "彩虹童装设计有限公司",
            logo: "../images/company/company-logo5.jpg",
            type: "设计企业",
            scale: "小型企业",
            cert: "GOTS认证",
            address: "浙江省湖州市织里镇创意园B栋301室",
            phone: "0572-65432198",
            email: "design@rainbowkids.com",
            website: "www.rainbowkids.com",
            description: "彩虹童装设计有限公司是一家致力于创新、时尚童装设计的专业机构，成立于2015年，主要专注于2-10岁儿童服装设计。团队由资深设计师组成，设计风格活泼多彩，注重童趣与实用性的结合。<br><br>公司提供从概念设计到样衣制作的全方位服务，为童装品牌和生产企业提供设计支持。",
            certificates: ["GOTS有机纺织品认证", "浙江省优秀设计企业"]
        },
        "company6": {
            name: "湖州星光童装贸易有限公司",
            logo: "../images/company/company-logo6.jpg",
            type: "销售渠道",
            scale: "大型企业",
            cert: "ISO9001",
            address: "浙江省湖州市织里镇商贸城A区108号",
            phone: "0572-87654321",
            email: "contact@starkids.com",
            website: "www.starkids.com",
            description: "湖州星光童装贸易有限公司成立于2010年，是织里镇规模最大的童装销售渠道商之一。公司拥有线上线下多个销售平台，年销售额超过5亿元。<br><br>公司与全国各地超过1000家零售商建立了稳定的合作关系，同时通过电商平台将织里镇优质童装产品销往全国各地，促进了当地童装产业的发展。",
            certificates: ["ISO9001质量管理体系", "AAA级信用企业"]
        },
        "company7": {
            name: "织里环保纺织品有限公司",
            logo: "../images/company/company-logo7.jpg",
            type: "原材料供应",
            scale: "中型企业",
            cert: "Oeko-Tex",
            address: "浙江省湖州市织里镇生态产业园C区15号",
            phone: "0572-76543210",
            email: "contact@ecotextile.com",
            website: "www.zhiliecotex.com",
            description: "织里环保纺织品有限公司成立于2012年，专注于环保童装面料的研发与生产。公司使用有机棉、再生纤维及可降解材料等环保原料，产品符合国际环保标准。<br><br>公司引进了先进的生产设备和检测技术，确保产品质量的同时减少生产过程对环境的影响，是织里镇绿色制造的代表企业之一。",
            certificates: ["Oeko-Tex Standard 100", "全球回收标准认证"]
        },
        "company8": {
            name: "童梦服饰有限公司",
            logo: "../images/company/company-logo8.jpg",
            type: "生产企业",
            scale: "小型企业",
            cert: "ISO14001",
            address: "浙江省湖州市织里镇纺织工业园D区45号",
            phone: "0572-23456789",
            email: "info@kidsdream.com",
            website: "www.kidsdream.com",
            description: "童梦服饰有限公司成立于2014年，是一家专注于童装定制服务的企业。公司主要为幼儿园、学校提供校服及特殊场合儿童服装的设计与生产。<br><br>公司采用柔性生产方式，能够根据客户需求提供小批量、个性化的定制服务，同时保证快速交付和优质品质，赢得了众多教育机构的信赖。",
            certificates: ["ISO14001环境管理体系", "校服生产企业资质"]
        },
        "company9": {
            name: "浙江童装印花有限公司",
            logo: "../images/company/company-logo9.jpg",
            type: "配套服务",
            scale: "中型企业",
            cert: "ISO9001",
            address: "浙江省湖州市织里镇科技园B区67号",
            phone: "0572-34567890",
            email: "print@kidsfashion.com",
            website: "www.kidsprint.com",
            description: "浙江童装印花有限公司成立于2009年，是一家专业提供童装印花、刺绣、烫画等工艺服务的企业。公司拥有先进的数码印花设备和工艺技术，可以满足各类面料的印花需求。<br><br>公司引进了环保型染料和先进工艺，确保印花品质的同时减少对环境的污染，为织里童装产业链提供重要的配套服务。",
            certificates: ["ISO9001质量管理体系", "环保印染资质"]
        },
        "company10": {
            name: "织里创意童装设计工作室",
            logo: "../images/company/company-logo10.jpg",
            type: "设计企业",
            scale: "小型企业",
            cert: "无认证",
            address: "浙江省湖州市织里镇创业园A栋505室",
            phone: "0572-45678901",
            email: "creative@kidswear.com",
            website: "www.creativekids.com",
            description: "织里创意童装设计工作室成立于2018年，是由一群年轻设计师组成的创意团队。工作室专注于创新童装设计，提供设计咨询和样衣开发服务。<br><br>团队成员多数毕业于知名服装院校，设计风格新颖独特，注重将艺术元素与儿童服装相结合，为织里童装产业注入新的创意活力。",
            certificates: ["浙江省新锐设计团队"]
        },
        "company11": {
            name: "湖州小淘气童装有限公司",
            logo: "../images/company/company-logo11.jpg",
            type: "生产企业",
            scale: "大型企业",
            cert: "Oeko-Tex",
            address: "浙江省湖州市织里镇工业园区童装大道18号",
            phone: "0572-56789012",
            email: "info@naughtykids.com",
            website: "www.naughtykids.com",
            description: "湖州小淘气童装有限公司成立于2007年，专注于婴幼儿和学龄前儿童服装的研发与生产。公司产品以舒适、安全、活泼为设计理念，注重面料选择和工艺细节。<br><br>公司拥有完整的产业链，从面料选择到成衣生产都有严格的质量控制流程，产品远销国内外市场，深受消费者喜爱。",
            certificates: ["Oeko-Tex Standard 100", "ISO9001质量管理体系", "中国优质童装品牌"]
        },
        "company12": {
            name: "织里精工童装辅料有限公司",
            logo: "../images/company/company-logo12.jpg",
            type: "原材料供应",
            scale: "中型企业",
            cert: "ISO9001",
            address: "浙江省湖州市织里镇辅料产业园A区28号",
            phone: "0572-67890123",
            email: "contact@kidsfittings.com",
            website: "www.kidsfittings.com",
            description: "织里精工童装辅料有限公司成立于2011年，专业生产童装纽扣、拉链、标牌等辅料。公司产品种类丰富，质量可靠，价格合理，是织里童装产业链中重要的辅料供应商。<br><br>公司注重产品安全性，所有产品均符合国家安全标准，不含有害物质，适合儿童服装使用。同时提供个性化定制服务，满足不同客户的需求。",
            certificates: ["ISO9001质量管理体系", "童装辅料安全认证"]
        },
        "company13": {
            name: "童爱电商平台有限公司",
            logo: "../images/company/company-logo13.jpg",
            type: "销售渠道",
            scale: "大型企业",
            cert: "无认证",
            address: "浙江省湖州市织里镇电子商务产业园1号楼",
            phone: "0572-78901234",
            email: "service@kidslove.com",
            website: "www.kidslove.com",
            description: "童爱电商平台有限公司成立于2015年，是一家专注于童装电子商务平台的运营企业。公司为织里童装企业提供线上销售渠道和数字化营销服务，帮助传统企业实现线上转型。<br><br>平台拥有超过500万注册用户，日均访问量超过100万，是国内知名的童装垂直电商平台，为织里童装产业的发展做出了重要贡献。",
            certificates: ["电子商务示范企业", "浙江省优秀电商平台"]
        },
        "company14": {
            name: "湖州童装包装印刷有限公司",
            logo: "../images/company/company-logo14.jpg",
            type: "配套服务",
            scale: "小型企业",
            cert: "ISO14001",
            address: "浙江省湖州市织里镇包装工业园C区16号",
            phone: "0572-89012345",
            email: "info@kidspackaging.com",
            website: "www.kidspackaging.com",
            description: "湖州童装包装印刷有限公司成立于2013年，专业提供童装包装设计与生产服务。公司坚持使用环保材料，提供吊牌、包装盒、手提袋等一站式服务。<br><br>公司拥有先进的印刷设备和专业的设计团队，可以根据客户需求提供个性化的包装解决方案，帮助品牌提升产品形象和附加值。",
            certificates: ["ISO14001环境管理体系", "环保印刷认证"]
        },
        "company15": {
            name: "浙江童装研发中心",
            logo: "../images/company/company-logo15.jpg",
            type: "设计企业",
            scale: "大型企业",
            cert: "GOTS认证",
            address: "浙江省湖州市织里镇科技园A区1号楼",
            phone: "0572-90123456",
            email: "research@kidswearlab.com",
            website: "www.kidswearlab.com",
            description: "浙江童装研发中心成立于2010年，是一家专业从事童装研发与设计的服务机构。中心汇聚了国内外优秀设计师和技术专家，提供流行趋势分析、设计开发、技术咨询等专业服务。<br><br>中心定期发布童装流行趋势报告，组织行业交流活动，推动织里童装产业的创新发展和转型升级，是织里童装产业的智库和创新引擎。",
            certificates: ["GOTS有机纺织品认证", "国家级工业设计中心", "浙江省重点研发机构"]
        },
        "company16": {
            name: "织里童装物流配送有限公司",
            logo: "../images/company/company-logo16.jpg",
            type: "配套服务",
            scale: "中型企业",
            cert: "ISO9001",
            address: "浙江省湖州市织里镇物流园区B区8号",
            phone: "0572-01234567",
            email: "service@kidslogistics.com",
            website: "www.kidslogistics.com",
            description: "织里童装物流配送有限公司成立于2014年，是一家专业为织里童装产业提供物流配送服务的企业。公司业务覆盖全国各地，提供仓储、配送一体化解决方案。<br><br>公司拥有现代化的物流仓储中心和配送车队，采用信息化管理系统，确保高效、准确的物流配送服务，助力织里童装产品快速送达全国各地市场。",
            certificates: ["ISO9001质量管理体系", "物流行业A级资质", "浙江省优秀物流企业"]
        }
    };

    // 初始化企业详情弹窗
    function initEnterpriseDetailModal() {
        // 获取所有企业卡片
        const enterpriseCards = document.querySelectorAll('.enterprise-card');
        const modal = document.getElementById('enterprise-modal');
        const modalClose = document.querySelector('.modal-close');

        // 检查是否存在产品元素，如果存在则隐藏
        const modalProducts = document.getElementById('modal-products');
        if (modalProducts) {
            modalProducts.style.display = 'none';
        }

        // 为每个企业卡片的"查看详情"按钮添加点击事件
        enterpriseCards.forEach((card, index) => {
            const detailLink = card.querySelector('.enterprise-actions .btn-outline');
            const companyId = `company${index + 1}`;

            if (detailLink) {
                // 移除原有的href属性
                detailLink.removeAttribute('href');

                // 添加点击事件，显示弹窗
                detailLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    console.log('点击了查看详情按钮:', companyId);
                    showEnterpriseDetail(companyId);
                });
            }
        });

        // 关闭弹窗事件
        modalClose.addEventListener('click', function () {
            modal.style.display = 'none';
        });

        // 点击弹窗外部关闭弹窗
        window.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        console.log("企业详情弹窗初始化完成，共处理了", enterpriseCards.length, "家企业");
    }

    // 显示企业详情
    function showEnterpriseDetail(companyId) {
        console.log('正在获取企业详情:', companyId);

        const enterprise = enterpriseData[companyId];
        if (!enterprise) {
            console.error('未找到企业数据:', companyId);
            // 显示错误提示
            alert(`抱歉，未找到企业 ${companyId} 的详细信息。`);
            return;
        }

        console.log('已找到企业数据:', enterprise.name);

        try {
            // 更新弹窗内容
            document.getElementById('modal-logo').src = enterprise.logo;
            document.getElementById('modal-logo').alt = enterprise.name;
            document.getElementById('modal-name').textContent = enterprise.name;

            // 更新企业标签
            const tagsHtml = `
            <span class="tag type">${enterprise.type}</span>
            <span class="tag scale">${enterprise.scale}</span>
            <span class="tag cert">${enterprise.cert}</span>
        `;
            document.getElementById('modal-tags').innerHTML = tagsHtml;

            // 更新联系信息
            document.getElementById('modal-address').textContent = enterprise.address;
            document.getElementById('modal-phone').textContent = enterprise.phone;
            document.getElementById('modal-email').textContent = enterprise.email;
            document.getElementById('modal-website').textContent = enterprise.website;

            // 更新企业介绍
            document.getElementById('modal-description').innerHTML = enterprise.description;

            // 更新认证信息
            let certificatesHtml = '';
            if (enterprise.certificates && enterprise.certificates.length > 0) {
                enterprise.certificates.forEach(cert => {
                    certificatesHtml += `
                <div class="certificate-item">
                    <i class="bi bi-check-circle-fill"></i>
                    <span>${cert}</span>
                </div>
            `;
                });
            } else {
                certificatesHtml = '<p>暂无认证信息</p>';
            }
            document.getElementById('modal-certificates').innerHTML = certificatesHtml;

            // 显示弹窗
            document.getElementById('enterprise-modal').style.display = 'block';
            console.log('企业详情弹窗已显示:', enterprise.name);
        } catch (error) {
            console.error('显示企业详情时出错:', error);
            alert('显示企业详情时出现错误，请稍后再试。');
        }
    }

    // 添加调试按钮
    const debugBtn = document.createElement('button');
    debugBtn.textContent = "显示调试信息";
    debugBtn.style.position = "fixed";
    debugBtn.style.bottom = "20px";
    debugBtn.style.right = "20px";
    debugBtn.style.zIndex = "1000";
    debugBtn.style.padding = "10px";
    debugBtn.style.backgroundColor = "#4a6bdf";
    debugBtn.style.color = "white";
    debugBtn.style.border = "none";
    debugBtn.style.borderRadius = "4px";
    debugBtn.style.cursor = "pointer";

    debugBtn.addEventListener('click', function () {
        const debugInfo = document.getElementById('debug-info');
        const debugContent = document.getElementById('debug-content');

        // 收集调试信息
        let info = "";
        info += "<p><strong>当前页面:</strong> " + currentPage + "</p>";

        // 企业卡片信息
        const enterpriseCards = document.querySelectorAll('.enterprise-card');
        let pageInfo = {};
        enterpriseCards.forEach(card => {
            const pageNum = card.getAttribute('data-page');
            const display = card.style.display;
            if (!pageInfo[pageNum]) {
                pageInfo[pageNum] = { total: 0, visible: 0 };
            }
            pageInfo[pageNum].total++;
            if (display === 'block') {
                pageInfo[pageNum].visible++;
            }
        });

        info += "<p><strong>各页面卡片数量:</strong></p><ul>";
        for (const page in pageInfo) {
            info += `<li>第${page}页: 共${pageInfo[page].total}张卡片, 可见${pageInfo[page].visible}张</li>`;
        }
        info += "</ul>";

        // 显示调试信息
        debugContent.innerHTML = info;
        debugInfo.style.display = 'block';
    });

    document.body.appendChild(debugBtn);
}); 
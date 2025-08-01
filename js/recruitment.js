// 人才招聘页面的交互脚本
document.addEventListener('DOMContentLoaded', function () {
    // 初始化分页功能
    initJobPagination();

    // 职位搜索表单提交
    const jobSearchForm = document.getElementById('job-search');
    if (jobSearchForm) {
        jobSearchForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 获取表单数据
            const keyword = document.getElementById('job-keyword').value;
            const category = document.getElementById('job-category').value;
            const experience = document.getElementById('job-experience').value;
            const education = document.getElementById('job-education').value;
            const salary = document.getElementById('job-salary').value;

            // 输出搜索条件到控制台
            console.log('搜索职位:', {
                keyword,
                category,
                experience,
                education,
                salary
            });

            // 更新筛选标签
            updateFilterTags({
                keyword,
                category,
                experience,
                education,
                salary
            });

            // 模拟搜索结果
            simulateSearchResults();
        });
    }

    // 清除全部筛选条件
    const clearAllBtn = document.querySelector('.clear-all');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // 重置表单
            if (jobSearchForm) {
                jobSearchForm.reset();
            }

            // 清空标签
            const tagList = document.querySelector('.tag-list');
            if (tagList) {
                tagList.innerHTML = '';
            }
        });
    }

    // 排序选项切换
    const sortOptions = document.querySelectorAll('.sort-options a');
    sortOptions.forEach(option => {
        option.addEventListener('click', function (e) {
            e.preventDefault();

            // 移除所有活动状态
            sortOptions.forEach(opt => opt.classList.remove('active'));

            // 添加当前选项的活动状态
            this.classList.add('active');

            // 在这里可以添加实际的排序逻辑
            console.log('排序方式:', this.textContent);

            // 模拟排序结果
            simulateSearchResults();
        });
    });

    // 职位卡片交互效果
    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach(card => {
        // 添加收藏功能
        const collectBtn = card.querySelector('.btn-outline');
        if (collectBtn) {
            collectBtn.addEventListener('click', function (e) {
                e.preventDefault();

                // 切换收藏状态
                const icon = this.querySelector('i');
                if (icon.classList.contains('bi-star')) {
                    icon.classList.replace('bi-star', 'bi-star-fill');
                    this.textContent = ' 已收藏';
                    this.prepend(icon);
                } else {
                    icon.classList.replace('bi-star-fill', 'bi-star');
                    this.textContent = ' 收藏';
                    this.prepend(icon);
                }
            });
        }

        // 添加申请功能
        const applyBtn = card.querySelector('.btn-primary');
        if (applyBtn) {
            applyBtn.addEventListener('click', function (e) {
                e.preventDefault();

                // 在这里可以添加实际的申请逻辑
                alert('申请已提交！');
            });
        }
    });

    // 更新筛选标签
    function updateFilterTags(filters) {
        const tagList = document.querySelector('.tag-list');
        if (!tagList) return;

        // 清空现有标签
        tagList.innerHTML = '';

        // 添加新标签
        const categoryLabels = {
            'design': '设计类',
            'production': '生产类',
            'marketing': '营销类',
            'management': '管理类',
            'technical': '技术类'
        };

        const experienceLabels = {
            'fresh': '应届生',
            '1-3': '1-3年',
            '3-5': '3-5年',
            '5-10': '5-10年',
            '10+': '10年以上'
        };

        const educationLabels = {
            'high-school': '高中及以下',
            'college': '大专',
            'bachelor': '本科',
            'master': '硕士',
            'doctor': '博士'
        };

        const salaryLabels = {
            '0-5k': '5K以下',
            '5-10k': '5K-10K',
            '10-15k': '10K-15K',
            '15-20k': '15K-20K',
            '20k+': '20K以上'
        };

        if (filters.keyword) {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `关键词: ${filters.keyword} <i class="bi bi-x"></i>`;
            tag.querySelector('i').addEventListener('click', function () {
                document.getElementById('job-keyword').value = '';
                tag.remove();
            });
            tagList.appendChild(tag);
        }

        if (filters.category) {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `职位类别: ${categoryLabels[filters.category]} <i class="bi bi-x"></i>`;
            tag.querySelector('i').addEventListener('click', function () {
                document.getElementById('job-category').value = '';
                tag.remove();
            });
            tagList.appendChild(tag);
        }

        if (filters.experience) {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `工作经验: ${experienceLabels[filters.experience]} <i class="bi bi-x"></i>`;
            tag.querySelector('i').addEventListener('click', function () {
                document.getElementById('job-experience').value = '';
                tag.remove();
            });
            tagList.appendChild(tag);
        }

        if (filters.education) {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `学历要求: ${educationLabels[filters.education]} <i class="bi bi-x"></i>`;
            tag.querySelector('i').addEventListener('click', function () {
                document.getElementById('job-education').value = '';
                tag.remove();
            });
            tagList.appendChild(tag);
        }

        if (filters.salary) {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `薪资范围: ${salaryLabels[filters.salary]} <i class="bi bi-x"></i>`;
            tag.querySelector('i').addEventListener('click', function () {
                document.getElementById('job-salary').value = '';
                tag.remove();
            });
            tagList.appendChild(tag);
        }
    }

    // 初始化岗位分页功能
    function initJobPagination() {
        // 获取所有职位卡片
        const jobCards = document.querySelectorAll('#job-list-section .job-card');
        // 每页显示的职位数量
        const pageSize = 3;
        // 计算总页数
        const totalPages = Math.ceil(jobCards.length / pageSize);

        // 当前页码
        let currentPage = 1;

        // 分页容器
        const pagination = document.getElementById('job-pagination');
        if (!pagination) return;

        // 创建分页HTML
        createPaginationUI();

        // 显示第一页
        showPage(1);

        // 为分页按钮添加事件监听
        addPaginationListeners();

        // 创建分页UI
        function createPaginationUI() {
            let html = '';

            // 上一页按钮
            html += `<a href="#" class="prev disabled" data-page="prev"><i class="bi bi-chevron-left"></i></a>`;

            // 页码按钮
            for (let i = 1; i <= totalPages; i++) {
                html += `<a href="#" data-page="${i}" ${i === 1 ? 'class="active"' : ''}>${i}</a>`;
            }

            // 如果页数过多，添加省略号
            if (totalPages > 7) {
                html = html.replace(/<a href="#" data-page="4">4<\/a><a href="#" data-page="5">5<\/a><a href="#" data-page="6">6<\/a><a href="#" data-page="7">7<\/a>/, '<a href="#" data-page="4">4</a><span>...</span><a href="#" data-page="' + totalPages + '">' + totalPages + '</a>');
            }

            // 下一页按钮
            html += `<a href="#" class="next${totalPages <= 1 ? ' disabled' : ''}" data-page="next"><i class="bi bi-chevron-right"></i></a>`;

            pagination.innerHTML = html;
        }

        // 显示指定页面的职位
        function showPage(pageNum) {
            console.log('显示第', pageNum, '页的职位，每页', pageSize, '个');

            // 确保页码在有效范围内
            if (pageNum < 1) pageNum = 1;
            if (pageNum > totalPages) pageNum = totalPages;

            // 当前页码
            currentPage = pageNum;

            // 计算当前页的起始和结束索引
            const startIndex = (pageNum - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, jobCards.length);

            // 隐藏所有职位卡片
            jobCards.forEach(card => {
                card.style.display = 'none';
            });

            // 显示当前页的职位卡片
            for (let i = startIndex; i < endIndex; i++) {
                if (jobCards[i]) {
                    jobCards[i].style.display = 'block';
                }
            }

            // 更新分页按钮状态
            updatePaginationStatus();
        }

        // 更新分页按钮状态
        function updatePaginationStatus() {
            // 更新页码按钮状态
            const pageButtons = pagination.querySelectorAll('a[data-page]');
            pageButtons.forEach(button => {
                // 移除所有active类
                button.classList.remove('active');

                // 为当前页添加active类
                if (button.getAttribute('data-page') == currentPage) {
                    button.classList.add('active');
                }
            });

            // 更新上一页按钮状态
            const prevButton = pagination.querySelector('.prev');
            if (currentPage <= 1) {
                prevButton.classList.add('disabled');
            } else {
                prevButton.classList.remove('disabled');
            }

            // 更新下一页按钮状态
            const nextButton = pagination.querySelector('.next');
            if (currentPage >= totalPages) {
                nextButton.classList.add('disabled');
            } else {
                nextButton.classList.remove('disabled');
            }
        }

        // 为分页按钮添加事件监听
        function addPaginationListeners() {
            const pageButtons = pagination.querySelectorAll('a');
            pageButtons.forEach(button => {
                button.addEventListener('click', function (e) {
                    e.preventDefault();

                    const pageAction = this.getAttribute('data-page');

                    // 处理页码切换
                    if (pageAction === 'prev' && currentPage > 1) {
                        showPage(currentPage - 1);
                    } else if (pageAction === 'next' && currentPage < totalPages) {
                        showPage(currentPage + 1);
                    } else if (!isNaN(parseInt(pageAction))) {
                        showPage(parseInt(pageAction));
                    }
                });
            });
        }
    }

    // 模拟搜索结果
    function simulateSearchResults() {
        // 在实际应用中，这里应该是从服务器获取数据
        // 这里只是模拟搜索结果的变化
        const jobCards = document.querySelectorAll('.job-card');

        // 添加加载效果
        jobCards.forEach(card => {
            card.style.opacity = '0.5';
        });

        // 模拟加载延迟
        setTimeout(() => {
            jobCards.forEach(card => {
                card.style.opacity = '1';
            });

            // 搜索后重新初始化分页
            initJobPagination();
        }, 500);
    }
}); 
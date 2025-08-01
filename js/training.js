// 人才培育页面的交互脚本
// 课程分页功能
function initCoursePagination() {
    const courseCards = Array.from(document.querySelectorAll('#course-list .course-card'));
    const pageSize = 6;
    // 1. 给每个课程卡片加data-page属性
    courseCards.forEach((card, idx) => {
        const pageNum = Math.floor(idx / pageSize) + 1;
        card.setAttribute('data-page', pageNum);
        card.style.display = 'none';
    });
    // 2. 生成分页按钮
    const totalPages = Math.ceil(courseCards.length / pageSize);
    const paginationContainer = document.getElementById('course-pagination');
    let html = `<a href='#' class='prev disabled' data-page='prev'><i class='bi bi-chevron-left'></i></a>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<a href='#' data-page='${i}'${i === 1 ? ' class="active"' : ''}>${i}</a>`;
    }
    html += `<a href='#' class='next${totalPages === 1 ? ' disabled' : ''}' data-page='next'><i class='bi bi-chevron-right'></i></a>`;
    paginationContainer.innerHTML = html;
    // 3. 分页按钮事件
    let currentPage = 1;
    function showPage(pageNum) {
        courseCards.forEach(card => {
            card.style.display = card.getAttribute('data-page') == pageNum ? '' : 'none';
        });
        // 按钮高亮
        Array.from(paginationContainer.querySelectorAll('a')).forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('data-page') == pageNum) a.classList.add('active');
        });
        // 上一页/下一页禁用
        const prev = paginationContainer.querySelector('.prev');
        const next = paginationContainer.querySelector('.next');
        if (pageNum <= 1) prev.classList.add('disabled'); else prev.classList.remove('disabled');
        if (pageNum >= totalPages) next.classList.add('disabled'); else next.classList.remove('disabled');
        currentPage = pageNum;
    }
    showPage(1);
    paginationContainer.querySelectorAll('a').forEach(a => {
        a.onclick = function(e) {
            e.preventDefault();
            const pageAttr = this.getAttribute('data-page');
            if (pageAttr === 'prev' && currentPage > 1) showPage(currentPage - 1);
            else if (pageAttr === 'next' && currentPage < totalPages) showPage(currentPage + 1);
            else if (!isNaN(parseInt(pageAttr))) showPage(parseInt(pageAttr));
        };
    });
}

function filterAndPaginateCourses() {
    // 获取所有筛选条件
    const selectedCategory = document.querySelector('.filter-group:nth-child(1) a.active').textContent.trim();
    const selectedLevel = document.querySelector('.filter-group:nth-child(2) a.active').textContent.trim();
    const selectedType = document.querySelector('.filter-group:nth-child(3) a.active').textContent.trim();
    // 获取所有课程卡片
    const allCards = Array.from(document.querySelectorAll('#course-list .course-card'));
    // 过滤
    const filtered = allCards.filter(card => {
        const matchCategory = (selectedCategory === '全部' || card.getAttribute('data-category') === selectedCategory);
        const matchLevel = (selectedLevel === '全部' || card.getAttribute('data-level') === selectedLevel);
        const matchType = (selectedType === '全部' || card.getAttribute('data-type') === selectedType);
        return matchCategory && matchLevel && matchType;
    });
    // 重新分页
    const pageSize = 6;
    filtered.forEach((card, idx) => {
        const pageNum = Math.floor(idx / pageSize) + 1;
        card.setAttribute('data-page', pageNum);
    });
    // 隐藏所有卡片
    allCards.forEach(card => card.style.display = 'none');
    // 生成分页按钮
    const paginationContainer = document.getElementById('course-pagination');
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    let html = `<a href='#' class='prev disabled' data-page='prev'><i class='bi bi-chevron-left'></i></a>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<a href='#' data-page='${i}'${i === 1 ? ' class="active"' : ''}>${i}</a>`;
    }
    html += `<a href='#' class='next${totalPages === 1 ? ' disabled' : ''}' data-page='next'><i class='bi bi-chevron-right'></i></a>`;
    paginationContainer.innerHTML = html;
    // 分页显示
    let currentPage = 1;
    function showPage(pageNum) {
        filtered.forEach(card => {
            card.style.display = card.getAttribute('data-page') == pageNum ? '' : 'none';
        });
        Array.from(paginationContainer.querySelectorAll('a')).forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('data-page') == pageNum) a.classList.add('active');
        });
        const prev = paginationContainer.querySelector('.prev');
        const next = paginationContainer.querySelector('.next');
        if (pageNum <= 1) prev.classList.add('disabled'); else prev.classList.remove('disabled');
        if (pageNum >= totalPages) next.classList.add('disabled'); else next.classList.remove('disabled');
        currentPage = pageNum;
    }
    showPage(1);
    paginationContainer.querySelectorAll('a').forEach(a => {
        a.onclick = function(e) {
            e.preventDefault();
            const pageAttr = this.getAttribute('data-page');
            if (pageAttr === 'prev' && currentPage > 1) showPage(currentPage - 1);
            else if (pageAttr === 'next' && currentPage < totalPages) showPage(currentPage + 1);
            else if (!isNaN(parseInt(pageAttr))) showPage(parseInt(pageAttr));
        };
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // 标签页切换功能
    const tabItems = document.querySelectorAll('.training-nav li');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有标签页的活动状态
            tabItems.forEach(tab => tab.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加当前标签页的活动状态
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // 课程筛选功能
    const filterLinks = document.querySelectorAll('.filter-group a');
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const filterGroup = this.closest('.filter-group');
            const groupLinks = filterGroup.querySelectorAll('a');
            groupLinks.forEach(groupLink => groupLink.classList.remove('active'));
            this.classList.add('active');
            filterAndPaginateCourses();
        });
    });
    
    // 课程卡片交互效果
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        // 添加悬停效果
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        // 添加报名功能
        const enrollBtn = card.querySelector('.btn-primary');
        if (enrollBtn) {
            enrollBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 获取课程标题
                const courseTitle = card.querySelector('h3').textContent;
                
                // 在这里可以添加实际的报名逻辑
                alert(`您已成功报名"${courseTitle}"课程！`);
            });
        }
    });
    
    // 初始化课程分页
    initCoursePagination();
    
    // 初始化课程筛选+分页
    filterAndPaginateCourses();
    
    // 模拟筛选结果
    function simulateFilterResults() {
        // 在实际应用中，这里应该是从服务器获取数据
        // 这里只是模拟筛选结果的变化
        const courseCards = document.querySelectorAll('.course-card');
        
        // 添加加载效果
        courseCards.forEach(card => {
            card.style.opacity = '0.5';
        });
        
        // 模拟加载延迟
        setTimeout(() => {
            courseCards.forEach(card => {
                card.style.opacity = '1';
            });
        }, 500);
    }
}); 
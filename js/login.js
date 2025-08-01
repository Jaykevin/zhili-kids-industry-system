document.addEventListener('DOMContentLoaded', function() {
    // 密码显示/隐藏功能
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            // 切换密码显示类型
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // 切换图标
            this.classList.toggle('bi-eye');
            this.classList.toggle('bi-eye-slash');
        });
    }
    
    // 登录表单提交
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // 在这里可以添加表单验证逻辑
            if (!username) {
                showError('请输入用户名或手机号');
                return;
            }
            
            if (!password) {
                showError('请输入密码');
                return;
            }
            
            // 模拟登录请求
            simulateLogin(username, password, remember);
        });
    }
    
    // 社交登录按钮
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList.contains('wechat') ? '微信' : '支付宝';
            alert(`正在跳转到${platform}授权页面...`);
        });
    });
    
    // 显示错误信息
    function showError(message) {
        // 检查是否已存在错误消息元素
        let errorElement = document.querySelector('.error-message');
        
        if (!errorElement) {
            // 创建错误消息元素
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            
            // 添加样式
            errorElement.style.color = '#e53e3e';
            errorElement.style.fontSize = '14px';
            errorElement.style.marginTop = '10px';
            errorElement.style.padding = '10px';
            errorElement.style.backgroundColor = '#fff5f5';
            errorElement.style.borderRadius = '4px';
            errorElement.style.borderLeft = '3px solid #e53e3e';
            
            // 插入到表单顶部
            loginForm.insertBefore(errorElement, loginForm.firstChild);
        }
        
        // 设置错误消息
        errorElement.textContent = message;
        
        // 5秒后自动隐藏
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
    
    // 模拟登录请求
    function simulateLogin(username, password, remember) {
        // 显示加载状态
        const loginButton = document.querySelector('.btn-login-submit');
        const originalText = loginButton.textContent;
        loginButton.textContent = '登录中...';
        loginButton.disabled = true;
        
        // 模拟网络请求延迟
        setTimeout(() => {
            // 在实际应用中，这里应该发送请求到服务器进行身份验证
            
            // 模拟登录成功
            if (username === 'admin' && password === 'admin123') {
                // 登录成功，跳转到首页
                window.location.href = '../index.html';
            } else {
                // 登录失败，显示错误信息
                showError('用户名或密码错误，请重试');
                
                // 恢复按钮状态
                loginButton.textContent = originalText;
                loginButton.disabled = false;
            }
        }, 1500);
    }
}); 
document.addEventListener('DOMContentLoaded', function() {
    // 步骤切换功能
    const steps = document.querySelectorAll('.register-steps .step');
    const formSteps = document.querySelectorAll('.form-step');
    const btnNext = document.querySelector('.btn-next');
    const btnPrev = document.querySelector('.btn-prev');
    const btnSubmit = document.querySelector('.btn-submit');
    
    let currentStep = 0;
    
    // 下一步按钮点击事件
    if (btnNext) {
        btnNext.addEventListener('click', function() {
            // 表单验证
            if (!validateStep1()) {
                return;
            }
            
            // 切换到下一步
            currentStep++;
            updateSteps();
            
            // 如果选择了企业用户，显示企业信息表单
            const userType = document.querySelector('input[name="user-type"]:checked').value;
            const enterpriseInfo = document.querySelector('.enterprise-info');
            if (userType === 'enterprise' && enterpriseInfo) {
                enterpriseInfo.style.display = 'block';
            } else if (enterpriseInfo) {
                enterpriseInfo.style.display = 'none';
            }
        });
    }
    
    // 上一步按钮点击事件
    if (btnPrev) {
        btnPrev.addEventListener('click', function() {
            currentStep--;
            updateSteps();
        });
    }
    
    // 提交按钮点击事件
    if (btnSubmit) {
        btnSubmit.addEventListener('click', function() {
            // 表单验证
            if (!validateStep2()) {
                return;
            }
            
            // 模拟表单提交
            simulateSubmit();
        });
    }
    
    // 更新步骤显示
    function updateSteps() {
        // 更新步骤指示器
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else if (index < currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // 更新表单步骤
        formSteps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // 步骤1表单验证
    function validateStep1() {
        const username = document.getElementById('username').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // 用户名验证
        if (!username) {
            showError('请输入用户名');
            return false;
        } else if (username.length < 4 || username.length > 16) {
            showError('用户名长度应为4-16个字符');
            return false;
        }
        
        // 手机号验证
        if (!phone) {
            showError('请输入手机号码');
            return false;
        } else if (!/^1[3-9]\d{9}$/.test(phone)) {
            showError('请输入正确的手机号码');
            return false;
        }
        
        // 密码验证
        if (!password) {
            showError('请输入密码');
            return false;
        } else if (password.length < 8 || password.length > 20) {
            showError('密码长度应为8-20个字符');
            return false;
        }
        
        // 确认密码验证
        if (!confirmPassword) {
            showError('请确认密码');
            return false;
        } else if (password !== confirmPassword) {
            showError('两次输入的密码不一致');
            return false;
        }
        
        return true;
    }
    
    // 步骤2表单验证
    function validateStep2() {
        const verificationCode = document.getElementById('verification-code').value;
        const agreeTerms = document.getElementById('agree-terms').checked;
        const userType = document.querySelector('input[name="user-type"]:checked').value;
        
        // 验证码验证
        if (!verificationCode) {
            showError('请输入验证码');
            return false;
        } else if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
            showError('请输入6位数字验证码');
            return false;
        }
        
        // 企业用户额外验证
        if (userType === 'enterprise') {
            const enterpriseName = document.getElementById('enterprise-name').value;
            const enterpriseLicense = document.getElementById('enterprise-license').value;
            const licenseUpload = document.getElementById('enterprise-license-upload').files.length;
            
            if (!enterpriseName) {
                showError('请输入企业名称');
                return false;
            }
            
            if (!enterpriseLicense) {
                showError('请输入营业执照号码');
                return false;
            }
            
            if (licenseUpload === 0) {
                showError('请上传营业执照');
                return false;
            }
        }
        
        // 协议同意验证
        if (!agreeTerms) {
            showError('请阅读并同意用户协议和隐私政策');
            return false;
        }
        
        return true;
    }
    
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
            
            // 插入到当前活动表单步骤的顶部
            const activeStep = document.querySelector('.form-step.active');
            if (activeStep) {
                activeStep.insertBefore(errorElement, activeStep.firstChild);
            }
        }
        
        // 设置错误消息
        errorElement.textContent = message;
        
        // 5秒后自动隐藏
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
    
    // 模拟表单提交
    function simulateSubmit() {
        // 显示加载状态
        btnSubmit.textContent = '提交中...';
        btnSubmit.disabled = true;
        
        // 模拟网络请求延迟
        setTimeout(() => {
            // 切换到成功步骤
            currentStep++;
            updateSteps();
            
            // 恢复按钮状态
            btnSubmit.textContent = '提交注册';
            btnSubmit.disabled = false;
        }, 1500);
    }
    
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
    
    // 获取验证码按钮功能
    const btnGetCode = document.querySelector('.btn-get-code');
    if (btnGetCode) {
        btnGetCode.addEventListener('click', function() {
            const phone = document.getElementById('phone').value;
            
            // 验证手机号
            if (!phone) {
                showError('请输入手机号码');
                return;
            } else if (!/^1[3-9]\d{9}$/.test(phone)) {
                showError('请输入正确的手机号码');
                return;
            }
            
            // 禁用按钮并开始倒计时
            let countdown = 60;
            this.disabled = true;
            this.textContent = `${countdown}秒后重新获取`;
            
            const timer = setInterval(() => {
                countdown--;
                this.textContent = `${countdown}秒后重新获取`;
                
                if (countdown <= 0) {
                    clearInterval(timer);
                    this.disabled = false;
                    this.textContent = '获取验证码';
                }
            }, 1000);
            
            // 模拟发送验证码
            console.log('发送验证码到手机号:', phone);
        });
    }
    
    // 文件上传功能
    const fileUpload = document.getElementById('enterprise-license-upload');
    const fileName = document.querySelector('.file-name');
    
    if (fileUpload && fileName) {
        fileUpload.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileName.textContent = this.files[0].name;
            } else {
                fileName.textContent = '';
            }
        });
    }
    
    // 用户类型切换
    const userTypeRadios = document.querySelectorAll('input[name="user-type"]');
    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // 在步骤1中预览企业信息表单的显示/隐藏状态
            if (currentStep === 0) {
                const enterpriseInfo = document.querySelector('.enterprise-info');
                if (!enterpriseInfo) return;
                
                if (this.value === 'enterprise') {
                    // 创建预览提示
                    let previewTip = document.querySelector('.enterprise-preview-tip');
                    if (!previewTip) {
                        previewTip = document.createElement('div');
                        previewTip.className = 'enterprise-preview-tip';
                        previewTip.style.marginTop = '15px';
                        previewTip.style.padding = '10px';
                        previewTip.style.backgroundColor = '#ebf8ff';
                        previewTip.style.borderRadius = '4px';
                        previewTip.style.fontSize = '14px';
                        previewTip.style.color = '#2b6cb0';
                        previewTip.innerHTML = '<i class="bi bi-info-circle"></i> 选择企业用户后，下一步将需要填写企业相关信息';
                        
                        const radioGroup = document.querySelector('.radio-group');
                        radioGroup.parentNode.insertBefore(previewTip, radioGroup.nextSibling);
                    }
                } else {
                    // 移除预览提示
                    const previewTip = document.querySelector('.enterprise-preview-tip');
                    if (previewTip) {
                        previewTip.remove();
                    }
                }
            }
        });
    });
}); 
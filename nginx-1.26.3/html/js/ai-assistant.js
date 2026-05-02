/**
 * 全局 AI 助手模块
 * 提供智能问答、快捷操作建议等功能
 */
(function() {
    'use strict';

    // AI 助手单例
    class AIAssistant {
        constructor() {
            this.isOpen = false;
            this.messages = [];
            this.isLoading = false;
            this.attachedImages = []; // 存储已上传的图片
            this.init();
        }

        init() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === '/') {
                    e.preventDefault();
                    this.toggle();
                }
            });
        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            this.isOpen = true;
            this.render();
            this.updateFloatingButton();
        }

        close() {
            this.isOpen = false;
            const overlay = document.getElementById('ai-assistant-overlay');
            if (overlay) {
                overlay.remove();
            }
            this.updateFloatingButton();
        }

        updateFloatingButton() {
            const btn = document.getElementById('ai-floating-btn');
            if (!btn) return;

            if (this.isOpen) {
                btn.style.display = 'none';
            } else {
                btn.style.display = 'flex';
            }
        }

        render() {
            const existing = document.getElementById('ai-assistant-overlay');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.id = 'ai-assistant-overlay';
            overlay.innerHTML = this.getHTML();
            document.body.appendChild(overlay);

            this.bindEvents();
            this.bindWindowDrag();

            setTimeout(() => {
                const input = document.getElementById('ai-input');
                if (input) input.focus();
            }, 100);
        }

        getHTML() {
            return `
                <div class="ai-window">
                    <div class="ai-window-header">
                        <div class="ai-window-title">
                            <svg t="1775962052731" class="ai-window-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M900.608 739.2c-23.296 40.512-71.168 61.184-137.28 61.184-26.112 0-55.36-3.456-86.784-9.92-36.16 115.968-94.08 181.76-162.24 181.76-68.032 0-125.952-65.792-162.112-181.76a429.952 429.952 0 0 1-88.448 10.048c-65.408 0-112.064-20.352-135.616-61.312-32.768-57.28-6.592-137.792 71.424-224.384C121.6 428.224 95.36 347.712 128.128 290.432c32.448-56.448 113.088-74.368 224-51.2 36.224-116.032 94.144-181.76 162.176-181.76 68.16 0 126.08 65.728 162.24 181.76a416.192 416.192 0 0 1 94.976-10.112c62.016 1.28 106.432 21.824 129.088 61.312 32.768 57.28 6.592 137.792-71.424 224.384 78.016 86.592 104.192 167.104 71.424 224.384z m-476.672-10.368c28.16 114.816 70.4 157.568 90.368 157.568 17.728 0 52.48-33.024 79.744-118.912-31.936-10.944-64.704-24.32-98.112-40.192a1075.84 1075.84 0 0 1-80.768-42.752c2.688 14.976 5.312 30.08 8.768 44.288z m-221.376-32.256c8.128 14.08 49.856 26.816 129.664 10.496-6.4-33.92-11.776-68.8-14.72-105.6-1.92-25.856-2.88-52.672-3.072-79.36-8.832 7.68-17.472 15.616-25.536 23.424-80.832 78.72-95.872 134.4-86.336 151.04z m168.064-364.8c-105.024-29.568-158.848-14.848-168.128 1.28-8.256 14.464 2.176 58.624 58.496 121.856 22.784-19.84 47.616-39.424 74.496-58.56 25.856-18.176 52.288-35.2 78.464-50.56a704 704 0 0 0-43.328-13.952z m234.24-31.04c-28.16-114.752-70.4-157.504-90.56-157.504-17.6 0-52.352 33.024-79.616 119.04 31.936 10.88 64.704 24.192 98.112 40.128a1073.984 1073.984 0 0 1 80.768 42.688c-2.688-14.976-5.312-30.08-8.768-44.352z m21.568 154.048c-19.008-12.8-38.08-25.152-57.216-36.288a1035.456 1035.456 0 0 0-54.912-29.44c-18.624 9.408-37.12 19.136-54.784 29.44a1016.32 1016.32 0 0 0-57.216 36.288c-1.152 19.84-2.304 39.68-2.304 60.032 0 20.288 1.152 40.256 2.304 60.16a927.36 927.36 0 0 0 112 65.664c18.752-9.408 37.248-19.136 54.912-29.44 19.136-11.072 38.208-23.488 57.216-36.288 1.088-19.84 2.24-39.808 2.24-60.096 0-20.288-1.152-40.192-2.24-60.032z m-11.648 229.056c14.72 5.12 29.184 9.984 43.328 13.952 104.96 29.568 158.72 14.848 168.128-1.216 8.256-14.464-2.24-58.624-58.496-121.92-22.784 19.84-47.68 39.488-74.496 58.624-25.856 18.304-52.288 35.2-78.464 50.56z m211.392-350.784c-8.128-14.016-49.92-26.88-129.664-10.496a952.96 952.96 0 0 1 17.792 185.024c8.704-7.68 17.216-15.488 25.536-23.488 80.832-78.72 95.872-134.4 86.336-151.04z" fill="#505766"></path><path d="M614.784 683.84l-100.416-43.2 112-65.728c19.392-12.928 48.704-35.392 87.936-67.328 0-91.008-8.832-128.64-17.792-184.96a827.648 827.648 0 0 0-19.968-83.392 416.192 416.192 0 0 1 94.976-10.112c62.016 1.28 106.432 21.824 129.088 61.312 32.768 57.28 6.592 137.792-71.424 224.384a859.008 859.008 0 0 1-214.4 168.96z m211.392-350.784c-8.128-14.016-49.92-26.88-129.664-10.496a952.96 952.96 0 0 1 17.792 185.024c8.704-7.68 17.216-15.488 25.536-23.488 80.832-78.72 95.872-134.4 86.336-151.04z" fill="#2F93F0"></path>
                            </svg>
                            <span>AI 智能助手</span>
                        </div>
                        <button class="ai-window-close" onclick="AIAssistant.close()">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="ai-window-body">
                        <div class="ai-messages" id="ai-messages">
                            <div class="ai-welcome">
                                <div class="ai-welcome-icon">
                                    <svg t="1775962052731" class="ai-logo-large" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M900.608 739.2c-23.296 40.512-71.168 61.184-137.28 61.184-26.112 0-55.36-3.456-86.784-9.92-36.16 115.968-94.08 181.76-162.24 181.76-68.032 0-125.952-65.792-162.112-181.76a429.952 429.952 0 0 1-88.448 10.048c-65.408 0-112.064-20.352-135.616-61.312-32.768-57.28-6.592-137.792 71.424-224.384C121.6 428.224 95.36 347.712 128.128 290.432c32.448-56.448 113.088-74.368 224-51.2 36.224-116.032 94.144-181.76 162.176-181.76 68.16 0 126.08 65.728 162.24 181.76a416.192 416.192 0 0 1 94.976-10.112c62.016 1.28 106.432 21.824 129.088 61.312 32.768 57.28 6.592 137.792-71.424 224.384 78.016 86.592 104.192 167.104 71.424 224.384z m-476.672-10.368c28.16 114.816 70.4 157.568 90.368 157.568 17.728 0 52.48-33.024 79.744-118.912-31.936-10.944-64.704-24.32-98.112-40.192a1075.84 1075.84 0 0 1-80.768-42.752c2.688 14.976 5.312 30.08 8.768 44.288z m-221.376-32.256c8.128 14.08 49.856 26.816 129.664 10.496-6.4-33.92-11.776-68.8-14.72-105.6-1.92-25.856-2.88-52.672-3.072-79.36-8.832 7.68-17.472 15.616-25.536 23.424-80.832 78.72-95.872 134.4-86.336 151.04z m168.064-364.8c-105.024-29.568-158.848-14.848-168.128 1.28-8.256 14.464 2.176 58.624 58.496 121.856 22.784-19.84 47.616-39.424 74.496-58.56 25.856-18.176 52.288-35.2 78.464-50.56a704 704 0 0 0-43.328-13.952z m234.24-31.04c-28.16-114.752-70.4-157.504-90.56-157.504-17.6 0-52.352 33.024-79.616 119.04 31.936 10.88 64.704 24.192 98.112 40.128a1073.984 1073.984 0 0 1 80.768 42.688c-2.688-14.976-5.312-30.08-8.768-44.352z m21.568 154.048c-19.008-12.8-38.08-25.152-57.216-36.288a1035.456 1035.456 0 0 0-54.912-29.44c-18.624 9.408-37.12 19.136-54.784 29.44a1016.32 1016.32 0 0 0-57.216 36.288c-1.152 19.84-2.304 39.68-2.304 60.032 0 20.288 1.152 40.256 2.304 60.16a927.36 927.36 0 0 0 112 65.664c18.752-9.408 37.248-19.136 54.912-29.44 19.136-11.072 38.208-23.488 57.216-36.288 1.088-19.84 2.24-39.808 2.24-60.096 0-20.288-1.152-40.192-2.24-60.032z m-11.648 229.056c14.72 5.12 29.184 9.984 43.328 13.952 104.96 29.568 158.72 14.848 168.128-1.216 8.256-14.464-2.24-58.624-58.496-121.92-22.784 19.84-47.68 39.488-74.496 58.624-25.856 18.304-52.288 35.2-78.464 50.56z m211.392-350.784c-8.128-14.016-49.92-26.88-129.664-10.496a952.96 952.96 0 0 1 17.792 185.024c8.704-7.68 17.216-15.488 25.536-23.488 80.832-78.72 95.872-134.4 86.336-151.04z" fill="#505766"></path><path d="M614.784 683.84l-100.416-43.2 112-65.728c19.392-12.928 48.704-35.392 87.936-67.328 0-91.008-8.832-128.64-17.792-184.96a827.648 827.648 0 0 0-19.968-83.392 416.192 416.192 0 0 1 94.976-10.112c62.016 1.28 106.432 21.824 129.088 61.312 32.768 57.28 6.592 137.792-71.424 224.384a859.008 859.008 0 0 1-214.4 168.96z m211.392-350.784c-8.128-14.016-49.92-26.88-129.664-10.496a952.96 952.96 0 0 1 17.792 185.024c8.704-7.68 17.216-15.488 25.536-23.488 80.832-78.72 95.872-134.4 86.336-151.04z" fill="#2F93F0"></path>
                                    </svg>
                                </div>
                                <h3>您好，我是 AI 智能助手</h3>
                                <p>我可以帮您：</p>
                                <ul>
                                    <li>解答系统使用问题</li>
                                    <li>提供供需对接建议</li>
                                    <li>推荐产品、课程、职位</li>
                                    <li>引导快捷操作</li>
                                    <li>识别图片内容</li>
                                </ul>
                                <div class="ai-quick-questions">
                                    <button onclick="AIAssistant.askQuestion('如何在平台发布产品？')">如何在平台发布产品？</button>
                                    <button onclick="AIAssistant.askQuestion('如何发起供需对接？')">如何发起供需对接？</button>
                                    <button onclick="AIAssistant.askQuestion('如何联系供应商？')">如何联系供应商？</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="ai-window-footer">
                        <div class="ai-attached-images" id="ai-attached-images"></div>
                        <div class="ai-input-row">
                            <label class="ai-image-upload" for="ai-image-input" title="上传图片">
                                <input type="file" id="ai-image-input" accept="image/*" multiple onchange="AIAssistant.handleImageUpload(this.files)" />
                                <i class="bi bi-image"></i>
                            </label>
                            <textarea id="ai-input" placeholder="输入您的问题，或上传图片..." onkeydown="AIAssistant.handleKeyDown(event)"></textarea>
                            <button id="ai-send-btn" onclick="AIAssistant.sendMessage()">
                                <i class="bi bi-send"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        bindEvents() {
            const input = document.getElementById('ai-input');
            if (input) {
                input.addEventListener('input', () => {
                    input.style.height = 'auto';
                    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
                });
            }
        }

        bindWindowDrag() {
            const aiWindow = document.querySelector('.ai-window');
            const header = document.querySelector('.ai-window-header');
            if (!aiWindow || !header) return;

            let isDragging = false;
            let startX, startY, startLeft, startTop;

            header.addEventListener('mousedown', function(e) {
                if (e.target.closest('.ai-window-close')) return;
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = aiWindow.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;
                aiWindow.style.transition = 'none';
                e.preventDefault();
            });

            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                let newLeft = startLeft + dx;
                let newTop = startTop + dy;

                const maxLeft = window.innerWidth - 380;
                const maxTop = window.innerHeight - 500;
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));

                aiWindow.style.left = newLeft + 'px';
                aiWindow.style.top = newTop + 'px';
            });

            document.addEventListener('mouseup', function() {
                if (isDragging) {
                    isDragging = false;
                    aiWindow.style.transition = '';
                }
            });
        }

        handleKeyDown(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.sendMessage();
            }
        }

        async handleImageUpload(files) {
            if (!files || files.length === 0) return;

            const container = document.getElementById('ai-attached-images');
            if (!container) return;

            for (const file of files) {
                if (!file.type.startsWith('image/')) {
                    alert('请选择图片文件');
                    continue;
                }

                // 限制文件大小 10MB
                if (file.size > 10 * 1024 * 1024) {
                    alert('图片大小不能超过 10MB');
                    continue;
                }

                // 读取文件为 base64
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = {
                        id: Date.now() + Math.random().toString(36).substr(2, 9),
                        base64: e.target.result,
                        name: file.name
                    };
                    this.attachedImages.push(imageData);
                    this.renderAttachedImages();
                };
                reader.readAsDataURL(file);
            }

            // 清空 input 以便重复选择同一文件
            document.getElementById('ai-image-input').value = '';
        }

        renderAttachedImages() {
            const container = document.getElementById('ai-attached-images');
            if (!container) return;

            container.innerHTML = this.attachedImages.map(img => `
                <div class="ai-attached-image" data-id="${img.id}">
                    <img src="${img.base64}" alt="${img.name}" />
                    <button class="ai-attached-image-remove" onclick="AIAssistant.removeImage('${img.id}')">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            `).join('');
        }

        removeImage(imageId) {
            this.attachedImages = this.attachedImages.filter(img => img.id != imageId);
            this.renderAttachedImages();
        }

        askQuestion(question) {
            const input = document.getElementById('ai-input');
            if (input) {
                input.value = question;
                this.sendMessage();
            }
        }

        async sendMessage() {
            const input = document.getElementById('ai-input');
            const sendBtn = document.getElementById('ai-send-btn');
            if (!input || !sendBtn) return;

            const content = input.value.trim();
            if (!content && this.attachedImages.length === 0) return;

            // 构建消息内容（支持多模态）
            let messageContent;
            if (this.attachedImages.length > 0) {
                // 多模态消息：图片 + 文本
                const imageContents = this.attachedImages.map(img => ({
                    type: 'image_url',
                    image_url: {
                        url: img.base64
                    }
                }));
                messageContent = [
                    ...imageContents,
                    { type: 'text', text: content || '请描述这张图片' }
                ];
            } else {
                messageContent = content;
            }

            const userMsg = { role: 'user', content: messageContent };
            this.messages.push(userMsg);

            // 显示消息（文本部分）
            const displayContent = this.attachedImages.length > 0
                ? (content || '（图片）') + (this.attachedImages.length > 0 ? ` [${this.attachedImages.length}张图片]` : '')
                : content;
            this.addMessage('user', displayContent, this.attachedImages.map(img => img.base64));

            input.value = '';
            input.style.height = 'auto';
            this.attachedImages = [];
            this.renderAttachedImages();

            this.setLoading(true);

            try {
                const response = await this.getAIResponse(this.messages);
                this.messages.push({ role: 'assistant', content: response });
                this.addMessage('assistant', response);
            } catch (error) {
                console.error('AI 响应失败:', error);
                this.addMessage('assistant', '抱歉，服务暂时不可用，请稍后再试。\n错误: ' + error.message);
            }

            this.setLoading(false);
        }

        addMessage(role, content, images = []) {
            const messagesContainer = document.getElementById('ai-messages');
            if (!messagesContainer) return;

            const welcome = messagesContainer.querySelector('.ai-welcome');
            if (welcome) {
                welcome.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = 'ai-message ai-message-' + role;

            let imagesHtml = '';
            if (images.length > 0) {
                imagesHtml = '<div class="ai-message-images">' + images.map(img =>
                    `<img src="${img}" class="ai-message-image" onclick="AIAssistant.previewImage('${img}')" />`
                ).join('') + '</div>';
            }

            if (role === 'assistant') {
                messageDiv.innerHTML = '<div class="ai-message-avatar"><svg t="1775962052731" class="ai-logo-small" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M900.608 739.2c-23.296 40.512-71.168 61.184-137.28 61.184-26.112 0-55.36-3.456-86.784-9.92-36.16 115.968-94.08 181.76-162.24 181.76-68.032 0-125.952-65.792-162.112-181.76a429.952 429.952 0 0 1-88.448 10.048c-65.408 0-112.064-20.352-135.616-61.312-32.768-57.28-6.592-137.792 71.424-224.384C121.6 428.224 95.36 347.712 128.128 290.432c32.448-56.448 113.088-74.368 224-51.2 36.224-116.032 94.144-181.76 162.176-181.76 68.16 0 126.08 65.728 162.24 181.76a416.192 416.192 0 0 1 94.976-10.112c62.016 1.28 106.432 21.824 129.088 61.312 32.768 57.28 6.592 137.792-71.424 224.384 78.016 86.592 104.192 167.104 71.424 224.384z m-476.672-10.368c28.16 114.816 70.4 157.568 90.368 157.568 17.728 0 52.48-33.024 79.744-118.912-31.936-10.944-64.704-24.32-98.112-40.192a1075.84 1075.84 0 0 1-80.768-42.752c2.688 14.976 5.312 30.08 8.768 44.288z m-221.376-32.256c8.128 14.08 49.856 26.816 129.664 10.496-6.4-33.92-11.776-68.8-14.72-105.6-1.92-25.856-2.88-52.672-3.072-79.36-8.832 7.68-17.472 15.616-25.536 23.424-80.832 78.72-95.872 134.4-86.336 151.04z m168.064-364.8c-105.024-29.568-158.848-14.848-168.128 1.28-8.256 14.464 2.176 58.624 58.496 121.856 22.784-19.84 47.616-39.424 74.496-58.56 25.856-18.176 52.288-35.2 78.464-50.56a704 704 0 0 0-43.328-13.952z m234.24-31.04c-28.16-114.752-70.4-157.504-90.56-157.504-17.6 0-52.352 33.024-79.616 119.04 31.936 10.88 64.704 24.192 98.112 40.128a1073.984 1073.984 0 0 1 80.768 42.688c-2.688-14.976-5.312-30.08-8.768-44.352z m21.568 154.048c-19.008-12.8-38.08-25.152-57.216-36.288a1035.456 1035.456 0 0 0-54.912-29.44c-18.624 9.408-37.12 19.136-54.784 29.44a1016.32 1016.32 0 0 0-57.216 36.288c-1.152 19.84-2.304 39.68-2.304 60.032 0 20.288 1.152 40.256 2.304 60.16a927.36 927.36 0 0 0 112 65.664c18.752-9.408 37.248-19.136 54.912-29.44 19.136-11.072 38.208-23.488 57.216-36.288 1.088-19.84 2.24-39.808 2.24-60.096 0-20.288-1.152-40.192-2.24-60.032z m-11.648 229.056c14.72 5.12 29.184 9.984 43.328 13.952 104.96 29.568 158.72 14.848 168.128-1.216 8.256-14.464-2.24-58.624-58.496-121.92-22.784 19.84-47.68 39.488-74.496 58.624-25.856 18.304-52.288 35.2-78.464 50.56z m211.392-350.784c-8.128-14.016-49.92-26.88-129.664-10.496a952.96 952.96 0 0 1 17.792 185.024c8.704-7.68 17.216-15.488 25.536-23.488 80.832-78.72 95.872-134.4 86.336-151.04z" fill="#505766"></path><path d="M614.784 683.84l-100.416-43.2 112-65.728c19.392-12.928 48.704-35.392 87.936-67.328 0-91.008-8.832-128.64-17.792-184.96a827.648 827.648 0 0 0-19.968-83.392 416.192 416.192 0 0 1 94.976-10.112c62.016 1.28 106.432 21.824 129.088 61.312 32.768 57.28 6.592 137.792-71.424 224.384a859.008 859.008 0 0 1-214.4 168.96z m211.392-350.784c-8.128-14.016-49.92-26.88-129.664-10.496a952.96 952.96 0 0 1 17.792 185.024c8.704-7.68 17.216-15.488 25.536-23.488 80.832-78.72 95.872-134.4 86.336-151.04z" fill="#2F93F0"></path></svg></div><div class="ai-message-content">' + imagesHtml + this.escapeHtml(content) + '</div>';
            } else {
                messageDiv.innerHTML = '<div class="ai-message-content">' + imagesHtml + this.escapeHtml(content) + '</div><div class="ai-message-avatar user"><i class="bi bi-person"></i></div>';
            }

            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        previewImage(src) {
            const overlay = document.createElement('div');
            overlay.className = 'ai-image-preview-overlay';
            overlay.onclick = () => overlay.remove();
            overlay.innerHTML = `<img src="${src}" class="ai-image-preview" />`;
            document.body.appendChild(overlay);
        }

        setLoading(loading) {
            const messagesContainer = document.getElementById('ai-messages');
            if (!messagesContainer) return;

            const loadingEl = messagesContainer.querySelector('.ai-loading');
            if (loading) {
                if (!loadingEl) {
                    const loadingDiv = document.createElement('div');
                    loadingDiv.className = 'ai-message ai-message-assistant ai-loading';
                    loadingDiv.innerHTML = '<div class="ai-message-avatar"><svg t="1775962052731" class="ai-logo-small" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M900.608 739.2c-23.296 40.512-71.168 61.184-137.28 61.184-26.112 0-55.36-3.456-86.784-9.92-36.16 115.968-94.08 181.76-162.24 181.76-68.032 0-125.952-65.792-162.112-181.76a429.952 429.952 0 0 1-88.448 10.048c-65.408 0-112.064-20.352-135.616-61.312-32.768-57.28-6.592-137.792 71.424-224.384C121.6 428.224 95.36 347.712 128.128 290.432c32.448-56.448 113.088-74.368 224-51.2 36.224-116.032 94.144-181.76 162.176-181.76 68.16 0 126.08 65.728 162.24 181.76a416.192 416.192 0 0 1 94.976-10.112c62.016 1.28 106.432 21.824 129.088 61.312 32.768 57.28 6.592 137.792-71.424 224.384 78.016 86.592 104.192 167.104 71.424 224.384z m-476.672-10.368c28.16 114.816 70.4 157.568 90.368 157.568 17.728 0 52.48-33.024 79.744-118.912-31.936-10.944-64.704-24.32-98.112-40.192a1075.84 1075.84 0 0 1-80.768-42.752c2.688 14.976 5.312 30.08 8.768 44.288z m-221.376-32.256c8.128 14.08 49.856 26.816 129.664 10.496-6.4-33.92-11.776-68.8-14.72-105.6-1.92-25.856-2.88-52.672-3.072-79.36-8.832 7.68-17.472 15.616-25.536 23.424-80.832 78.72-95.872 134.4-86.336 151.04z m168.064-364.8c-105.024-29.568-158.848-14.848-168.128 1.28-8.256 14.464 2.176 58.624 58.496 121.856 22.784-19.84 47.616-39.424 74.496-58.56 25.856-18.176 52.288-35.2 78.464-50.56a704 704 0 0 0-43.328-13.952z m234.24-31.04c-28.16-114.752-70.4-157.504-90.56-157.504-17.6 0-52.352 33.024-79.616 119.04 31.936 10.88 64.704 24.192 98.112 40.128a1073.984 1073.984 0 0 1 80.768 42.688c-2.688-14.976-5.312-30.08-8.768-44.352z m21.568 154.048c-19.008-12.8-38.08-25.152-57.216-36.288a1035.456 1035.456 0 0 0-54.912-29.44c-18.624 9.408-37.12 19.136-54.784 29.44a1016.32 1016.32 0 0 0-57.216 36.288c-1.152 19.84-2.304 39.68-2.304 60.032 0 20.288 1.152 40.256 2.304 60.16a927.36 927.36 0 0 0 112 65.664c18.752-9.408 37.248-19.136 54.912-29.44 19.136-11.072 38.208-23.488 57.216-36.288 1.088-19.84 2.24-39.808 2.24-60.096 0-20.288-1.152-40.192-2.24-60.032z m-11.648 229.056c14.72 5.12 29.184 9.984 43.328 13.952 104.96 29.568 158.72 14.848 168.128-1.216 8.256-14.464-2.24-58.624-58.496-121.92-22.784 19.84-47.68 39.488-74.496 58.624-25.856 18.304-52.288 35.2-78.464 50.56z m211.392-350.784c-8.128-14.016-49.92-26.88-129.664-10.496a952.96 952.96 0 0 1 17.792 185.024c8.704-7.68 17.216-15.488 25.536-23.488 80.832-78.72 95.872-134.4 86.336-151.04z" fill="#505766"></path><path d="M614.784 683.84l-100.416-43.2 112-65.728c19.392-12.928 48.704-35.392 87.936-67.328 0-91.008-8.832-128.64-17.792-184.96a827.648 827.648 0 0 0-19.968-83.392 416.192 416.192 0 0 1 94.976-10.112c62.016 1.28 106.432 21.824 129.088 61.312 32.768 57.28 6.592 137.792-71.424 224.384a859.008 859.008 0 0 1-214.4 168.96z m211.392-350.784c-8.128-14.016-49.92-26.88-129.664-10.496a952.96 952.96 0 0 1 17.792 185.024c8.704-7.68 17.216-15.488 25.536-23.488 80.832-78.72 95.872-134.4 86.336-151.04z" fill="#2F93F0"></path></svg></div><div class="ai-message-content"><div class="ai-typing"><span></span><span></span><span></span></div></div>';
                    messagesContainer.appendChild(loadingDiv);
                }
            } else {
                if (loadingEl) {
                    loadingEl.remove();
                }
            }

            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }

        async getAIResponse(messages) {
            try {
                const response = await fetch(ZhiliApi.apiRoot() + '/ai/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ messages: messages })
                });

                if (!response.ok) {
                    throw new Error('请求失败: ' + response.status);
                }

                const result = await response.json();
                if (result.code === 200) {
                    return result.data.reply;
                } else {
                    throw new Error(result.message || 'AI 服务返回错误');
                }
            } catch (error) {
                console.error('调用 AI 接口失败:', error);
                throw error;
            }
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }

    window.AIAssistant = new AIAssistant();

    function createFloatingButton() {
        const btn = document.createElement('div');
        btn.id = 'ai-floating-btn';
        btn.innerHTML = '<svg t="1775962052731" class="ai-floating-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M900.608 739.2c-23.296 40.512-71.168 61.184-137.28 61.184-26.112 0-55.36-3.456-86.784-9.92-36.16 115.968-94.08 181.76-162.24 181.76-68.032 0-125.952-65.792-162.112-181.76a429.952 429.952 0 0 1-88.448 10.048c-65.408 0-112.064-20.352-135.616-61.312-32.768-57.28-6.592-137.792 71.424-224.384C121.6 428.224 95.36 347.712 128.128 290.432c32.448-56.448 113.088-74.368 224-51.2 36.224-116.032 94.144-181.76 162.176-181.76 68.16 0 126.08 65.728 162.24 181.76a416.192 416.192 0 0 1 94.976-10.112c62.016 1.28 106.432 21.824 129.088 61.312 32.768 57.28 6.592 137.792-71.424 224.384 78.016 86.592 104.192 167.104 71.424 224.384z m-476.672-10.368c28.16 114.816 70.4 157.568 90.368 157.568 17.728 0 52.48-33.024 79.744-118.912-31.936-10.944-64.704-24.32-98.112-40.192a1075.84 1075.84 0 0 1-80.768-42.752c2.688 14.976 5.312 30.08 8.768 44.288z m-221.376-32.256c8.128 14.08 49.856 26.816 129.664 10.496-6.4-33.92-11.776-68.8-14.72-105.6-1.92-25.856-2.88-52.672-3.072-79.36-8.832 7.68-17.472 15.616-25.536 23.424-80.832 78.72-95.872 134.4-86.336 151.04z m168.064-364.8c-105.024-29.568-158.848-14.848-168.128 1.28-8.256 14.464 2.176 58.624 58.496 121.856 22.784-19.84 47.616-39.424 74.496-58.56 25.856-18.176 52.288-35.2 78.464-50.56a704 704 0 0 0-43.328-13.952z m234.24-31.04c-28.16-114.752-70.4-157.504-90.56-157.504-17.6 0-52.352 33.024-79.616 119.04 31.936 10.88 64.704 24.192 98.112 40.128a1073.984 1073.984 0 0 1 80.768 42.688c-2.688-14.976-5.312-30.08-8.768-44.352z m21.568 154.048c-19.008-12.8-38.08-25.152-57.216-36.288a1035.456 1035.456 0 0 0-54.912-29.44c-18.624 9.408-37.12 19.136-54.784 29.44a1016.32 1016.32 0 0 0-57.216 36.288c-1.152 19.84-2.304 39.68-2.304 60.032 0 20.288 1.152 40.256 2.304 60.16a927.36 927.36 0 0 0 112 65.664c18.752-9.408 37.248-19.136 54.912-29.44 19.136-11.072 38.208-23.488 57.216-36.288 1.088-19.84 2.24-39.808 2.24-60.096 0-20.288-1.152-40.192-2.24-60.032z m-11.648 229.056c14.72 5.12 29.184 9.984 43.328 13.952 104.96 29.568 158.72 14.848 168.128-1.216 8.256-14.464-2.24-58.624-58.496-121.92-22.784 19.84-47.68 39.488-74.496 58.624-25.856 18.304-52.288 35.2-78.464 50.56z m211.392-350.784c-8.128-14.016-49.92-26.88-129.664-10.496a952.96 952.96 0 0 1 17.792 185.024c8.704-7.68 17.216-15.488 25.536-23.488 80.832-78.72 95.872-134.4 86.336-151.04z" fill="#505766"></path><path d="M614.784 683.84l-100.416-43.2 112-65.728c19.392-12.928 48.704-35.392 87.936-67.328 0-91.008-8.832-128.64-17.792-184.96a827.648 827.648 0 0 0-19.968-83.392 416.192 416.192 0 0 1 94.976-10.112c62.016 1.28 106.432 21.824 129.088 61.312 32.768 57.28 6.592 137.792-71.424 224.384a859.008 859.008 0 0 1-214.4 168.96z m211.392-350.784c-8.128-14.016-49.92-26.88-129.664-10.496a952.96 952.96 0 0 1 17.792 185.024c8.704-7.68 17.216-15.488 25.536-23.488 80.832-78.72 95.872-134.4 86.336-151.04z" fill="#2F93F0"></path></svg><span class="ai-floating-tip">AI助手</span>';

        btn.addEventListener('click', function(e) {
            // 如果刚结束拖拽，不触发点击
            if (this.dataset.justDragged === 'true') {
                this.dataset.justDragged = 'false';
                return;
            }
            if (typeof window.AIAssistant !== 'undefined') {
                window.AIAssistant.toggle();
            }
        });

        let isDragging = false;
        let startX, startY, startLeft, startTop;
        let hasDragged = false;

        btn.addEventListener('mousedown', function(e) {
            if (e.target.closest('.ai-floating-tip')) return;
            isDragging = true;
            hasDragged = false;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = btn.offsetLeft;
            startTop = btn.offsetTop;
            btn.style.transition = 'none';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            // 移动超过 5px 才算拖拽
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                hasDragged = true;
            }
            let newLeft = startLeft + dx;
            let newTop = startTop + dy;
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 60));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - 60));
            btn.style.left = newLeft + 'px';
            btn.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                // 只有真正拖拽过才标记，防止点击时误判
                if (hasDragged) {
                    btn.dataset.justDragged = 'true';
                }
                isDragging = false;
                hasDragged = false;
                btn.style.transition = '';
            }
        });

        document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingButton);
    } else {
        createFloatingButton();
    }
})();

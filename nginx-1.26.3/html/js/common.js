/**
 * 公共脚本（各页面共用）
 * 自动加载 AI 助手等全局组件
 */
(function () {
    'use strict';

    // 自动加载 AI 助手
    function loadAIAssistant() {
        // 检查是否禁用
        if (window.disableAIAssistant) return;

        // 检查是否已加载
        if (window.AIAssistant) return;

        // 根据当前页面位置确定 js 文件夹的路径
        var jsBasePath = window.location.pathname.includes('/pages/') ? '../js/' : 'js/';

        var script = document.createElement('script');
        script.src = jsBasePath + 'ai-assistant.js';
        script.onload = function() {
            console.log('AI 助手已加载');
        };
        script.onerror = function() {
            console.error('AI 助手加载失败');
        };
        document.head.appendChild(script);
    }

    // 页面加载完成后加载 AI 助手
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAIAssistant);
    } else {
        loadAIAssistant();
    }
})();

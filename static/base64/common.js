// 通用工具函数
const utils = {
    // 检查字符串是否为有效的 Base64
    isValidBase64: function(str) {
        try {
            return btoa(atob(str)) == str;
        } catch (err) {
            return false;
        }
    },

    // 格式化文件大小
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // 获取文件扩展名
    getFileExtension: function(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    },

    // 检查是否是图片文件
    isImageFile: function(file) {
        const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
        return imageTypes.includes(file.type);
    },

    // 检查是否是文本文件
    isTextFile: function(file) {
        const textTypes = ['text/plain', 'text/html', 'text/css', 'text/javascript'];
        return textTypes.includes(file.type);
    },

    // 安全的 HTML 编码
    escapeHtml: function(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    // 生成随机文件名
    generateRandomFileName: function(extension) {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 10000);
        return `file_${timestamp}_${random}.${extension}`;
    },

    // 复制文本到剪贴板
    copyToClipboard: function(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch (err) {
            document.body.removeChild(textarea);
            return false;
        }
    },

    // 防抖函数
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle: function(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// 导出工具函数
window.utils = utils;
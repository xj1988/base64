// 简单的页面访问统计
(function() {
    // 记录页面加载时间
    const pageLoadTime = new Date().getTime();
    
    // 记录用户停留时间
    let startTime = pageLoadTime;
    
    // 基本统计数据
    const stats = {
        pageViews: 0,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        timestamp: new Date().toISOString()
    };

    // 记录页面访问
    function recordPageView() {
        stats.pageViews++;
        // 这里可以添加发送统计数据到服务器的代码
        // 由于这是静态网站，我们只在控制台记录
        console.log('Page View:', stats);
    }

    // 记录用户行为
    function recordUserAction(action) {
        const actionData = {
            action: action,
            timestamp: new Date().toISOString(),
            timeOnPage: new Date().getTime() - startTime
        };
        console.log('User Action:', actionData);
    }

    // 页面加载完成时记录访问
    window.addEventListener('load', function() {
        recordPageView();
    });

    // 记录用户离开时间
    window.addEventListener('beforeunload', function() {
        recordUserAction('leave');
    });

    // 记录用户交互
    document.addEventListener('click', function(e) {
        const target = e.target;
        if (target.id) {
            recordUserAction(`click_${target.id}`);
        }
    });

    // 暴露统计接口
    window.hmStats = {
        recordAction: recordUserAction,
        getStats: function() {
            return {...stats};
        }
    };
})();
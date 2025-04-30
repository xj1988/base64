$(function() {
    // 全局变量
    var $text = $('#text'),
        $result = $('#result'),
        $encode = $('#encode'),
        $decode = $('#decode'),
        $exchange = $('#exchange'),
        $alert = $('#alert'),
        $as = $('#as');

    // 初始化提示框
    $alert.hide();

    // 编码按钮点击事件
    $encode.on('click', function() {
        var text = $text.val();
        if (!text) {
            showAlert('请输入要编码的内容', 'warning');
            return;
        }
        try {
            var result = btoa(unescape(encodeURIComponent(text)));
            $result.val(result);
            showAlert('编码成功', 'success');
            if ($as.prop('checked')) {
                $result.select();
            }
        } catch (e) {
            showAlert('编码失败：' + e.message, 'danger');
        }
    });

    // 解码按钮点击事件
    $decode.on('click', function() {
        var text = $text.val();
        if (!text) {
            showAlert('请输入要解码的内容', 'warning');
            return;
        }
        try {
            var result = decodeURIComponent(escape(atob(text)));
            $result.val(result);
            showAlert('解码成功', 'success');
            if ($as.prop('checked')) {
                $result.select();
            }
        } catch (e) {
            showAlert('解码失败：可能不是有效的 Base64 编码', 'danger');
        }
    });

    // 交换按钮点击事件
    $exchange.on('click', function() {
        var text = $text.val();
        $text.val($result.val());
        $result.val(text);
    });

    // 快捷键支持
    $(document).on('keydown', function(e) {
        if (e.ctrlKey && e.keyCode === 13) { // Ctrl + Enter
            $encode.click();
        }
    });

    // 文件转 Base64
    $('#image_input').on('change', function(e) {
        var file = e.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(e) {
            $text.val(e.target.result);
            showAlert('文件读取成功', 'success');
        };
        reader.onerror = function(e) {
            showAlert('文件读取失败：' + e.target.error, 'danger');
        };
        reader.readAsDataURL(file);
    });

    // 显示提示信息
    function showAlert(message, type) {
        $alert
            .removeClass('alert-success alert-info alert-warning alert-danger')
            .addClass('alert-' + type)
            .html(message)
            .show()
            .delay(3000)
            .fadeOut();
    }
});
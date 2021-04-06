var form = layui.form,
    layer = layui.layer;
if (top.location != self.location) top.location = self.location;
$('.layui-container').particleground({
    dotColor: '#5cbdaa',
    lineColor: '#5cbdaa'
});
$("#username").focus(function () {
    $('#usernameIco').attr('style', "color: #009688;");
})
$("#username").blur(function () {
    $("#username").css('borderColor', '');
    $('#usernameIco').attr('style', "");
})
$("#password").focus(function () {
    $('#passwordIco').attr('style', "color: #009688;");
})
$("#password").blur(function () {
    $("#password").css('borderColor', '');
    $('#passwordIco').attr('style', "");
})

function login() {
    showNoticeInfo("正在請求驗證...");
}

window.callback = function (res) {
    showNoticeSucc("驗證成功");
    var account = $("#username").val();
    var password = $("#password").val();
    if (account == '') {
        showTip("用戶名不能為空");
        $("#username").focus();
        return false;
    }
    if (password == '') {
        showTip("密碼不能為空");
        $("#password").focus();
        return false;
    }
    if (res.ret === 0) {
        var validate = res.ticket;
        var randstr = res.randstr;
        if (validate == '') {
            showTip("驗證碼不能為空");
            return false;
        }
        showNoticeInfo("正在發出登錄請求...");
        $.ajax({
            url: "//itech-api.iskwen.com/api/userLogin",
            type: "POST",
            dataType: "json",
            data: "username=" + account + "&password=" + hex_md5(password) + "&vall=" + validate + "&randstr=" + randstr,
            success: function (msg) {
                if (msg.status === 0) {
                    showNoticeSucc("登錄成功");
                    setCookie("token", msg.token, 1000 * 60 * 60 * 2);
                    top.window.location = 'index';
                } else if (msg.status === -7) {
                    showNoticeError(msg.tip);
                    $("#username").css('borderColor', 'red');
                    $("#password").css('borderColor', 'red');
                    showTip(msg.tip);
                } else {
                    showNoticeError(msg.tip);
                    $("#username").css('borderColor', 'red');
                    $("#password").css('borderColor', 'red');
                    showTip(msg.tip);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                showErrorMsg("系統在開小差，請稍候再試");
            }
        });

    } else if (res.ret === 2) {
        showTip("不要放棄哦~");
    }
}

function key() {
    if (event.keyCode == 13)   //回车键的键值为13
        document.getElementById("TencentCaptcha").click();
}
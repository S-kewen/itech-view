var form = layui.form,
    layer = layui.layer;
if (top.location != self.location) top.location = self.location;
$('.layui-container').particleground({
    dotColor: '#5cbdaa',
    lineColor: '#5cbdaa'
});
window.onload = function () {
    if (getUrlValue('token') === null || getUrlValue('token') === '' || getUrlValue('token') === undefined) {
        top.location.href = "findPassword";
    }
}
$("#password").focus(function () {
    $('#passwordIco').attr('style', "color: #009688;");
})
$("#password").blur(function () {
    $('#passwordIco').attr('style', "");
    $("#password").css('borderColor', '');
})
$("#password2").focus(function () {
    $('#passwordIco2').attr('style', "color: #009688;");
})
$("#password2").blur(function () {
    $('#passwordIco2').attr('style', "");
    $("#password2").css('borderColor', '');
})
window.callback = function (res) {
    showNoticeSucc("驗證成功");
    var password = $("#password").val();
    var password2 = $("#password2").val();
    if (password === '') {
        $("#password").focus();
        showTip("新密碼不能為空");
        return false;
    }
    if (password.length < 8) {
        $("#password").focus();
        showTip("新密碼長度必須大於8");
        return false;
    }
    if (password2 === '') {
        $("#password2").focus();
        showTip("新密碼不能為空");
        return false;
    }
    if (password2.length < 8) {
        $("#password2").focus();
        showTip("新密碼長度必須大於8");
        return false;
    }
    if (password !== password2) {
        $("#password").focus();
        $("#password2").focus();
        showTip("密碼輸入不一致");
        return false;
    }
    if (res.ret === 0) {
        var validate = res.ticket;
        var randstr = res.randstr;
        if (validate == '') {
            showTip("驗證碼不能為空");
            return false;
        }
        showNoticeInfo("正在發送重置請求...");
        $.ajax({
            url: "//itech-api.iskwen.com/api/resetPassword",
            type: "POST",
            dataType: "json",
            data: "password=" + hex_md5(password) + "&token=" + getUrlValue("token") + "&vall=" + validate + "&randstr=" + randstr,
            success: function (msg) {
                if (msg.status === 0) {
                    layer.msg('修改成功', {icon: 1, time: 2000}, function () {
                        top.window.location = 'login';
                    });
                } else {
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
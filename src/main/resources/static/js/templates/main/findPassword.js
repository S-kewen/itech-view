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
    $('#usernameIco').attr('style', "");
    $("#username").css('borderColor', '');
})
$("#mail").focus(function () {
    $('#mailIco').attr('style', "color: #009688;");
})
$("#mail").blur(function () {
    $('#mailIco').attr('style', "");
    $("#mail").css('borderColor', '');
})

window.callback = function (res) {
    showNoticeSucc("驗證成功");
    var account = $("#username").val();
    var email = $("#mail").val();
    if (account == '') {
        $("#username").focus();
        showTip("用戶名不能為空");
        return;
    }
    if (email == '') {
        $("#mail").focus();
        showTip("郵箱不能為空");
        return;
    }
    if (!checkEmail(email)) {
        $("#mail").css('borderColor', 'red');
        showTip("郵箱地址格式不正確");
        return;
    }
    if (res.ret === 0) {
        var validate = res.ticket;
        var randstr = res.randstr;
        if (validate == '') {
            showTip("驗證碼不能為空");
            return false;
        }
        showNoticeInfo("正在發送找回請求...");
        $.ajax({
            url: "//itech-api.iskwen.com/api/findPassword",
            type: "POST",
            dataType: "json",
            data: "username=" + account + "&email=" + email + "&vall=" + validate + "&randstr=" + randstr,
            success: function (msg) {
                if (msg.status !== 0) {
                    $("#username").css('borderColor', 'red');
                    $("#mail").css('borderColor', 'red');
                    showTip(msg.tip);
                } else {
                    showMsg("請前往郵箱查收~");
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

function checkEmail(str) {
    var re = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (re.test(str) != true) {
        return false;
    } else {
        return true;
    }
}

function key() {
    if (event.keyCode == 13)   //回车键的键值为13
        document.getElementById("TencentCaptcha").click();
}

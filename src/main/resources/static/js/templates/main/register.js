var form = layui.form,
    layer = layui.layer;
if (top.location != self.location) top.location = self.location;
$('.layui-container').particleground({
    dotColor: '#5cbdaa',
    lineColor: '#5cbdaa'
});
$("#userrname").focus(function () {
    $('#userrnameIco').attr('style', "color: #009688;");
})
$("#userrname").blur(function () {
    $("#userrname").css('borderColor', '');
    $('#userrnameIco').attr('style', "");
})
$("#password").focus(function () {
    $('#passwordIco').attr('style', "color: #009688;");
})
$("#password").blur(function () {
    $("#password").css('borderColor', '');
    $('#passwordIco').attr('style', "");
})
$("#password2").focus(function () {
    $('#password2Ico').attr('style', "color: #009688;");
})
$("#password2").blur(function () {
    $("#password2").css('borderColor', '');
    $('#password2Ico').attr('style', "");
})
$("#mail").focus(function () {
    $('#mailIco').attr('style', "color: #009688;");
})
$("#mail").blur(function () {
    $("#mail").css('borderColor', '');
    $('#mailIco').attr('style', "");
})

function key() {
    if (event.keyCode == 13)   //回车键的键值为13
        document.getElementById("TencentCaptcha").click();
}

window.callback = function (res) {
    showNoticeSucc("驗證成功");
    var account = $("#userrname").val();
    var password = $("#password").val();
    var repassword = $("#password2").val();
    var email = $("#mail").val();
    if (!checkAccount(account)) {
        $("#userrname").css('borderColor', 'red');
        $("#userrname").focus();
        showTip("賬號必須由字母數字或下劃線組成4-16位");
        return;
    }
    if (password == '') {//|| password.length < 8
        $("#password").css('borderColor', 'red');
        $("#password2").css('borderColor', 'red');
        showTip("密碼不能為空");
        return;
    }
    if (repassword != password) {
        $("#password").css('borderColor', 'red');
        $("#password2").css('borderColor', 'red');
        showTip("兩次密碼輸入不一致");
        return;
    }
    if (!checkEmail(email)) {
        $("#mail").focus();
        showTip("請輸入正確的郵箱地址");
        return;
    }
    if (res.ret === 0) {
        var validate = res.ticket;
        var randstr = res.randstr;
        if (validate == '') {
            showTip("驗證碼不能為空");
            return false;
        }
        showNoticeInfo("正在發出註冊請求...");
        $.ajax({
            url: "//itech-api.iskwen.com/api/register",
            type: "POST",
            dataType: "json",
            data: "username=" + account + "&password=" + hex_md5(password) + "&email=" + email + "&vall=" + validate + "&randstr=" + randstr,
            success: function (msg) {
                if (msg.status != 0) {
                    showTip(msg.tip);
                } else {
                    layer.msg(msg.tip, {icon: 1, time: 3000}, function () {
                        top.window.location = 'login';
                    });
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

function checkAccount(str) {
    var re = /\w{4,15}$/;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}

function checkEmail(str) {
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}    
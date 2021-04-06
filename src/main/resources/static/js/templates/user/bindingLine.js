var form = layui.form,
    layer = layui.layer;
if (top.location != self.location) top.location = self.location;
var language
    ,viewType
    ,userId
    ,utouId
    ,roomId
    ,groupId;
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
window.onload = function (e) {
    liff.init(function (data) {
        initializeApp(data);
    });
};
function initializeApp(data) {
    language=data.language;
    viewType=data.context.viewType;
    userId=data.context.userId;
    utouId=data.context.utouId;
    roomId=data.context.roomId;
    groupId=data.context.groupId;
    if(userId===null || userId==='' || userId===undefined){
        alert("請在line中打開,或請重試");
        window.close();
        return false;
    }
    $.ajax({
        url: "//itech-api.iskwen.com/api/getBindingLineInfoByLine",
        type: "post",
        dataType: "json",
        data: "lineUserId=" + userId,
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status == 0) {
                $('#TencentCaptcha').attr("disabled",false);
            } else {
                alert(msg.tip);
                window.close();
                return false;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showTip("系統在開小差，請稍候再試");
            window.close();
            return false;
        }
    })

}
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
        if(userId===null || userId==='' || userId===undefined){
            alert("請在line中打開,或請重試");
            window.close();
            return false;
        }
        showNoticeInfo("正在發出請求...");
        $.ajax({
            url: "//itech-api.iskwen.com/api/bindingLine",
            type: "POST",
            dataType: "json",
            data: "username=" + account + "&password=" + hex_md5(password) + "&vall=" + validate + "&randstr=" + randstr+"&language="+language+"&viewType="+viewType+"&userId="+userId+"&utouId="+utouId+"&roomId="+roomId+"&groupId="+groupId,
            success: function (msg) {
                if (msg.status === 0) {
                    showNoticeSucc("綁定成功");
                    alert("綁定成功");
                    window.close();
                }  else {
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
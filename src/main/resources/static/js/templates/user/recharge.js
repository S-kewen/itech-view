var username = "";
$(document).ready(function () {
    $.ajax({
        url: "//itech-api.iskwen.com/api/getUserInfo",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status === 0) {
                username = msg.username;
                $("#username").val(msg.username);
            } else {
                showTip(msg.tip);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
})

function clearInput() {
    $("#cdkey").val("");
}

function byOthers() {
    if ($("#byOthersHref").text() === "幫他人儲值?") {
        $('#byOthersHref').attr("ly2-tips-text", '真的不再考慮一下嗎?');
        $("#byOthersHref").text('給自己儲值?')
        $('#username').removeAttr("readonly");
        $("#username").val("");
        $("#username").focus();
        showMsg('請輸入對方的用戶名');
    } else {
        $('#byOthersHref').attr("ly2-tips-text", '哇,你最好了~');
        $("#byOthersHref").text('幫他人儲值?')
        $("#username").val(username);
        $('#username').attr("readonly", true);
        showMsg('切換為給自己儲值');
    }
}

function post() {
    const username = $("#username").val();
    const cdkey = $("#cdkey").val();
    if (username === '') {
        showTip("用戶名不能為空");
        return false;
    }
    if (cdkey === '') {
        showTip("卡密不能為空");
        return false;
    }
    $.ajax({
        url: "//itech-api.iskwen.com/api/recharge",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        data: "username=" + username + "&cdkey=" + cdkey,
        success: function (msg) {
            if (msg.status === 0) {
                layer.msg('儲值成功', {icon: 1, time: 1000}, function () {
                    if (getUrlValue("byUrl") !== '') {
                        if (parent.$('#LAY_app_tabsheader>li[lay-id="' + getUrlValue("byUrl") + '"] ').length === 1) {
                            parent.layui.admin.events.changeThisTabsByRefresh(getUrlValue("byUrl"), decodeURI(getUrlValue("byText")), true);
                        } else {
                            parent.layui.admin.events.closeThisTabs();
                        }
                    } else {
                        parent.layui.admin.events.closeThisTabs();
                    }
                });
            } else {
                showTip(msg.tip);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
}
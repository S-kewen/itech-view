var task_refreshUnreadMessage = window.setInterval('getUnreadMessageCount()', 30000);//刷新未讀消息
var task_checkToken = window.setInterval('checkToken()', 60000);//檢查token
$(document).ready(function () {
    $.ajax({
        url: "//itech-api.iskwen.com/api/checkToken",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status == 0) {
                //showRockTip("用戶:"+msg.username+"\nttl:"+msg.ttl)
            } else {
                top.location.href = '/logout';
                return false;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
    $.ajax({
        url: "//itech-api.iskwen.com/api/getIndexInfo",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status === 0) {
                $("#usernameByCite").html(msg.username);
                if (msg.messageState > 99) {
                    $("#messageState").html("99+");
                } else {
                    $("#messageState").html(msg.messageState);
                }
            } else {
                showTip(msg.tip);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
})

function logout() {
    showConfirm("溫馨提示", "您確認要退出登錄嗎？", function (index) {
        showNoticeSucc("正在退出登錄...");
        top.location.href = '/logout';
    });
}

function getUnreadMessageCount() {
    $.ajax({
        url: "//itech-api.iskwen.com/api/getUnreadMessageCount",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status == 0) {
                if (msg.unreadMessageCount > 99) {
                    $("#messageState").html("99+");
                } else {
                    if (msg.unreadMessageCount > 0) {
                        $("#messageState").html(msg.unreadMessageCount);
                    } else {
                        $("#messageState").html(0);
                    }
                }
            } else {
                // showTip(msg.tip);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // showErrorMsg("系統在開小差，請稍候再試");
        }
    });
}

function refresh() {
    $.ajax({
        url: "//itech-api.iskwen.com/api/checkToken",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status === 0) {
                getUnreadMessageCount();
            } else {
                top.location.href = '/logout';
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
}

function checkToken() {
    $.ajax({
        url: "//itech-api.iskwen.com/api/checkToken",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status == 0) {
                //showRockTip("用戶:"+msg.username+"\nttl:"+msg.ttl)
            } else {
                clearInterval(task_refreshUnreadMessage);
                clearInterval(task_checkToken);
                showConfirm("溫馨提示", msg.tip + ",是否重新登錄?", function (index) {
                    showNoticeSucc("正在退出登錄...");
                    top.location.href = '/logout';
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
}
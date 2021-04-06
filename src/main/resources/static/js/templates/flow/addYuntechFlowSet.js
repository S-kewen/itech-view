function post() {
    const ip = $("#ip").val();
    const warnValue = $("#warnValue").val();
    const warnMail = $("#warnMail").val();
    const warnPhone = $("#warnPhone").val();
    const mailState = $('input[name="mailState"]:checked').val();
    const phoneState = $('input[name="phoneState"]:checked').val();
    const mailInterval = $("#mailInterval").val();
    const phoneInterval = $("#phoneInterval").val();
    const remark = $("#remark").val();
    if (ip === '') {
        showTip("ip不能為空");
        return false;
    }
    if (warnValue === '') {
        showTip("告警值不能為空");
        return false;
    }
    if (!checkNum(warnValue)) {
        showTip("告警值必須為實數,精確兩位小數");
        return false;
    }
    if (warnValue <= 0) {
        showTip("告警值必須大於0");
        return false;
    }
    if (!checkIp(ip)) {
        showTip("ip格式有誤");
        return false;
    }
    if (mailState === undefined || mailState === null || mailState === "") {
        showTip("請先選擇郵箱告警狀態");
        return false;
    }
    if (phoneState === undefined || phoneState === null || phoneState === "") {
        showTip("請先選擇手機告警狀態");
        return false;
    }
    if (mailState === '1') {
        if (warnMail === '' || warnMail === null || warnMail === undefined) {
            showTip("郵箱地址不能為空");
            return false;
        }
        if (!checkEmail(warnMail)) {
            showTip("郵箱地址輸入有誤");
            return false;
        }
    }
    if (phoneState === '1') {
        if (warnPhone === '' || warnPhone === null || warnPhone === undefined) {
            showTip("手機號碼不能為空");
            return false;
        }
        if (!checkPhone(warnPhone)) {
            showTip("手機號碼輸入有誤,目前僅支持台灣號碼");
            return false;
        }
    }
    if (!checkInt(mailInterval)) {
        showTip("郵箱告警間隔必須為整數");
        return false;
    }
    if (mailInterval <= 0) {
        showTip("郵箱告警間隔必須大於0");
        return false;
    }
    if (!checkInt(phoneInterval)) {
        showTip("手機告警間隔必須為整數");
        return false;
    }
    if (phoneInterval <= 0) {
        showTip("手機告警間隔必須大於0");
        return false;
    }
    if (remark.length > 255) {
        showTip("備註長度不能大於255");
    }
    $.ajax({
        url: "//itech-api.iskwen.com/api/addYuntechFlowSet",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        data: "ip=" + ip + "&warnValue=" + warnValue + "&warnMail=" + warnMail + "&warnPhone=" + warnPhone + "&mailState=" + mailState + "&phoneState=" + phoneState + "&mailInterval=" + mailInterval + "&phoneInterval=" + phoneInterval + "&remark=" + remark,
        success: function (msg) {
            if (msg.status === 0) {
                layer.msg('添加成功', {icon: 1, time: 1000}, function () {
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

function checkEmail(str) {
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}

function checkPhone(str) {
    if (RegExp(/^[0][0-9]{9}$/).test(str)) {
        return true;
    } else {
        return false;
    }
}

function checkIp(str) {
    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;//正则表达式
    if (re.test(str)) {
        if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256)
            return true;
    }
    return false;
}

function checkInt(num) {
    return num % 1 === 0
}

function checkNum(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }

}
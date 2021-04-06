layui.config({
    base: 'https://static.iskwen.com/yuntechlife/config/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['laypage', 'layer'], function () {
    var laypage = layui.laypage
        , layer = layui.layer;
    laypage.render({
        elem: 'demo0'
        , count: 50 //数据总数
    });
});
var laydate = layui.laydate;
laydate.render({
    elem: '#selectTime',
    lang: getLaydateLang(),
    range: true,
    type: 'datetime',
    min: 0,
    max: 7,
    format: 'yyyy-MM-dd HH:mm:ss'
});
var pageNumber = 1;
var sortName = 'id';
var sortOrder = 'asc';
var expressName = '';
var expressType = '0';
var takePoints = '0';
var startTime = '';
var endTime = '';
$(document).ready(function () {
    var index = layer.msg('加載中', {
        icon: 16
        , shade: 0.01
    });
    $.ajax({
        url: "//itech-api.iskwen.com/api/listExpressTaker",
        type: "POST",
        dataType: "json",
        data: "pageNumber=" + pageNumber + "&pageSize=18&sortName=" + sortName + "&sortOrder=" + sortOrder + "&expressName=" + expressName + "&expressType=" + expressType + "&takePoints=" + takePoints + "&startTime=" + startTime + "&endTime=" + endTime,
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status == 0) {
                var list = "";
                for (let i = 0; i < msg.list.length; i++) {
                    var msgTips = msg.list[i].express_name+"|"+ msg.list[i].express_num;
                    var appointmentTime = formatter(msg.list[i].appointment_time, "yyyy-MM-dd hh:mm:ss");
                    list += "<div class=\"layui-col-md2 layui-col-sm4\"><div class=\"cmdlist-container\"><a href=\"javascript:takeOrder(" + msg.list[i].id + ");\"><img src=\"https://static.iskwen.com/yuntechlife/images/expressTaker.png\" width=\"150px\" height=\"150px\"></a>" +
                        "<a href=\"javascript:takeOrder(" + msg.list[i].id + ");\"><div class=\"cmdlist-text\"><p class=\"info\">" + msgTips + "</p><p class=\"info\">" + appointmentTime + "</p><div class=\"price\"><b>" + msg.list[i].recipient_name + "</b><b>$" + (msg.list[i].amount + msg.list[i].surcharge).toFixed(2) + "</b></div></div></a></div></div>";
                }
                $("#listExpressTaker").html(list);
                if (msg.total > 0) {
                    showMsg("獲取成功,當前共有" + msg.total + "個任務");
                } else {
                    showTip("當前沒有可接的任務,待會再來看看吧~");
                }
            } else {
                showTip(msg.tip);
            }
            layer.close(index);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
})

function reload() {
    expressName = $("#expressName").val();
    expressType = $("#expressType").val();
    takePoints = $("#takePoints").val();
    var selectTime = $("#selectTime").val();
    if (selectTime != '') {
        let times = selectTime.split(" - ");
        if (times.length === 2) {
            startTime = times[0];
            endTime = times[1];
        } else {
            startTime = '';
            endTime = '';
        }
    } else {
        startTime = '';
        endTime = '';
    }
    index = layer.msg('加載中', {
        icon: 16
        , shade: 0.01
    });
    $.ajax({
        url: "//itech-api.iskwen.com/api/listExpressTaker",
        type: "POST",
        dataType: "json",
        data: "pageNumber=" + pageNumber + "&pageSize=18&sortName=" + sortName + "&sortOrder=" + sortOrder + "&expressName=" + expressName + "&expressType=" + expressType + "&takePoints=" + takePoints + "&startTime=" + startTime + "&endTime=" + endTime,
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status == 0) {
                var list = "";
                for (let i = 0; i < msg.list.length; i++) {
                    var msgTips = msg.list[i].express_name+"|"+ msg.list[i].express_num;
                    var appointmentTime = formatter(msg.list[i].appointment_time, "yyyy-MM-dd hh:mm:ss");
                    list += "<div class=\"layui-col-md2 layui-col-sm4\"><div class=\"cmdlist-container\"><a href=\"javascript:takeOrder(" + msg.list[i].id + ");\"><img src=\"https://static.iskwen.com/yuntechlife/images/expressTaker.png\" width=\"150px\" height=\"150px\"></a>" +
                        "<a href=\"javascript:takeOrder(" + msg.list[i].id + ");\"><div class=\"cmdlist-text\"><p class=\"info\">" + msgTips + "</p><p class=\"info\">" + appointmentTime + "</p><div class=\"price\"><b>" + msg.list[i].recipient_name + "</b><b>$" + (msg.list[i].amount + msg.list[i].surcharge).toFixed(2) + "</b></div></div></a></div></div>";
                }
                $("#listExpressTaker").html(list);
                if (msg.total > 0) {
                    showMsg("獲取成功,當前共有" + msg.total + "個任務");
                } else {
                    showTip("當前沒有可接的任務,待會再來看看吧~");
                }
            } else {
                showTip(msg.tip);
            }
            layer.close(index);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
}

function resetSearch() {
    $("#expressName").val('');
    $("#selectTime").val('');
    $("#takePoints").val(0);
    $("#expressType").val(0);
    reload();
}

function getMsgByType(id) {
    switch (id) {
        case 1:
            return "小型";
        case 2:
            return "中型";
        case 3:
            return "大型";
        case 4:
            return "超大型";
        default:
            return "未知";
    }
}

function getMsgByPoints(id) {
    switch (id) {
        case 1:
            return "全家-龍潭店";
        case 2:
            return "全家-四維店";
        case 3:
            return "711-雲龍店";
        case 4:
            return "宿舍郵件中心";
        case 5:
            return "i郵箱";
        case 6:
            return "文書組";
        case 7:
            return "其他";
        case 8:
            return "全家-雲大店";
        default:
            return "未知";
    }
}

function getLaydateLang() {
    switch (getLangByRequest()) {
        case "zh-TW":
            return "en";
        case "zh-CN":
            return "cn";
        case "en":
            return "en";
        default:
            return "en";
    }
}

function takeOrder(id) {
    showConfirm("温馨提示", "您確定要接此訂單嗎?", function (index) {
        $.ajax({
            url: "//itech-api.iskwen.com/api/getUserInfo",
            type: "post",
            dataType: "json",
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    layer.close(index);
                    if (msg.verifiedState === 3) {
                        layer.open({
                            type: 2,
                            anim: 2,
                            title: "確認個人資訊",
                            content: 'confirmMyInfo?id=' + id + "&realName=" + msg.actualName + "&phone=" + msg.phone + "&line=" + msg.line + "&userId=" + msg.id,
                            btn: ['確定', '關閉'],
                            btnAlign: 'c',
                            resize: false,
                            scrollbar: false,
                            anim: 1,//動畫效果
                            area: ['350px', '350px'],
                            yes: function (index2, layero) {
                                var body = layer.getChildFrame('#confirmMyInfo', index2);
                                var user_id = body.find("input[name='userId']").val();
                                var real_name = body.find("input[name='realName']").val();
                                var phone = body.find("input[name='phone']").val();
                                var line = body.find("input[name='line']").val();
                                if (user_id == '') {
                                    showTip("非法請求");
                                    return false;
                                }
                                if (real_name == '') {
                                    showTip("非法請求");
                                    return false;
                                }
                                if (phone === '') {
                                    showTip("手機號碼不能為空");
                                    return false;
                                }
                                if (!checkPhone(phone)) {
                                    showTip("手機號碼輸入格式有誤,如:0974148129");
                                    return false;
                                }
                                if (line == '') {
                                    showTip("line不能為空");
                                    return false;
                                }
                                $.ajax({
                                    url: "//itech-api.iskwen.com/api/addExpressReceive",
                                    type: "post",
                                    dataType: "json",
                                    data: "id=" + id + "&phone=" + phone + "&line=" + line,
                                    headers: {'Authorization': getCookie("token")},
                                    success: function (msg) {
                                        if (msg.status == 0) {
                                            layer.close(index2);
                                            showMsg("接單成功");
                                            reload();
                                        } else {
                                            showTip(msg.tip);
                                        }
                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        showTip("系統在開小差，請稍候再試");
                                    }
                                })
                            },
                            btn2: function (index, layero) {
                                layer.close(index);
                            }
                        });
                    } else if (msg.verifiedState === 1) {
                        showTip("您還沒有完成身份認證,不允許接單");
                        layer.close(index);
                    } else if (msg.verifiedState === 2) {
                        showTip("您身份認證仍在審核中,請耐心等待");
                        layer.close(index);
                    } else if (msg.verifiedState === 4) {
                        showTip("您身份認證資料有誤,請重新提交認證");
                    }
                } else {
                    showTip(msg.tip);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                showTip("系統在開小差，請稍候再試");
            }
        })
    });
}

function checkPhone(str) {
    if (RegExp(/^[0][0-9]{9}$/).test(str)) {
        return true;
    } else if (RegExp(/^[1][0-9]{10}$/).test(str)) {
        return true;
    } else {
        return false;
    }
}
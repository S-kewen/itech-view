$(document).ready(function () {
    $.ajax({
        url: "//itech-api.iskwen.com/api/getUserIndexInfo",
        type: "POST",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status == 0) {
                $("#todayIncome").html(msg.todayIncome.toFixed(2));
                $("#processing").html(msg.processing);//進行中
                $("#pending").html(msg.pending);//待處理
                $("#totalOrders").html(msg.totalOrders);//訂單總數
                $("#alldayIncome").html(msg.alldayIncome.toFixed(2));
                $("#todayFlow").html(msg.todayFlow.toFixed(2));
                $("#allFlow").html(msg.allFlow.toFixed(2));
                $("#warnNum").html(msg.warnNum);
                //以下進入個人資料
                $("#actualName").html(checkBlank(msg.actualName));
                $("#balance").html(toThousands(msg.balance) + '<a class="text-navy" style="margin-left:10px;" lay-href="user/recharge?byUrl=user/userIndex&byText=個人中心" lay-text="儲值中心">儲值</a>');
                $("#department").html(getDepartmentName(msg.departmentId));
                if (msg.bindingLine===1){
                    $("#line").html(checkBlank(msg.line)+"<a class=\"text-navy\" style=\"margin-left:10px;\"  href=\"javascript:cancelBindingLine();\">解除綁定</a>");
                }else if (msg.bindingLine===2){
                    $("#line").html(checkBlank(msg.line)+"<a class=\"text-navy\" style=\"margin-left:10px;\">凍結</a>");
                }else{
                    $("#line").html(checkBlank(msg.line)+"<a class=\"text-navy\" style=\"margin-left:10px;\"  href=\"javascript:bindingLine();\">前往綁定</a>");
                }
                $("#verifiedState").html(getVerifiedTip(msg.verifiedState));
                $("#className").html(checkBlank(msg.className));
                $("#email").html(checkBlank(msg.email));
                $("#phone").html(checkBlank(msg.phone));
                $(".num-jump").numScroll({
                    toThousands: true
                });
            } else {
                showTip(msg.tip);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
    $.ajax({
        url: "//itech-api.iskwen.com/api/listLoginRecord",
        type: "POST",
        dataType: "json",
        data: "pageNumber=1&pageSize=50&state=0&sortName=add_time&sortOrder=desc",
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status === 0) {
                var loginList = "";
                var login_state_tip;
                var login_time_Date;
                var date;
                var loginRecordCount = 0;
                $.each(msg.list, function (index, json) {
                    loginRecordCount++;
                    if (json.state == 1) {
                        login_state_tip = "成功";
                    } else if (json.state === 2) {
                        login_state_tip = "<font  color=\"blue\">失敗</font>";
                    } else if (json.state === 3) {
                        login_state_tip = "<font  color=\"#ff4500\">禁止</font>";
                    } else if (json.state === 4) {
                        login_state_tip = "<font  color=\"red\">凍結</font>";
                    } else {
                        login_state_tip = "<font  color=\"#20b2aa\">未知</font>";
                    }
                    if (json.add_time == '' || json.add_time == undefined) {
                        login_time_Date = "-";
                    } else {
                        login_time_Date = formatter(json.add_time, "yyyy-MM-dd hh:mm:ss");
                    }
                    loginList = loginList + "<tr><br><td>" + login_time_Date + "</td><br><td>" + json.ip + "</td><br><td><p class=\"small\">" + json.position + "</p></td><br><td>" + json.longitude + "," + json.latitude + "</td><br><td>" + login_state_tip + "</td><br></tr><br>";
                });
                $("#loginList").html(loginList);
            } else {
                showTip(msg.tip);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
    $.ajax({
        url: "//itech-api.iskwen.com/api/listMessage",
        type: "POST",
        dataType: "json",
        data: "pageNumber=1&pageSize=50&state=0&sortName=add_time&sortOrder=desc",
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status === 0) {
                var newsList = "";
                var time_Date;
                var newsCount = 0;
                var unreadTip = "";
                $.each(msg.list, function (index2, json2) {
                    newsCount++;
                    if (json2.add_time == '' || json2.add_time == undefined) {
                        time_Date = "-";
                    } else {
                        time_Date = formatter(json2.add_time, "yyyy-MM-dd hh:mm:ss");
                    }
                    if (json2.state == 1) {
                        unreadTip = "<span class=\"layui-badge-dot\"></span>";
                    } else {
                        unreadTip = "";
                    }
                    newsList = newsList + "<a href=\"#\" class=\"pull-left\"> <img alt=\"image\"class=\"img-circle\" src=\"https://static.iskwen.com/yuntechlife/images/adminAvatar.png\">" + unreadTip + "</a><div class=\"media-body \"><strong>" + json2.title + "</strong><br><small class=\"text-muted\">" + time_Date + " 來自 <strong>" + json2.sender + "</strong></small><div class=\"well\">" + json2.msg + "</div></div>";
                });
                if (newsCount >= 50) {
                    newsList = newsList + "<div style=\"text-align:center;font-size:11px\" >僅顯示近50條記錄</div>"
                }
                $("#newsList").html(newsList);
            } else {
                showTip(msg.tip);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
})

function getDepartmentName(id) {
    switch (id) {
        case 0:
            return "未認證";
        case 1:
            return "工程學院-工程科技菁英班";
        case 2:
            return "工程學院-工程科技研究所";
        case 3:
            return "工程學院-機械工程系";
        case 4:
            return "工程學院-電機工程系";
        case 5:
            return "工程學院-電子工程系";
        case 6:
            return "工程學院-環境與安全衛生工程系";
        case 7:
            return "工程學院-化學工程與材料工程系";
        case 8:
            return "工程學院-營建工程系";
        case 9:
            return "工程學院-資訊工程系";
        case 10:
            return "工程學院-其他";
        case 11:
            return "管理學院-高階管理碩士學位學程";
        case 12:
            return "管理學院-工商管理學士學位學程";
        case 13:
            return "管理學院-工業工程與管理系";
        case 14:
            return "管理學院-企業管理系";
        case 15:
            return "管理學院-資訊管理系";
        case 16:
            return "管理學院-財務金融系";
        case 17:
            return "管理學院-會計系";
        case 18:
            return "管理學院-國際管理學士學位學程";
        case 19:
            return "管理學院-創業管理碩士學位學程";
        case 20:
            return "管理學院-產業經營專業博士學位學程";
        case 21:
            return "管理學院-其他";
        case 22:
            return "設計學院-設計學研究所";
        case 23:
            return "設計學院-工業設計系";
        case 24:
            return "設計學院-視覺傳達設計系";
        case 25:
            return "設計學院-建築與室內設計系";
        case 26:
            return "設計學院-數位媒體設計系";
        case 27:
            return "設計學院-創意生活設計系";
        case 28:
            return "設計學院-其他";
        case 29:
            return "人文與科學學院-應用外語系";
        case 30:
            return "人文與科學學院-文化資產維護系";
        case 31:
            return "人文與科學學院-技術及職業教育研究所";
        case 32:
            return "人文與科學學院-漢學應用研究所";
        case 33:
            return "人文與科學學院-休閒運動研究所";
        case 34:
            return "人文與科學學院-科技法律研究所";
        case 35:
            return "人文與科學學院-材料科技研究所";
        case 36:
            return "人文與科學學院-英語菁英學程";
        case 37:
            return "人文與科學學院-師資培育中心";
        case 38:
            return "人文與科學學院-其他";
        case 39:
            return "未來學院-產業專案學士學位學程";
        case 40:
            return "未來學院-前瞻學士學位學程";
        case 41:
            return "未來學院-通識教育中心";
        case 42:
            return "未來學院-其他";
        case 43:
            return "其他-其他";
        default:
            return "未知";
    }
}

function getVerifiedTip(state) {
    switch (state) {
        case 1:
            return "未認證"
                + '<a class="text-navy" style="margin-left:10px;" lay-href="user/certification?byUrl=user/userIndex&byText=個人中心" lay-text="身份認證">前往認證</a>';
        case 2:
            return "審核中";
        case 3:
            return "已認證";
        case 4:
            return "認證失敗"
                + '<a class="text-navy" style="margin-left:10px;" lay-href="user/certification?byUrl=user/userIndex&byText=個人中心" lay-text="身份認證">重新認證</a>';
        default:
            return "未認證"
                + '<a class="text-navy" style="margin-left:10px;" lay-href="user/certification?byUrl=user/userIndex&byText=個人中心" lay-text="身份認證">前往認證</a>';
    }
}

function checkBlank(str) {
    if (str == '' || str == undefined) {
        return "-";
    } else {
        return str;
    }
}

function toThousands(num) {
    var result = '', counter = 0;
    var dot = String(num).indexOf(".");
    if (dot != -1) {
        // alert("有小数点");
        // 获取小数点后面的数字(indexOf和substring都不支持数字，所以要先转字符串才可以用)
        var dotCnt = String(num).substring(dot + 1, num.length);

        // 获取小数点前面的数字
        num = String(num).split('.')[0]
        num = (num || 0).toString();
        for (var i = num.length - 1; i >= 0; i--) {
            counter++;
            result = num.charAt(i) + result;
            if (!(counter % 3) && i != 0) {
                result = ',' + result;
            }
        }
        result = result + '.' + dotCnt;
        return result;

    } else {
        // alert("没有小数点");
        return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }
}
function cancelBindingLine() {
    showConfirm("溫馨提示", "您確定要解除綁定嗎？", function (index) {
        $.ajax({
            url: "//itech-api.iskwen.com/api/cancelBindingLine",
            type: "post",
            dataType: "json",
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    showMsg("解綁成功");
                    layer.close(index);
                    parent.layui.admin.events.refresh();
                } else {
                    showTip(msg.tip);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                showTip("系統在開小差，請稍後再試");
            }
        })
    });
}
function bindingLine() {
    showMsg("跳轉中...");
    window.open("https://lin.ee/d1T4veq");
}
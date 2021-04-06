var pageNumber = 1;
var pageSize = 20;
var last = 0;
var index = layer.msg('加載中', {
    icon: 16
    , shade: 0.01
});
$.ajax({
    url: "//itech-api.iskwen.com/api/listMessageBoard?pageNumber=" + pageNumber + "&pageSize=" + pageSize,
    type: "POST",
    dataType: "json",
    headers: {'Authorization': getCookie("token")},
    success: function (msg) {
        if (msg.status === 0) {
            var list = "";
            $.each(msg.list, function (index, json) {
                var stateTips = "";
                if (json.state === 2) {
                    stateTips += "&nbsp;&nbsp;<span class=\"layui-badge\">置頂</span>";
                }
                list += "<div class=\"media-body\"> <a href=\"javascript:;\" class=\"media-left\" style=\"float: left;\"><img src=" + json.avatar + " height=\"40px\" width=\"40px\"></a><div class=\"pad-btm\"><p><a href=\"javascript:;\" class=\"fontColor\">" + checkHtml("#"+json.id+" "+json.username) + "</a>" + stateTips + "</p><p class=\"min-font\"><span class=\"layui-breadcrumb\" style=\"visibility: visible;\"><a >" + json.system + "&nbsp;&nbsp;</a><a  >" + getTipsByDate(json.add_time) + "</a></span></p></div><p class=\"message-text\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + checkHtml(json.msg) + "</p></div>";
            });
            $("#listMessageBoard").append(list);
            layer.close(index);
            showMsg("共" + msg.total + "條留言");
            if (msg.list.length == pageSize) {
                pageNumber++;
            } else {
                last = 1;
            }
        } else {
            showTip(msg.tip);
        }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        <!--showErrorMsg(XMLHttpRequest.status);-->
        showErrorMsg("系統在開小差，請稍候再試");
    }
});
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
            if (last === 0) {
                loadMore();
            } else {
                showTip("我是有底線的~");
                return false;
            }
        }
    });
});

function loadMore() {
    var index = layer.msg('加載中', {
        icon: 16
        , shade: 0.01
    });
    $.ajax({
        url: "//itech-api.iskwen.com/api/listMessageBoard?pageNumber=" + pageNumber + "&pageSize=" + pageSize,
        type: "POST",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status === 0) {
                var list = "";
                $.each(msg.list, function (index, json) {
                    var stateTips = "";
                    if (json.state === 2) {
                        stateTips += "&nbsp;&nbsp;<span class=\"layui-badge\">置頂</span>";
                    }
                    list += "<div class=\"media-body\"> <a href=\"javascript:;\" class=\"media-left\" style=\"float: left;\"><img src=" + json.avatar + " height=\"40px\" width=\"40px\"></a><div class=\"pad-btm\"><p><a href=\"javascript:;\" class=\"fontColor\">" + checkHtml("#"+json.id+" "+json.username) + "</a>" + stateTips + "</p><p class=\"min-font\"><span class=\"layui-breadcrumb\" style=\"visibility: visible;\"><a >" + json.system + "&nbsp;&nbsp;</a><a  >" + getTipsByDate(json.add_time) + "</a></span></p></div><p class=\"message-text\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + checkHtml(json.msg) + "</p></div>";
                });
                if (msg.list.length === pageSize) {
                    pageNumber++;
                } else {
                    last = 1;
                }
                $("#listMessageBoard").append(list);
                layer.close(index);
            } else {
                showTip(msg.tip);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
}

function refreshList() {
    pageNumber = 1;
    pageSize = 20;
    last = 0;
    index = layer.msg('加載中', {
        icon: 16
        , shade: 0.01
    });
    $.ajax({
        url: "//itech-api.iskwen.com/api/listMessageBoard?pageNumber=" + pageNumber + "&pageSize=" + pageSize,
        type: "POST",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status === 0) {
                var list = "";
                $.each(msg.list, function (index, json) {
                    var stateTips = "";
                    if (json.state === 2) {
                        stateTips += "&nbsp;&nbsp;<span class=\"layui-badge\">置頂</span>";
                    }
                    list += "<div class=\"media-body\"> <a href=\"javascript:;\" class=\"media-left\" style=\"float: left;\"><img src=" + json.avatar + " height=\"40px\" width=\"40px\"></a><div class=\"pad-btm\"><p><a href=\"javascript:;\" class=\"fontColor\">" + checkHtml("#"+json.id+" "+json.username) + "</a>" + stateTips + "</p><p class=\"min-font\"><span class=\"layui-breadcrumb\" style=\"visibility: visible;\"><a >" + json.system + "&nbsp;&nbsp;</a><a  >" + getTipsByDate(json.add_time) + "</a></span></p></div><p class=\"message-text\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + checkHtml(json.msg) + "</p></div>";
                });
                $("#listMessageBoard").html(list);
                layer.close(index);
                if (msg.list.length == pageSize) {
                    pageNumber++;
                } else {
                    last = 1;
                }
                showMsg('我已經' + msg.total + "層了~");
            } else {
                showTip(msg.tip);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            <!--showErrorMsg(XMLHttpRequest.status);-->
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
}

function post() {
    const content = $("#content").val();
    var contents = [];
    let anonymous = 1;
    $('input[type=checkbox]:checked').each(function () {
        contents.push($(this).val());
    });
    if (contents[0] === 'on') {
        anonymous = 2;
    }
    if (content === '') {
        showTip("留言內容不能為空");
        return false;
    }
    if (content.trim() === '') {
        showTip("留言內容不能為空");
        return false;
    }
    if (content.length > 255) {
        showTip("留言長度不能大於255");
        return false;
    }
    $.ajax({
        url: "//itech-api.iskwen.com/api/addMessageBoard",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        data: "content=" + content + "&anonymous=" + anonymous,
        success: function (msg) {
            if (msg.status === 0) {
                // $("#content").val("");
                refreshList();
            } else {
                showTip(msg.tip);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
}

function getTipsByDate(date) {
    date=date.replace(".000+0000", "+00:00");
    var s = Math.abs((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (s < 1) {
        return "剛剛";
    }
    if (s < 60) {//不到一分鐘
        return s.toFixed(0) + "秒前";
    } else if (s < 60 * 60) {//不到1小時
        return (s / 60).toFixed(0) + "分鐘前";
    } else if (s < 60 * 60 * 24) {//不到1天
        return (s / (60 * 60)).toFixed(0) + "小時前";
    } else if (s < 60 * 60 * 24 * 30) {//不到一個月
        return (s / (60 * 60 * 24)).toFixed(0) + "天前";
    } else {//超過一個月
        return (s / (60 * 60 * 24 * 30)).toFixed(0) + "月前";
    }
}

function checkHtml(Word) {
    Word = Word.replace(/</g, "&lt;");
    Word = Word.replace(/>/g, "&gt;");
    return Word;
}
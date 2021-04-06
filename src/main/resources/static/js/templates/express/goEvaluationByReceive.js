layui.config({
    base: 'https://static.iskwen.com/yuntechlife/config/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'set']);
layui.use('rate', function () {
    var rate = layui.rate;
    var ins1 = rate.render({
        elem: '#markInput',  //绑定元素
        text: true,
        setText: function (value) { //自定义文本的回调
            var arrs = {
                '1': '非常不滿意'
                , '2': '不滿意'
                , '3': '一般'
                , '4': '滿意'
                , '5': '非常滿意'
            };
            this.span.text(arrs[value] || (value + "星"));
        }
    });
    rate.render({
        elem: '#markInput'
        , choose: function (value) {
            $("#mark").val(value);
        }
    });
});

function post() {
    const id = getUrlValue("id");
    const mark = $("#mark").val();
    var contents = [];
    let anonymous = 1;
    $('input[type=checkbox]:checked').each(function () {
        contents.push($(this).val());
    });
    if (contents[0] === 'on') {
        anonymous = 2;
    }
    const comments = $("#comments").val();
    if (id === '' || id === undefined || id === null) {
        showTip("非法請求");
        return false;
    }
    if (mark === '' || mark === undefined || mark === null) {
        showTip("請先點亮評分");
        return false;
    }
    if (mark <= 0) {
        showTip("請先點亮評分");
        return false;
    }
    if (mark > 5) {
        showTip("評分不能大於5");
        return false;
    }
    if (comments.length > 255) {
        showTip("評語長度不能大於255");
        return false;
    }
    $.ajax({
        url: "//itech-api.iskwen.com/api/addExpressScore",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        data: "id=" + id + "&type=1" + "&anonymous=" + anonymous + "&score=" + mark + "&comments=" + comments,
        success: function (msg) {
            if (msg.status === 0) {
                layer.msg('評價成功', {icon: 1, time: 1000}, function () {
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
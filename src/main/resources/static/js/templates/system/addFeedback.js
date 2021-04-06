var form = layui.form;
form.render();

function post() {
    const type = $("#type").val();
    var contents = [];
    let anonymous = 1;
    $('input[type=checkbox]:checked').each(function () {
        contents.push($(this).val());
    });
    if (contents[0] === 'on') {
        anonymous = 2;
    }
    const content = $("#content").val();
    if (type === '') {
        showTip("請先選擇反饋類型");
        return false;
    }
    if (content === '') {
        showTip("請先輸入反饋內容");
        return false;
    }
    if (content.length > 255) {
        showTip("備註長度不能大於255");
        return false;
    }
    $.ajax({
        url: "//itech-api.iskwen.com/api/addFeedback",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        data: "type=" + type + "&anonymous=" + anonymous + "&content=" + content,
        success: function (msg) {
            if (msg.status === 0) {
                layer.msg('提交成功,感謝您的反饋~', {icon: 1, time: 1000}, function () {
                    parent.layui.admin.events.closeThisTabs();
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
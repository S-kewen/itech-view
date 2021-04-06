var form = layui.form;
form.render();
var upload = layui.upload,
    element = layui.element;
element.init();
layui.use(['upload', 'form'], function () {
    var $ = layui.jquery, upload = layui.upload;
    var form = layui.form;
    form.on('select-befor(id)', function (data) {
        $("#createAuthentication").find("dl").css("max-height", "200px")
    });
    upload.render({
        elem: '#upload'
        , url: '//itech-api.iskwen.com/api/uploadCertificatePhoto?authorization=' + getCookie("token")
        , accept: 'file' //普通文件
        , multiple: false
        , drag: true
        , size: 1024 * 1024 * 10
        , exts: '|bmp|jpg|png|jpeg'
        , done: function (res) {
            $("#upload").attr('disabled', false);
            $("#upload").text('上傳檔案');
            layer.closeAll('loading'); //关闭loading
            if (res.status == 0) {
                $("#photoUrl").val(res.url);
                showMsg(res.tip);
            } else {
                showTip(res.tip);
            }
        }
        , before: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            $("#upload").attr('disabled', true);
            $("#upload").text('初始化');
            layer.load(); //上传loading
        }, progress: function (percent) {
            $("#upload").text('上傳中:' + percent + '%');
            $("#upload").attr('disabled', true);
            if (percent == 100) {
                $("#upload").text('處理中');
            }
        }
        , error: function (res, index, upload) {
            $("#upload").attr('disabled', false);
            $("#upload").text('上傳檔案');
            layer.closeAll('loading'); //关闭loading
        }
    });
});

function post() {
    const studentId = $("#studentId").val();
    const realName = $("#realName").val();
    const department = $("#department").val();
    const className = $("#className").val();
    const photoUrl = $("#photoUrl").val();
    const remark = $("#remark").val();
    if (studentId === '') {
        showTip("學號不能為空");
        return false;
    }
    if (realName === '') {
        showTip("真實姓名不能為空");
        return false;
    }
    if (department === '' || department === null || department === undefined) {
        showTip("請先選擇您的系所");
        return false;
    }
    if (className === '') {
        showTip("請先輸入您當前的班級");
        return false;
    }
    if (photoUrl === '') {
        showTip("請先上傳學生證正面照片");
        return false;
    }
    if (remark.length > 255) {
        showTip("備註長度不能大於255");
        return false;
    }
    $.ajax({
        url: "//itech-api.iskwen.com/api/addCertificate",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        data: "studentId=" + studentId + "&realName=" + realName + "&department=" + department + "&className=" + className + "&photoUrl=" + photoUrl + "&remark=" + remark,
        success: function (msg) {
            if (msg.status === 0) {
                layer.msg('提交成功,請耐心等待相關人員審核~', {icon: 1, time: 1000}, function () {
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
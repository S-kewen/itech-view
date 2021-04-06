function post() {
    const oldPassword = $("#oldPassword").val();
    const password = $("#password").val();
    const repassword = $("#repassword").val();
    if (oldPassword === '') {
        showTip("請先輸入當前密碼");
        return false;
    }
    if (password === '') {
        showTip("新密碼不能為空");
        return false;
    }
    if (password.length < 8) {
        showTip("新密碼長度不能小於8");
        return false;
    }
    if (repassword === '') {
        showTip("新密碼不能為空");
        return false;
    }
    if (repassword.length < 8) {
        showTip("新密碼長度不能小於8");
        return false;
    }
    if (password !== repassword) {
        showTip("新密碼輸入不一致");
        return false;
    }
    if (password === oldPassword) {
        showTip("新密碼不能與當前密碼相同");
        return false;
    }
    $.ajax({
        url: "//itech-api.iskwen.com/api/modifyPassword",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        data: "oldPassword=" + hex_md5(oldPassword) + "&newPassword=" + hex_md5(password),
        success: function (msg) {
            if (msg.status === 0) {
                $("#oldPassword").val("");
                $("#password").val("");
                $("#repassword").val("");
                showMsg("修改成功");
                showConfirm("溫馨提示", "修改成功,是否現在重新登錄？", function (index) {
                    showNoticeSucc("正在退出登錄...");
                    top.location.href = '/logout';
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
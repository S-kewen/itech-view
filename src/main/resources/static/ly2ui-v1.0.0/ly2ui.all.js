var mouseoverIndex = 0;
$(".ly2-tips").mouseover(function () {
    let text = $(this).attr("ly2-tips-text");
    let points = $(this).attr("ly2-tips-points");
    let color = $(this).attr("ly2-tips-color");
    if (text === undefined) {
        text = "..."
    }
    if (points === undefined) {
        points = "1"
    }
    if (color === undefined) {
        color = "#000"
    }
    mouseoverIndex = layer.tips(text, this, {
        time: 0,
        tips: [points, color]
    })
}).mouseleave(function () {
    layer.close(mouseoverIndex)
});

function showTip(title, time) {
    layer.msg(title, {
        time: time,
        anim: 6,
        icon: 5
    })
}

function showSimpleTip(title, time) {
    layer.msg(title, {
        time: time
    })
}

function showRockTip(title, time) {
    layer.msg(title, {
        time: time
    })
}

function showMsg(title, time) {
    showMsgCore(title, 1, time)
}

function showErrorMsg(title, time) {
    showMsgCore(title, 2, time)
}

function showMsgCore(title, ico, time) {
    layer.msg(title, {
        time: time,
        icon: ico,
        isOutAnim: false
    })
}

function showConfirm(title, content, callback) {
    layer.confirm(content, {
        icon: 3,
        title: title == '' ? "温馨提示" : title
    }, callback, function (index) {
        layer.close(index)
    })
}

function showMsgConfirm(tip, callback) {
    layer.msg(tip, {
        time: 0,
        btn: ['确定'],
        yes: callback
    })
}

document.write("<link rel=\"stylesheet\" href=\"https://static.iskwen.com/toastr-v2.1.4/toastr.css\">");
document.write("<script src=\"https://static.iskwen.com/toastr-v2.1.4/toastr.js\"></script>");

function showNoticeInfo(title, text, position, timeout) {
    if (position === undefined || position === "" || position === null) {
        position = 7
    }
    if (timeout === undefined || timeout === "" || timeout === null) {
        timeout = 3000
    }
    if (text === undefined || text === "" || text === null) {
        text = title;
        title = ""
    }
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": getPositionClass(position),
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": timeout,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    toastr.info(text, title, toastr.options)
}

function showNoticeError(title, text, position, timeout) {
    if (position === undefined || position === "" || position === null) {
        position = 7
    }
    if (timeout === undefined || timeout === "" || timeout === null) {
        timeout = 3000
    }
    if (text === undefined || text === "" || text === null) {
        text = title;
        title = ""
    }
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": getPositionClass(position),
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": timeout,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    toastr.error(text, title, toastr.options)
}

function showNoticeSucc(title, text, position, timeout) {
    if (position === undefined || position === "" || position === null) {
        position = 7
    }
    if (timeout === undefined || timeout === "" || timeout === null) {
        timeout = 3000
    }
    if (text === undefined || text === "" || text === null) {
        text = title;
        title = ""
    }
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": getPositionClass(position),
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": timeout,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    toastr.success(text, title, toastr.options)
}

function showNoticeWarn(title, text, position, timeout) {
    if (position === undefined || position === "" || position === null) {
        position = 7
    }
    if (timeout === undefined || timeout === "" || timeout === null) {
        timeout = 3000
    }
    if (text === undefined || text === "" || text === null) {
        text = title;
        title = ""
    }
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": getPositionClass(position),
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": timeout,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    toastr.warning(text, title, toastr.options)
}

function getPositionClass(position) {
    switch (position) {
        case 1:
            return "toast-top-right";
        case 2:
            return "toast-bottom-right";
        case 3:
            return "toast-bottom-left";
        case 4:
            return "toast-top-left";
        case 5:
            return "toast-top-full-width";
        case 6:
            return "toast-bottom-full-width";
        case 7:
            return "toast-top-center";
        case 8:
            return "toast-bottom-center"
    }
}
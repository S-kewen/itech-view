var grid = $("#dataTable").bootstrapTable({
    url: "//itech-api.iskwen.com/api/listMessage",
    height: document.body.clientHeight - 40,
    method: "post",
    dataType: "json",
    contentType: "application/x-www-form-urlencoded",
    pagination: true,//是否显示分页（*）
    pageList: [10, 20, 50, 100, 500, 1000, '所有'], ////可供选择的每页的行数（*）
    pageSize: 20,
    pageNumber: 1,
    queryParamsType: "undefined",//改寫請求參數
    sortName: 'id',//默認按id排序
    sortOrder: 'asc',//默認從大到小
    cache: true,
    // detailView: true,//顯示詳細數據按鈕
    // detailFormatter: function (index, row) {
    //     var detailStr="";
    //     detailStr+="id:"+row.id;
    //     return detailStr;
    // },
    // cardView: true,//默認為card視圖，適用於移動端
    showColumns: true,//列篩選
    showToggle: true,//視圖切換按鈕
    // showPaginationSwitch: true,//隱藏、顯示分頁按鈕
    showExport: false,//導出
    striped: true,//行黑白顏色間隔
    uniqueId: 'id',
    undefinedText: "-",
    sidePagination: "server", //服务端请求
    ajaxOptions: {
        headers: {"Authorization": getCookie("token")}
    },
    columns: [{
        field: 'id',
        title: '編號',
        align: 'center',
        sortable: true,
        width: 50
    }, {
        field: 'sender',
        title: '類型',
        align: 'center',
        sortable: true,
        width: 150
    }, {
        field: 'title',
        title: '標題',
        align: 'center',
        sortable: true,
        width: 150
    }, {
        field: 'msg',
        title: '內容',
        align: 'left',
        sortable: true,
        width: 450
    }, {
        field: 'state',
        title: '狀態',
        align: 'center',
        sortable: true,
        width: 50,
        formatter: function (value, row, index) {
            if (value == 1) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(1,\"state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>未讀</a>";
            } else if (value == 2) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(2,\"state_" + row.id + "\")' class='btn btn-primary btn-rounded btn-xs'>已讀</a>";
            } else {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(-1,\"state_" + row.id + "\")' class='btn btn-default btn-rounded btn-xs'>未知</a>";
            }
        }
    }, {
        field: 'add_time',
        title: '创建时间',
        align: 'center',
        sortable: true,
        width: 150,
        formatter: function (value, row, index) {
            if (value == '' || value == undefined) {
                return '-';
            }
            return formatter(value, "yyyy-MM-dd hh:mm:ss");
        }
    },
        {
            field: '',
            title: '操作',
            width: 150,
            formatter: function (value, row, index) {
                var result = "";
                if (row.state == 1) {
                    result = "<button class='layui-btn  layui-btn-xs layui-btn-normal' onClick='javascript:readMessage(" + row.id + ")'>確認已讀</button>"
                } else {
                    result = "<button class='layui-btn layui-btn-xs layui-btn-disabled' disabled>確認已讀</button>"
                }
                return result + "<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteMessage(" + row.id + ")'>删除</button>";
            }
        }], onLoadSuccess: function (msg) {
        if (msg.status !== 0) {
            showTip(msg.tip);
        }
        document.querySelector(".fixed-table-body").addEventListener("scroll", function () {
            layer.closeAll('tips');
        });
    }, onLoadError: function (status) {
        showErrorMsg("http response error,code:" + status + "");
    },
    queryParams: queryParams
});

function reload() {
    grid.bootstrapTable('refresh');
    updateAllReadButtonState();
}

function queryParams(params) {
    var keyword = $("#keyword").val();
    if (keyword != '') {
        params.keyword = keyword;
    }
    var state = $("#state").val();
    if (state != '') {
        params.state = state;
    } else {
        params.state = 0;
    }
    var selectTime = $("#selectTime").val();
    if (selectTime != '') {
        (selectTime);
        let times = selectTime.split(" - ");
        if (times.length === 2) {
            params.startTime = times[0];
            params.endTime = times[1];
        }
    }
    params.timestamp = Date.parse(new Date()).toString().substr(0, 10);
    return params;
}

function resetSearch() {
    $("#keyword").val('');
    $("#state").val(0);
    $("#selectTime").val('');
    grid.bootstrapTable('resetFormSearch');
    updateAllReadButtonState();
}

function deleteMessage(id) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        showConfirm("溫馨提示", "您確定要刪除該記錄嗎？", function (index) {
            $.ajax({
                url: "//itech-api.iskwen.com/api/deleteMessage",
                type: "post",
                dataType: "json",
                data: "id=" + id,
                headers: {'Authorization': getCookie("token")},
                success: function (msg) {
                    if (msg.status == 0) {
                        showMsg("刪除成功")
                        layer.close(index);
                        reload();
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
}

function stateTip(type, id) {
    if (type == 1) {
        layer.tips('看完就趕緊點已讀啊,撒小!!!', '#' + id, {
            tips: 1
        });
    } else if (type == 2) {
        layer.tips('已閱~!', '#' + id, {
            tips: 1
        });
    } else if (type == -1) {
        layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
            tips: 1
        });
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

function updateAllReadButtonState() {
    $.ajax({
        url: "//itech-api.iskwen.com/api/getUnreadMessageCount",
        type: "post",
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status == 0) {
                if (msg.unreadMessageCount > 0) {
                    $("#allRead").attr('disabled', false);
                    $("#unreadMessageCount").html(msg.unreadMessageCount);
                } else {
                    $("#unreadMessageCount").html(0);
                    $("#allRead").attr('disabled', true);
                }
                if (msg.unreadMessageCount > 99) {
                    parent.$('a[layadmin-event="message"] .layui-badge').text('99+');
                } else {
                    if (msg.unreadMessageCount > 0) {
                        parent.$('a[layadmin-event="message"] .layui-badge').text(msg.unreadMessageCount);
                    } else {
                        parent.$('a[layadmin-event="message"] .layui-badge').text(0);
                    }
                }
            } else {
                showTip(msg.tip);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showErrorMsg("系統在開小差，請稍候再試");
        }
    });
}

function allReadMessage() {
    showConfirm("温馨提示", "您确定要將全部消息設置為已讀嗎？", function (index) {
        $.ajax({
            url: "//itech-api.iskwen.com/api/allReadMessage",
            type: "post",
            dataType: "json",
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    showMsg("成功閱讀了" + msg.count + "條消息");
                    updateAllReadButtonState();
                    layer.close(index);
                    reload();
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

function readMessage(id) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        $.ajax({
            url: "//itech-api.iskwen.com/api/readMessage",
            type: "post",
            dataType: "json",
            data: "id=" + id,
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    showMsg("設置成功");
                    updateAllReadButtonState();
                    reload();
                } else {
                    showTip(msg.tip);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                showTip("系統在開小差，請稍候再試");
            }
        })
    }
}

$(document).ready(function () {
    updateAllReadButtonState();
})
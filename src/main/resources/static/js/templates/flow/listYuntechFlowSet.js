var grid = $("#dataTable").bootstrapTable({
    url: "//itech-api.iskwen.com/api/listYuntechFlowSet",
    height: document.body.clientHeight - 40,
    method: "post",
    dataType: "json",
    contentType: "application/x-www-form-urlencoded",
    pagination: true,//是否顯示分頁（*）
    pageList: [10, 20, 50, 100, 500, 1000, '所有'], ////可供選擇的每頁的行數（*）
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
    sidePagination: "server", //服務端請求
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
        field: 'ip',
        title: 'ip',
        align: 'center',
        sortable: true,
        width: 140,
        formatter: function (value, row, index) {
            return "<button type='button' class='btn btn-info btn-rounded btn-xs' data-clipboard-text='" + value + "'>" + value + "</button>";
        }
    }, {
        field: 'warn_value',
        title: '告警值/Gb',
        align: 'center',
        sortable: true,
        width: 70,
        formatter: function (value, row, index) {
            if (value == undefined) {
                return '-';
            }
            return value.toFixed(4);
        }
    }, {
        field: 'warn_mail',
        title: '告警郵箱',
        align: 'center',
        sortable: true,
        width: 200,
        formatter: function (value, row, index) {
            if (value == '' || value == undefined) {
                return '-';
            } else {
                return value;
            }
        }
    }, {
        field: 'warn_phone',
        title: '告警手機',
        align: 'center',
        sortable: true,
        width: 200,
        formatter: function (value, row, index) {
            if (value == '' || value == undefined) {
                return '-';
            } else {
                return value;
            }
        }
    }, {
        field: 'add_time',
        title: '創建時間',
        align: 'center',
        sortable: true,
        width: 150,
        formatter: function (value, row, index) {
            if (value == '' || value == undefined) {
                return '-';
            }
            return formatter(value, "yyyy-MM-dd hh:mm:ss");
        }
    }, {
        field: 'state',
        title: '狀態',
        align: 'center',
        sortable: true,
        width: 50,
        formatter: function (value, row, index) {
            if (value == 1) {
                return "<buttom id='state_" + row.id + "' onClick='javascript:stateTip(1,\"state_" + row.id + "\")' class='btn btn-primary btn-rounded btn-xs'>正常</a>";
            } else if (value == 2) {
                return "<buttom id='state_" + row.id + "' onClick='javascript:stateTip(2,\"state_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs'>停止</a>";
            } else if (value == 3) {
                return "<buttom id='state_" + row.id + "' onClick='javascript:stateTip(3,\"state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>異常</a>";
            } else {
                return "<buttom id='state_" + row.id + "' onClick='javascript:stateTip(-1,\"state_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs'>未知</a>";
            }
        }
    },
        {
            field: '',
            title: '操作',
            width: 250,
            formatter: function (value, row, index) {
                let result = "";
                if (row.state == 1) {
                    result += "<button class='layui-btn  layui-btn-xs layui-btn-primary' onClick='javascript:changeState(" + row.id + ",2)'>停用</button>";
                } else if (row.state == 2) {
                    result += "<button class='layui-btn layui-btn-xs layui-btn' onClick='javascript:changeState(" + row.id + ",1)'>啟用</button>";
                } else if (row.state == 3) {
                    result += "<button class='layui-btn layui-btn-xs layui-btn-danger' onClick='javascript:changeState(" + row.id + ",1)'>解禁</button>";
                } else {
                    result += "<button class='layui-btn layui-btn-xs layui-btn' onClick='javascript:changeState(" + row.id + ",1)'>啟用</button>";
                }
                result += "<button class='layui-btn  layui-btn-xs layui-btn-warm' lay-href='flow/editYuntechFlowSet?byUrl=flow/listYuntechFlowSet&byText=監控管理&id=" + row.id + "' lay-text='編輯監控'>編輯</button>" + "<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteYuntechFlowSet(" + row.id + ")'>刪除</button>";
                return result;
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
}

function changeState(id, state) {
    if (id == '') {
        showTip("請選擇壹條記錄");
    } else {
        $.ajax({
            url: "//itech-api.iskwen.com/api/changeYuntechFlowSetState",
            type: "post",
            dataType: "json",
            data: "id=" + id + "&state=" + state,
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    if (state === 1) {
                        showMsg("啟用成功");
                    } else {
                        showMsg("停用成功");
                    }
                    reload();
                } else {
                    showTip(msg.tip);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                showTip("系統在開小差，請稍後再試");
            }
        })
    }
}

function deleteYuntechFlowSet(id) {
    if (id == '') {
        showTip("請選擇壹條記錄");
    } else {
        showConfirm("溫馨提示", "您確定要刪除該記錄嗎？", function (index) {
            $.ajax({
                url: "//itech-api.iskwen.com/api/deleteYuntechFlowSet",
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
                    showTip("系統在開小差，請稍後再試");
                }
            })
        });

    }
}

function stateTip(type, id) {
    if (type == 1) {
        layer.tips('沒日沒夜的爬啊爬~', '#' + id, {
            tips: 1
        });
    } else if (type == 2) {
        layer.tips('舒服了舒服了~!', '#' + id, {
            tips: 1
        });
    } else if (type == 3) {
        layer.tips('配置錯誤~!', '#' + id, {
            tips: 1
        });
    } else if (type == -1) {
        layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
            tips: 1
        });
    }
}

var clipboard = new ClipboardJS('.btn');
clipboard.on('success', function (e) {
    showMsg("複製成功");
});
clipboard.on('error', function (e) {
    showTip("複製失敗");
});

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
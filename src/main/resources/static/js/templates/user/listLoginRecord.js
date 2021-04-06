var grid = $("#dataTable").bootstrapTable({
    url: "//itech-api.iskwen.com/api/listLoginRecord",
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
        field: 'ip',
        title: 'ip',
        align: 'center',
        sortable: true,
        width: 100,
        formatter: function (value, row, index) {
            return "<button type='button' class='btn btn-info btn-rounded btn-xs ly2-tips' ly2-tips-text='點擊複製' data-clipboard-text='" + value + "'>" + value + "</button>";
        }
    }, {
        field: 'position',
        title: '詳細信息',
        align: 'center',
        sortable: true,
        width: 450
    }, {
        field: 'longitude',
        title: '經度',
        align: 'center',
        sortable: true,
        width: 100,
        formatter: function (value, row, index) {
            if (value == '' || value == undefined) {
                return '-';
            } else {
                return value.toFixed(4);
            }
        }
    }, {
        field: 'latitude',
        title: '緯度',
        align: 'center',
        sortable: true,
        width: 100,
        formatter: function (value, row, index) {
            if (value == '' || value == undefined) {
                return '-';
            } else {
                return value.toFixed(4);
            }
        }
    }, {
        field: 'system',
        title: '系統',
        align: 'center',
        sortable: true,
        width: 100
    }, {
        field: 'browser',
        title: '客戶端',
        align: 'center',
        sortable: true,
        width: 100
    },
        {
            field: 'state',
            title: '狀態',
            align: 'center',
            sortable: true,
            width: 50,
            formatter: function (value, row, index) {
                if (value == 1) {
                    return "<button id='state_" + row.id + "' onClick='javascript:stateTip(1,\"state_" + row.id + "\")' class='btn btn-primary btn-rounded btn-xs'>成功</button>";
                }
                if (value == 2) {
                    return "<button id='state_" + row.id + "' onClick='javascript:stateTip(2,\"state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>失敗</button>";
                } else {
                    return "<button id='state_" + row.id + "' onClick='javascript:stateTip(-1,\"state_" + row.id + "\")' class='btn btn-default btn-rounded btn-xs'>未知</button>";
                }
            }
        }, {
            field: 'add_time',
            title: '登錄時間',
            align: 'center',
            sortable: true,
            width: 180,
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
            formatter: function (value, row, index) {
                return "<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteLoginRecord(" + row.id + ")'>刪除</button>";
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

function deleteLoginRecord(id) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        showConfirm("溫馨提示", "您確定要刪除該記錄嗎？", function (index) {
            $.ajax({
                url: "//itech-api.iskwen.com/api/deleteLoginRecord",
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
        layer.tips('登錄成功~', '#' + id, {
            tips: 1
        });
    } else if (type == 2) {
        layer.tips('密碼輸入錯誤~!', '#' + id, {
            tips: 1
        });
    } else if (type == 3) {
        layer.tips('被禁止登錄~!', '#' + id, {
            tips: 1
        });
    } else if (type == 4) {
        layer.tips('存在重大安全隱患~!', '#' + id, {
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
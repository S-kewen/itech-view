var grid = $("#dataTable").bootstrapTable({
    url: "//itech-api.iskwen.com/api/listYuntechExpress",
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
        field: 'express_name',
        title: '物流名稱',
        align: 'center',
        sortable: true,
        width: 200,
        formatter: function (value, row, index) {
            return "<button type='button' class='btn btn-info btn-rounded btn-xs' data-clipboard-text='" + value + "'>" + value + "</button>";
        }
    }, {
        field: 'express_num',
        title: '物流單號',
        align: 'center',
        sortable: true,
        width: 200,
        formatter: function (value, row, index) {
            return "<button type='button' class='btn layui-btn-primary btn-rounded btn-xs' data-clipboard-text='" + value + "'>" + value + "</button>";
        }
    }, {
        field: 'region',
        title: '區域',
        align: 'center',
        sortable: true,
        width: 100,
        formatter: function (value, row, index) {
            if (value == 1) {
                return "<button id='region_" + row.id + "' onClick='javascript:regionTip(1,\"region_" + row.id + "\")' class='btn btn-primary btn-rounded btn-xs'>A區</button>";
            } else if (value == 2) {
                return "<button id='region_" + row.id + "' onClick='javascript:regionTip(2,\"region_" + row.id + "\")' class='btn btn-info btn-rounded btn-xs'>B區</button>";
            } else if (value == 3) {
                return "<button id='region_" + row.id + "' onClick='javascript:regionTip(3,\"region_" + row.id + "\")' class='btn layui-btn-primary btn-rounded btn-xs'>C區</button>";
            } else if (value == 4) {
                return "<button id='region_" + row.id + "' onClick='javascript:regionTip(4,\"region_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs'>D區</button>";
            } else if (value == 5) {
                return "<button id='region_" + row.id + "' onClick='javascript:regionTip(5,\"region_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>E區</button>";
            } else if (value == 6) {
                return "<button id='region_" + row.id + "' onClick='javascript:regionTip(6,\"region_" + row.id + "\")' class='btn btn-default btn-rounded btn-xs'>F區</button>";
            } else if (value == 7) {
                return "<button id='region_" + row.id + "' onClick='javascript:regionTip(7,\"region_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs' style='background-color: #808695'>G區</button>";
            } else {
                return "<button id='region_" + row.id + "' onClick='javascript:regionTip(-1,\"region_" + row.id + "\")' class='btn btn-default btn-rounded btn-xs'>未知</button>";
            }

        }
    }, {
        field: 'dormitory',
        title: '宿舍號',
        align: 'center',
        sortable: true,
        width: 100
    }, {
        field: 'addressee',
        title: '收件人',
        align: 'center',
        sortable: true,
        width: 100
    }, {
        field: 'state',
        title: '狀態',
        align: 'center',
        sortable: true,
        width: 50,
        formatter: function (value, row, index) {
            if (value == 1) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(1,\"state_" + row.id + "\")' class='btn btn-primary btn-rounded btn-xs'>待簽收</button>";
            }
            if (value == 2) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(2,\"state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>已簽收</button>";
            } else {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(-1,\"state_" + row.id + "\")' class='btn btn-default btn-rounded btn-xs'>未知</button>";
            }
        }
    }, {
        field: 'receive_time',
        title: '簽收時間',
        align: 'center',
        sortable: true,
        width: 180,
        formatter: function (value, row, index) {
            if (value == '' || value == undefined || value == null) {
                return '-';
            }
            return formatter(value, "yyyy-MM-dd hh:mm:ss");
        }
    }, {
        field: 'receipt_time',
        title: '登記時間',
        align: 'center',
        sortable: true,
        width: 180,
        formatter: function (value, row, index) {
            if (value == '' || value == undefined) {
                return '-';
            }
            return formatter(value, "yyyy-MM-dd hh:mm:ss");
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
    var region = $("#region").val();
    if (region != '') {
        params.region = region;
    } else {
        params.region = 0;
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
    $("#region").val(0);
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
        layer.tips('還沒被領走~', '#' + id, {
            tips: 1
        });
    } else if (type == 2) {
        layer.tips('已經被簽收了~!', '#' + id, {
            tips: 1
        });
    } else if (type == -1) {
        layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
            tips: 1
        });
    }
}

function regionTip(type, id) {
    if (type == 1) {
        layer.tips('A區~', '#' + id, {
            tips: 1
        });
    } else if (type == 2) {
        layer.tips('B區~!', '#' + id, {
            tips: 1
        });
    } else if (type == 3) {
        layer.tips('C區~!', '#' + id, {
            tips: 1
        });
    } else if (type == 4) {
        layer.tips('D區~!', '#' + id, {
            tips: 1
        });
    } else if (type == 5) {
        layer.tips('E區~!', '#' + id, {
            tips: 1
        });
    } else if (type == 6) {
        layer.tips('F區~!', '#' + id, {
            tips: 1
        });
    } else if (type == 7) {
        layer.tips('G區~!', '#' + id, {
            tips: 1
        });
    } else if (type == -1) {
        layer.tips('咳,這是一個神秘的地方~', '#' + id, {
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
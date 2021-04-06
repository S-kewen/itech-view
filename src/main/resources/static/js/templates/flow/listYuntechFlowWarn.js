var grid = $("#dataTable").bootstrapTable({
    url: "//itech-api.iskwen.com/api/listYuntechFlowWarn",
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
        title: '預設值/Gb',
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
        field: 'real_value',
        title: '實際值/Gb',
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
        width: 150,
        formatter: function (value, row, index) {
            if (value == '' || value == undefined) {
                return '-';
            } else {
                return value;
            }
        }
    },
        {
            field: 'mail_state',
            title: '狀態',
            align: 'center',
            sortable: true,
            width: 50,
            formatter: function (value, row, index) {
                if (value == 1) {
                    return "<button id='mail_state_" + row.id + "' onClick='javascript:stateTip(1,\"mail_state_" + row.id + "\")' class='btn btn-primary btn-rounded btn-xs'>成功</a>";
                } else if (value == 2) {
                    return "<button id='mail_state_" + row.id + "' onClick='javascript:stateTip(2,\"mail_state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>失敗</a>";
                } else if (value == 3) {
                    return "<button id='mail_state_" + row.id + "' onClick='javascript:stateTip(3,\"mail_state_" + row.id + "\")' class='btn layui-btn-primary btn-rounded btn-xs'>未啟用</a>";
                } else if (value == 4) {
                    return "<button id='mail_state_" + row.id + "' onClick='javascript:stateTip(4,\"mail_state_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs'>餘額不足</a>";
                } else if (value == 5) {
                    return "<button id='mail_state_" + row.id + "' onClick='javascript:stateTip(5,\"mail_state_" + row.id + "\")' class='btn btn-info btn-rounded btn-xs'>待響應</a>";
                } else if (value == 6) {
                    return "<button id='mail_state_" + row.id + "' onClick='javascript:stateTip(6,\"mail_state_" + row.id + "\")' class='btn layui-btn-primary btn-rounded btn-xs'>未請求</a>";
                } else if (value == 7) {
                    return "<button id='mail_state_" + row.id + "' onClick='javascript:stateTip(7,\"mail_state_" + row.id + "\")' class='btn btn-info btn-rounded btn-xs'>待驗證</a>";
                } else {
                    return "<button id='mail_state_" + row.id + "' onClick='javascript:stateTip(-1,\"mail_state_" + row.id + "\")' class='btn btn-default btn-rounded btn-xs'>未知</a>";
                }
            }
        }, {
            field: 'warn_phone',
            title: '告警手機',
            align: 'center',
            sortable: true,
            width: 150,
            formatter: function (value, row, index) {
                if (value == '' || value == undefined) {
                    return '-';
                } else {
                    return value;
                }
            }
        }, {
            field: 'phone_state',
            title: '狀態',
            align: 'center',
            sortable: true,
            width: 50,
            formatter: function (value, row, index) {
                if (value == 1) {
                    return "<button id='phone_state_" + row.id + "' onClick='javascript:stateTip(1,\"phone_state_" + row.id + "\")' class='btn btn-primary btn-rounded btn-xs'>成功</a>";
                } else if (value == 2) {
                    return "<button id='phone_state_" + row.id + "' onClick='javascript:stateTip(2,\"phone_state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>失敗</a>";
                } else if (value == 3) {
                    return "<button id='phone_state_" + row.id + "' onClick='javascript:stateTip(3,\"phone_state_" + row.id + "\")' class='btn layui-btn-primary btn-rounded btn-xs'>未啟用</a>";
                } else if (value == 4) {
                    return "<button id='phone_state_" + row.id + "' onClick='javascript:stateTip(4,\"phone_state_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs'>餘額不足</a>";
                } else if (value == 5) {
                    return "<button id='phone_state_" + row.id + "' onClick='javascript:stateTip(5,\"phone_state_" + row.id + "\")' class='btn btn-info btn-rounded btn-xs'>待響應</a>";
                } else if (value == 6) {
                    return "<button id='phone_state_" + row.id + "' onClick='javascript:stateTip(6,\"phone_state_" + row.id + "\")' class='btn layui-btn-primary btn-rounded btn-xs'>未請求</a>";
                } else if (value == 7) {
                    return "<button id='phone_state_" + row.id + "' onClick='javascript:stateTip(7,\"phone_state_" + row.id + "\")' class='btn btn-info btn-rounded btn-xs'>待驗證</a>";
                } else {
                    return "<button id='phone_state_" + row.id + "' onClick='javascript:stateTip(-1,\"phone_state_" + row.id + "\")' class='btn btn-default btn-rounded btn-xs'>未知</a>";
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
            width: 200,
            formatter: function (value, row, index) {
                if (row.mail_state === 5 || row.phone_state === 5) {
                    return "<button class='layui-btn layui-btn-xs layui-btn-disabled' disabled>删除</button>";
                } else {
                    return "<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteYuntechFlowWarn(" + row.id + ")'>删除</button>";
                }

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

function deleteYuntechFlowWarn(id) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        showConfirm("溫馨提示", "您確定要刪除該記錄嗎？", function (index) {
            $.ajax({
                url: "//itech-api.iskwen.com/api/deleteYuntechFlowWarn",
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
        layer.tips('發送成功~', '#' + id, {
            tips: 1
        });
    } else if (type == 2) {
        layer.tips('發送失敗,請檢查告警設置~!', '#' + id, {
            tips: 1
        });
    } else if (type == 3) {
        layer.tips('未開啟該告警~', '#' + id, {
            tips: 1
        });
    } else if (type == 4) {
        layer.tips('不給錢當然選擇罷工啦~', '#' + id, {
            tips: 1
        });
    } else if (type == 5) {
        layer.tips('稍等片刻,系統正在處理~', '#' + id, {
            tips: 1
        });
    } else if (type == 6) {
        layer.tips('還不需要發送~', '#' + id, {
            tips: 1
        });
    } else if (type == 7) {
        layer.tips('稍等片刻,系統正在驗證~', '#' + id, {
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
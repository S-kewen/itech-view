var grid = $("#dataTable").bootstrapTable({
    url: "//itech-api.iskwen.com/api/listTransaction",
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
        field: 'title',
        title: '交易名稱',
        align: 'center',
        sortable: true,
        width: 450
    }, {
        field: 'amount',
        title: '交易金額',
        align: 'center',
        sortable: true,
        width: 80,
        formatter: function (value, row, index) {
            if (value == '' || value == undefined) {
                return '-';
            } else {
                return value.toFixed(2);
            }
        }
    },
        {
            field: 'commission',
            title: '手續費',
            align: 'center',
            sortable: true,
            width: 80,
            formatter: function (value, row, index) {
                if (value == '' || value == undefined) {
                    return '-';
                } else {
                    return value.toFixed(2);
                }
            }
        }, {
            field: 'actual_amount',
            title: '實際金額',
            align: 'center',
            sortable: true,
            width: 80,
            formatter: function (value, row, index) {
                if (value == '' || value == undefined) {
                    return '-';
                } else {
                    return value.toFixed(2);
                }
            }
        }, {
            field: 'balance',
            title: '餘額',
            align: 'center',
            sortable: true,
            width: 80,
            formatter: function (value, row, index) {
                if (value == null || value == undefined) {
                    return '0.00';
                } else {
                    return value.toFixed(2);
                }
            }
        }, {
            field: 'type',
            title: '交易類型',
            align: 'center',
            sortable: true,
            width: 70,
            formatter: function (value, row, index) {
                if (value == 1) {
                    return "<button id='type_" + row.id + "' onClick='javascript:typeTip(1,\"type_" + row.id + "\")' class='btn btn-primary btn-rounded btn-xs'>儲值</a>";
                } else if (value == 2) {
                    return "<button id='type_" + row.id + "' onClick='javascript:typeTip(2,\"type_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>支出</a>";
                } else if (value == 3) {
                    return "<button id='type_" + row.id + "' onClick='javascript:typeTip(3,\"type_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs'>收入</a>";
                } else if (value == 4) {
                    return "<button id='type_" + row.id + "' onClick='javascript:typeTip(4,\"type_" + row.id + "\")' class='btn layui-btn-primary btn-rounded btn-xs'>退款</a>";
                } else {
                    return "<button id='type_" + row.id + "' onClick='javascript:typeTip(-1,\"type_" + row.id + "\")' class='btn btn-default btn-rounded btn-xs'>未知</a>";
                }
            }
        }, {
            field: 'state',
            title: '狀態',
            align: 'center',
            sortable: true,
            width: 70,
            formatter: function (value, row, index) {
                if (value == 1) {
                    return "<button id='state_" + row.id + "' onClick='javascript:stateTip(1," + row.type + ",\"state_" + row.id + "\")' class='btn btn-primary btn-rounded btn-xs'>成功</a>";
                } else if (value == 2) {
                    return "<button id='state_" + row.id + "' onClick='javascript:stateTip(2," + row.type + ",\"state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>失敗</a>";
                } else if (value == 3) {
                    return "<button id='state_" + row.id + "' onClick='javascript:stateTip(3," + row.type + ",\"state_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs'>進行中</a>";
                } else {
                    return "<button id='state_" + row.id + "' onClick='javascript:stateTip(-1," + row.type + ",\"state_" + row.id + "\")' class='btn btn-default btn-rounded btn-xs'>未知</a>";
                }
            }
        }, {
            field: 'add_time',
            title: '交易時間',
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
                return "<button class='layui-btn  layui-btn-xs layui-btn-danger' onClick='javascript:deleteTransaction(" + row.id + ")'>刪除</button>";
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
    var type = $("#type").val();
    if (type != '') {
        params.type = type;
    } else {
        params.type = 0;
    }
    var selectTime = $("#selectTime").val();
    if (selectTime != '') {
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
    $("#type").val(0);
    $("#selectTime").val('');
    grid.bootstrapTable('resetFormSearch');
}

function deleteTransaction(id) {
    if (id == '') {
        showTip("請選擇一條記錄");
    } else {
        showConfirm("溫馨提示", "您確定要刪除該記錄嗎？", function (index) {
            $.ajax({
                url: "//itech-api.iskwen.com/api/deleteTransaction",
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

function stateTip(state, type, id) {
    if (type == 1) {
        if (state == 1) {
            layer.tips('已經到賬啦~', '#' + id, {
                tips: 1
            });
        } else if (state == 2) {
            layer.tips('系統在開小差,趕緊聯繫客服吧~', '#' + id, {
                tips: 1
            });
        } else if (state == 3) {
            layer.tips('系統正在馬不停蹄的計算中ing~', '#' + id, {
                tips: 1
            });
        } else if (state == -1) {
            layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
                tips: 1
            });
        }
    } else if (type == 2) {
        if (state == 1) {
            layer.tips('滔滔江水一去不復返~', '#' + id, {
                tips: 1
            });
        } else if (state == 2) {
            layer.tips('咦,又出BUG了?', '#' + id, {
                tips: 1
            });
        } else if (state == 3) {
            layer.tips('依依不捨的回頭看了你一眼~', '#' + id, {
                tips: 1
            });
        } else if (state == -1) {
            layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
                tips: 1
            });
        }
    } else if (type == 3) {
        if (state == 1) {
            layer.tips('哇,又一桶~', '#' + id, {
                tips: 1
            });
        } else if (state == 2) {
            layer.tips('咦,錢好像又飛走了?', '#' + id, {
                tips: 1
            });
        } else if (state == 3) {
            layer.tips('正在路上~', '#' + id, {
                tips: 1
            });
        } else if (state == -1) {
            layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
                tips: 1
            });
        }
    } else if (type == -1) {
        layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
            tips: 1
        });
    }
}

function typeTip(type, id) {
    if (type == 1) {
        layer.tips('儲值卡儲值~', '#' + id, {
            tips: 1
        });
    } else if (type == 2) {
        layer.tips('支付響應的服務費用~', '#' + id, {
            tips: 1
        });
    } else if (type == 3) {
        layer.tips('勞動的收穫~', '#' + id, {
            tips: 1
        });
    } else if (type == 4) {
        layer.tips('服務費退回~', '#' + id, {
            tips: 1
        });
    } else if (type == -1) {
        layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
            tips: 1
        });
    }
}
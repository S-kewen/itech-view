var grid = $("#dataTable").bootstrapTable({
    url: "//itech-api.iskwen.com/api/listExpressTakerReceive",
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
        title: '任務名稱',
        align: 'center',
        sortable: true,
        width: 100,
        formatter: function (value, row, index) {
            return "<button class='btn btn-primary btn-rounded btn-xs' data-clipboard-text='" + value + "'>" + value + "</a>";
        }
    }, {
        field: 'express_num',
        title: '任務單號',
        align: 'center',
        sortable: true,
        width: 100,
        formatter: function (value, row, index) {
            return "<button class='btn btn-info btn-rounded btn-xs' data-clipboard-text='" + value + "'>" + value + "</a>";
        }
    }, {
        field: 'amount',
        title: '金額',
        align: 'center',
        sortable: true,
        width: 50,
        formatter: function (value, row, index) {
            if (value == undefined) {
                return '-';
            }
            return value.toFixed(2);
        }
    }, {
        field: 'commission',
        title: '手續費',
        align: 'center',
        sortable: true,
        width: 50,
        formatter: function (value, row, index) {
            if (value == undefined) {
                return '-';
            }
            return value.toFixed(2);
        }
    }, {
        field: 'surcharge',
        title: '打賞',
        align: 'center',
        sortable: true,
        width: 70,
        formatter: function (value, row, index) {
            if (value == undefined) {
                return '-';
            }
            return value.toFixed(2);
        }
    }, {
        field: 'actual_amount',
        title: '實際收益',
        align: 'center',
        sortable: true,
        width: 70,
        formatter: function (value, row, index) {
            return value.toFixed(2);
        }
    }, {
        field: 'remark',
        title: '備註',
        align: 'center',
        sortable: true,
        width: 50,
        formatter: function (value, row, index) {
            if (value === '' || value === undefined || value === null) {
                return "<button class='layui-btn layui-btn-xs layui-btn-radius layui-btn-disabled'>查看</button>"
            } else {
                return "<button onClick=\"layer.alert('" + value + "');\" class='btn layui-btn-primary btn-rounded btn-xs'>查看</button>"
            }
        }
    }, {
        field: 'state',
        title: '狀態',
        align: 'center',
        sortable: true,
        width: 50,
        formatter: function (value, row, index) {
            if (value == 2) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(2,\"state_" + row.id + "\")' class='btn btn-info btn-rounded btn-xs'>待出發</a>";
            } else if (value == 3) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(3,\"state_" + row.id + "\")' class='btn btn-warning btn-rounded btn-xs'>待確認</a>";
            } else if (value == 4) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(4,\"state_" + row.id + "\")' class='btn btn-primary btn-rounded btn-xs'>待評價</a>";
            } else if (value == 5) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(5,\"state_" + row.id + "\")' class='btn layui-btn-primary btn-rounded btn-xs'>已完成</a>";
            } else if (value == 6) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(6,\"state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>已取消</a>";
            } else if (value == 7) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(7,\"state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>待處理</a>";
            } else if (value == 9) {
                return "<button id='state_" + row.id + "' onClick='javascript:stateTip(9,\"state_" + row.id + "\")' class='btn btn-danger btn-rounded btn-xs'>已處理</a>";
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
            formatter: function (value, row, index) {
                if (row.state == 2) {
                    return "<button class='layui-btn  layui-btn-xs layui-btn-normal' lay-href='express/seeExpressTakerByReceive?id=" + row.express_taker_id + "' lay-text='查看訂單資訊'>查看</button>"
                        + "<button class='layui-btn layui-btn-xs layui-btn-warm' onClick='javascript:goReceipt(" + row.id + ")'>出發</button>"
                        + "<button class='layui-btn layui-btn-xs layui-btn-danger' onClick='javascript:cancelExpressTaker(" + row.id + ")'>取消</button>";
                } else if (row.state == 3) {
                    return "<button class='layui-btn  layui-btn-xs layui-btn-normal' lay-href='express/seeExpressTakerByReceive?id=" + row.express_taker_id + "' lay-text='查看訂單資訊'>查看</button>"
                } else if (row.state == 4) {
                    return "<button class='layui-btn  layui-btn-xs layui-btn-normal' lay-href='express/seeExpressTakerByReceive?id=" + row.express_taker_id + "' lay-text='查看訂單資訊'>查看</button>"
                        + "<button class='layui-btn layui-btn-xs layui-btn-primary btn-rounded' lay-href='express/goEvaluationByReceive?byUrl=express/listExpressTakerReceive&byText=接單記錄&id=" + row.express_taker_id + "' lay-text='評價'>評價</button>"
                } else if (row.state == 5) {
                    return "<button class='layui-btn  layui-btn-xs layui-btn-normal' lay-href='express/seeExpressTakerByReceive?id=" + row.express_taker_id + "' lay-text='查看訂單資訊'>查看</button>"
                        + "<button class='layui-btn layui-btn-xs layui-btn-danger' onClick='javascript:deleteExpressTaker(" + row.id + ")'>刪除</button>";
                } else if (row.state == 6) {
                    return "<button class='layui-btn layui-btn-xs layui-btn-danger' onClick='javascript:deleteExpressTaker(" + row.id + ")'>刪除</button>";
                } else if (row.state == 7) {
                    return "<button class='layui-btn  layui-btn-xs layui-btn-normal' lay-href='express/seeExpressTakerByReceive?id=" + row.express_taker_id + "' lay-text='查看訂單資訊'>查看</button>"
                        + "<button class='layui-btn layui-btn-xs layui-btn-danger' onClick='javascript:goLine()'>聯繫客服</button>";
                } else if (row.state == 8) {
                    return "<button class='layui-btn  layui-btn-xs layui-btn-normal' lay-href='express/seeExpressTakerByReceive?id=" + row.express_taker_id + "' lay-text='查看訂單資訊'>查看</button>"
                        + "<button class='layui-btn layui-btn-xs layui-btn-danger' onClick='javascript:deleteExpressTaker(" + row.id + ")'>刪除</button>";
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

function goReceipt(id) {
    if (id == '') {
        showTip("請選擇一條記錄");
        return false;
    }
    showConfirm("温馨提示", "您確定要現在出發嗎?", function (index) {
        $.ajax({
            url: "//itech-api.iskwen.com/api/changeExpressReceiveState",
            type: "post",
            dataType: "json",
            data: "id=" + id + "&state=3",
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    showMsg("現在出發~")
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

function deleteExpressTaker(id) {
    if (id == '') {
        showTip("請選擇一條記錄");
        return false;
    }
    showConfirm("温馨提示", "您确定要删除该訂單吗？", function (index) {
        $.ajax({
            url: "//itech-api.iskwen.com/api/deleteExpressReceive",
            type: "post",
            dataType: "json",
            data: "id=" + id,
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    showMsg("删除成功")
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

function cancelExpressTaker(id) {
    if (id == '') {
        showTip("請選擇一條記錄");
        return false;
    }
    showConfirm("温馨提示", "您確定要取消該訂單?", function (index) {
        $.ajax({
            url: "//itech-api.iskwen.com/api/changeExpressReceiveState",
            type: "post",
            dataType: "json",
            data: "id=" + id + "&state=6",
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    showMsg("取消訂單成功")
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

function logisticsTypeTip(type, id) {
    if (type == 1) {
        layer.tips('大小：長寬高均不超過20cm<br>重量：小於2kg', '#' + id, {
            tips: 1
        });
    } else if (type == 2) {
        layer.tips('大小：長寬高均不超過40cm<br>重量：小於4kg', '#' + id, {
            tips: 1
        });
    } else if (type == 3) {
        layer.tips('大小：長寬高均不超過1m<br>重量：小於10kg', '#' + id, {
            tips: 1
        });
    } else if (type == 4) {
        layer.tips('大小：長寬高均不超過2m<br>重量：小於20kg', '#' + id, {
            tips: 1
        });
    } else if (type == -1) {
        layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
            tips: 1
        });
    }
}

function logisticsPointsTip(type, id) {
    if (type == 1) {
        layer.tips('地址：640雲林縣斗六市龍潭北路2號', '#' + id, {
            tips: 1
        });
    } else if (type == 2) {
        layer.tips('地址：640雲林縣斗六市四維路132號', '#' + id, {
            tips: 1
        });
    } else if (type == 3) {
        layer.tips('地址：640雲林縣斗六市龍潭路14之1號', '#' + id, {
            tips: 1
        });
    } else if (type == 4) {
        layer.tips('地址：學生宿舍郵件處理中心', '#' + id, {
            tips: 1
        });
    } else if (type == 5) {
        layer.tips('地址：學生餐廳入口旁郵箱櫃', '#' + id, {
            tips: 1
        });
    } else if (type == 6) {
        layer.tips('地址：雲科文書組', '#' + id, {
            tips: 1
        });
    } else if (type == 7) {
        layer.tips('詳情地址請查看備註欄說明~', '#' + id, {
            tips: 1
        });
    } else if (type == 8) {
        layer.tips('地址：640雲林縣斗六市中山路573號', '#' + id, {
            tips: 1
        });
    } else if (type == -1) {
        layer.tips('系統一臉懵逼的搖了搖頭~', '#' + id, {
            tips: 1
        });
    }
}

function stateTip(type, id) {
    if (type == 1) {
        layer.tips('耐心等待有緣人接單吧~', '#' + id, {
            tips: 1
        });
    } else if (type == 2) {
        layer.tips('對方已經等您很久了,趕快與對方聯繫吧~', '#' + id, {
            tips: 1
        });
    } else if (type == 3) {
        layer.tips('出門注意安全哦~', '#' + id, {
            tips: 1
        });
    } else if (type == 4) {
        layer.tips('如果覺得他(她)還不錯的話,就給他(她)點滿小星星吧~', '#' + id, {
            tips: 1
        });
    } else if (type == 5) {
        layer.tips('訂單已經完成啦,收獲滿滿~', '#' + id, {
            tips: 1
        });
    } else if (type == 6) {
        layer.tips('訂單被取消了,嗚嗚嗚~', '#' + id, {
            tips: 1
        });
    } else if (type == 7) {
        layer.tips('訂單出問題了,趕緊聯繫客服處理吧~!', '#' + id, {
            tips: 1
        });
    } else if (type == 9) {
        layer.tips('客服已介入處理,相關結果請查閱郵件通知~', '#' + id, {
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

function goLine() {
    showMsg("跳轉中...");
    window.open("https://lin.ee/d1T4veq");
}

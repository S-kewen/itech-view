var grid = $("#dataTable").bootstrapTable({
    url: "//itech-api.iskwen.com/api/listYuntechFlow",
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
            return "<button type='button' class='btn btn-info btn-rounded btn-xs' data-clipboard-text='" + value + "'>" + value + "</button>";
        }
    }, {
        field: 'ext_up',
        title: '校外上傳/Gb',
        align: 'center',
        sortable: true,
        width: 100,
        formatter: function (value, row, index) {
            if (value == undefined) {
                return '-';
            }
            return value.toFixed(4);
        }
    }, {
        field: 'ext_down',
        title: '校外下載/Gb',
        align: 'center',
        sortable: true,
        width: 100,
        formatter: function (value, row, index) {
            if (value == undefined) {
                return '-';
            }
            return value.toFixed(4);
        }
    }, {
        field: 'ins_up',
        title: '校內上傳/Gb',
        align: 'center',
        sortable: true,
        width: 100,
        formatter: function (value, row, index) {
            if (value == undefined) {
                return '-';
            }
            return value.toFixed(4);
        }
    }, {
        field: 'ins_down',
        title: '校內下載/Gb',
        align: 'center',
        sortable: true,
        width: 100,
        formatter: function (value, row, index) {
            if (value == undefined) {
                return '-';
            }
            return value.toFixed(4);
        }
    }, {
        field: 'ratio',
        title: 'U/D',
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
        field: 'flow',
        title: '總流量/Gb',
        align: 'center',
        sortable: true,
        width: 100,
        formatter: function (value, row, index) {
            if (value == undefined) {
                return '-';
            }
            return value.toFixed(4);
        }
    }, {
        field: 'add_time',
        title: '統計時間',
        align: 'center',
        sortable: true,
        width: 180,
        formatter: function (value, row, index) {
            if (value == '' || value == undefined) {
                return '-';
            }
            return formatter(value, "yyyy-MM-dd hh:mm:ss");
        }
    }, {
        field: 'user_id',
        title: '容量',
        align: 'center',
        width: 80,
        formatter: function (value, row, index) {
            var color;
            var progressValue = (row.flow / 0.1).toFixed(2);
            if (row.flow == undefined) {
                return '<div class="layui-progress" lay-showPercent="true"> <div class="layui-progress-bar layui-bg-red" lay-percent="0%"></div></div>';
            }
            if (progressValue > 80) {
                color = "red";
            } else if (progressValue > 60) {
                color = "orange";
            } else if (progressValue > 40) {
                color = "green";
            } else if (progressValue > 20) {
                color = "blue";
            } else {
                color = "black";
            }
            return "<div class='layui-progress'> <div class='layui-progress-bar layui-bg-" + color + "' lay-percent=\"" + progressValue + "%\"></div><span class='layui-progress-text'>" + (row.flow / 0.1).toFixed(2) + "%</span></div>";
        }
    }, {
        field: '',
        title: '操作',
        width: 80,
        formatter: function (value, row, index) {
            return "<button class='layui-btn layui-btn-xs layui-btn-normal' lay-href='flow/seeYuntechFlowRunCharts?ip=" + row.ip + "' lay-text='分析[" + row.ip + "]'>分析</button>";
        }
    }], onLoadSuccess: function (msg) {
        if (msg.status !== 0) {
            showTip(msg.tip);
        } else {
            var element = layui.element;
            element.init();
        }
    }, onColumnSwitch: function (field, checked) {
        var element = layui.element;
        element.init();
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
    var type = $("#type").val();
    if (type != '') {
        params.type = type;
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
    $("#type").val(1);
    $("#selectTime").val('');
    grid.bootstrapTable('resetFormSearch');
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
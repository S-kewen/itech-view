var source_pv = ['瀏覽量PV', 0, 0, 0, 0, 0, 0, 0];
var source_cv = ['點擊量CV', 0, 0, 0, 0, 0, 0, 0];
var source_uv = ['訪客數UV', 0, 0, 0, 0, 0, 0, 0];
var source_avt = ['均訪時AVT', 0, 0, 0, 0, 0, 0, 0];
var userTotal = [0, 0, 0, 0, 0, 0, 0];
var loginTotal = [0, 0, 0, 0, 0, 0, 0];
var new_visitor = 0;
var old_visitor = 0;
var phone_pv = 0;
var pc_pv = 0;
var nowDate = getDay(0);
$.ajax({
    url: "//itech-api.iskwen.com/api/listAdvert",
    type: "POST",
    dataType: "json",
    async: false,
    headers: {'Authorization': getCookie("token")},
    success: function (msg) {
        if (msg.status === 0) {
            var list = "";
            $.each(msg.list, function (index, json) {
                var styleMsg = getStyleByColor(json.color);
                var jumpMsg = "";
                if (json.jump_type === 1) {
                    jumpMsg = "lay-href=\"" + json.url + "\" lay-text=\"" + json.lay_text + "\"";
                } else {
                    jumpMsg = "href=\"" + json.url + "\" target=\"_blank\"";
                }
                list += "<div><a " + jumpMsg + "class=\"" + styleMsg + "\" >" + json.title + "</a></div>";
            });
            $("#listAdvert").html(list);
        } else {
            showTip(msg.tip);
        }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        <!--showErrorMsg(XMLHttpRequest.status);-->
        showErrorMsg("系統在開小差，請稍候再試");
    }
});
$(document).ready(function () {
    $.when(
        $.ajax({
            url: "//itech-api.iskwen.com/api/getConsoleInfo",
            type: "POST",
            dataType: "json",
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    $("#todayFlow").html(msg.todayFlow.toFixed(2));
                    $("#todayIncome").html(msg.todayIncome.toFixed(2));
                    $("#unCompletedNum").html(msg.unCompletedNum);
                    $("#completedNum").html(msg.completedNum);
                    $("#unLogisticsNum").html(msg.unExpressNum);
                    $("#logisticsNum").html(msg.expressNum);
                    if (msg.verifiedState == 2) {
                        $('#verified_ico').attr('class', 'layui-icon layui-icon-loading');
                        $("#verified_tip").html("審核中");
                        $('#verifiedHref').removeAttr('lay-href');
                        $('#verifiedHref').attr('onclick', 'layer.tips(\'審核中\', this, {tips:[4, \'#2F4056\'] });');
                    } else if (msg.verifiedState == 3) {
                        $('#verified_ico').attr('class', 'layui-icon layui-icon-ok-circle');
                        $("#verified_tip").html("已認證");
                        $('#verifiedHref').removeAttr('lay-href');
                        $('#verifiedHref').attr('onclick', 'layer.tips(\'已認證\', this, {tips:[4, \'#0B9B8D\'] });');
                    } else if (msg.verifiedState == 4) {
                        $('#verified_ico').attr('class', 'layui-icon layui-icon-close');
                        $("#verified_tip").html("重新認證");
                    } else {
                        $('#verified_ico').attr('class', 'layui-icon layui-icon-flag');
                        $("#verified_tip").html("身份認證");
                    }
                    $(".num-jump").numScroll({
                        toThousands: true
                    });
                } else {
                    showTip(msg.tip);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                <!--showErrorMsg(XMLHttpRequest.status);-->
                showErrorMsg("系統在開小差，請稍候再試");
            }
        }),
        $.ajax({
            url: "//itech-api.iskwen.com/api/listNotice",
            type: "POST",
            dataType: "json",
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status === 0) {
                    var list = "";
                    $.each(msg.list, function (index, json) {
                        var stateTips = "";
                        if (json.top === 2) {
                            stateTips += "&nbsp;&nbsp;<span class=\"layui-badge\">置頂</span>";
                        }
                        list += "<div class=\"layuimini-notice\"><div class=\"layuimini-notice-title\">" + json.title + stateTips + "</div> <div class=\"layuimini-notice-extra\">" + formatter(json.show_time, "yyyy-MM-dd hh:mm:ss")
                            + "</div><div class=\"layuimini-notice-url\">" + json.url + "</div><div class=\"layuimini-notice-href-type\" style=\"display:none;\">" + json.jump_type + "</div><div class=\"layuimini-notice-lay-text\" style=\"display:none;\">" + json.lay_text + "</div><div class=\"layuimini-notice-content layui-hide\">"
                            + json.content + "</div></div>";
                    });
                    $("#listNotice").append(list);
                } else {
                    showTip(msg.tip);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                <!--showErrorMsg(XMLHttpRequest.status);-->
                showErrorMsg("系統在開小差，請稍候再試");
            }
        }),
        $.ajax({
            url: "//itech-api.iskwen.com/api/getEchartsInfoByStatisticalReport?nowDate=" + nowDate,
            type: "POST",
            dataType: "json",
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    for (let i = 0; i < 7; i++) {
                        let info = getListsInfoBydate(msg.list, addDay(nowDate, -i));
                        source_pv[7 - i] = info.pv_count;
                        source_cv[7 - i] = info.visit_count;
                        source_uv[7 - i] = info.visitor_count;
                        source_avt[7 - i] = info.avg_visit_time;
                        if (i === 0) {
                            pc_pv = (info.pv_count * info.bounce_ratio * 0.01).toFixed(0);
                            phone_pv = (info.pv_count - pc_pv).toFixed(0);
                            new_visitor = info.new_visitor_count;
                            old_visitor = info.visitor_count - info.new_visitor_count;
                        }
                    }
                } else {
                    showTip(msg.tip);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                <!--showErrorMsg(XMLHttpRequest.status);-->
                showErrorMsg("系統在開小差，請稍候再試");
            }
        }), $.ajax({
            url: "//itech-api.iskwen.com/api/getEchartsInfoByUserCount?nowDate=" + nowDate,
            type: "POST",
            dataType: "json",
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    for (let i = 0; i < msg.list.length; i++) {
                        userTotal[6 - i] = msg.list[i].count;
                    }
                } else {
                    showTip(msg.tip);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                <!--showErrorMsg(XMLHttpRequest.status);-->
                showErrorMsg("系統在開小差，請稍候再試");
            }
        }), $.ajax({
            url: "//itech-api.iskwen.com/api/getEchartsInfoByLoginCount?nowDate=" + nowDate,
            type: "POST",
            dataType: "json",
            headers: {'Authorization': getCookie("token")},
            success: function (msg) {
                if (msg.status == 0) {
                    for (let i = 0; i < msg.list.length; i++) {
                        loginTotal[6 - i] = msg.list[i].count;
                    }
                } else {
                    showTip(msg.tip);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                <!--showErrorMsg(XMLHttpRequest.status);-->
                showErrorMsg("系統在開小差，請稍候再試");
            }
        })
    ).then(function () {
        layui.config({
            base: 'https://static.iskwen.com/yuntechlife/config/' //静态资源所在路径
        }).use(['echarts'], function () {
            var echarts = layui.echarts;
            /**
             * 查看公告信息
             **/
            $('body').on('click', '.layuimini-notice', function () {
                var title = $(this).children('.layuimini-notice-title').text(),
                    noticeTime = $(this).children('.layuimini-notice-extra').text(),
                    url = $(this).children('.layuimini-notice-url').text(),
                    content = $(this).children('.layuimini-notice-content').html(),
                    hrefType = $(this).children('.layuimini-notice-href-type').html(),
                    layText = $(this).children('.layuimini-notice-lay-text').html();
                var html = '<div style="padding:15px 20px; text-align:justify; line-height: 22px;border-bottom:1px solid #e2e2e2;background-color: #2f4056;color: #ffffff">\n' +
                    '<div style="text-align: center;margin-bottom: 20px;font-weight: bold;border-bottom:1px solid #718fb5;padding-bottom: 5px"><h4 class="text-danger">' + title + '</h4></div>\n' +
                    '<div style="font-size: 12px">' + content + '</div>\n' +
                    '</div>\n';
                if (url !== null && url !== undefined && url !== '') {
                    var btns = ['查看', '取消'];
                } else {
                    var btns = ['確定', '取消'];
                }
                parent.layer.open({
                    type: 1,
                    title: '系統公告' + '<span style="float: right;right: 1px;font-size: 12px;color: #b1b3b9;margin-top: 1px">' + noticeTime + '</span>',
                    area: '300px;',
                    shade: 0.8,
                    shadeClose: true,
                    anim: 2,
                    id: 'layuimini-notice',
                    btn: btns,
                    btnAlign: 'c',
                    moveType: 1,
                    content: html,
                    success: function (layero, index) {
                        if (url !== null && url !== undefined && url !== '') {
                            if (hrefType === '1') {
                                var btn = layero.find('.layui-layer-btn');
                                btn.find('.layui-layer-btn0').attr({
                                    'lay-href': url,
                                    'lay-text': layText
                                });
                            } else {
                                var btn = layero.find('.layui-layer-btn');
                                btn.find('.layui-layer-btn0').attr({
                                    'href': url,
                                    'target': '_blank'
                                });
                            }
                        }
                    }
                });
            });

            /**
             * 報表1
             */
            var echartsRecords = echarts.init(document.getElementById('echarts-webflow'), 'walden');
            var optionRecords = {
                legend: {},
                tooltip: {
                    trigger: 'axis',
                    showContent: true,
                    alwaysShowContent: false,
                    hideDelay: 3000
                },
                dataset: {
                    source: [
                        ['product', getDayAndWeek(-6), getDayAndWeek(-5), getDayAndWeek(-4), getDayAndWeek(-3), getDayAndWeek(-2), '昨天', '今天'],
                        source_pv,
                        source_cv,
                        source_uv,
                        source_avt
                    ]
                },
                xAxis: {type: 'category'},
                yAxis: {gridIndex: 0},
                grid: {top: '55%'},
                series: [
                    {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                    {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                    {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                    {type: 'line', smooth: true, seriesLayoutBy: 'row'},
                    {
                        type: 'pie',
                        id: 'pie',
                        radius: '30%',
                        center: ['50%', '25%'],
                        label: {
                            formatter: '{b}: {@今天} ({d}%)'
                        },
                        encode: {
                            itemName: 'product',
                            value: '今天',
                            tooltip: '今天'
                        }
                    }
                ]
            };
            echartsRecords.on('updateAxisPointer', function (event) {
                var xAxisInfo = event.axesInfo[0];
                if (xAxisInfo) {
                    var dimension = xAxisInfo.value + 1;
                    echartsRecords.setOption({
                        series: {
                            id: 'pie',
                            label: {
                                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                            },
                            encode: {
                                value: dimension,
                                tooltip: dimension
                            }
                        }
                    });
                }
            });
            /*
             * 報表2
             */
            var echarts_source = echarts.init(document.getElementById('echarts-source'), 'light');
            var option_source = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    data: ['移動端', 'PC端', '新訪客', '老訪客']
                },
                series: [
                    {
                        name: '訪問類型',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '30%'],

                        label: {
                            position: 'inner'
                        },
                        labelLine: {
                            show: true
                        },
                        data: [
                            {value: phone_pv, name: '移動端'},
                            {value: pc_pv, name: 'PC端'}
                        ]
                    },
                    {
                        name: '訪客類型',
                        type: 'pie',
                        radius: ['40%', '55%'],
                        label: {
                            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            backgroundColor: '#eee',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 16,
                                    lineHeight: 33
                                },
                                per: {
                                    color: '#eee',
                                    backgroundColor: '#334455',
                                    padding: [2, 4],
                                    borderRadius: 2
                                },
                            }
                        },
                        data: [
                            {value: old_visitor, name: '老訪客'},
                            {value: new_visitor, name: '新訪客'}
                        ]
                    }
                ]
            };
            /*
             * 报表3
             */
            var echarts_register = echarts.init(document.getElementById('echarts-register'), 'light');
            var colors = ['#5793f3', '#d14a61', '#675bba'];
            var option_register = {
                color: colors,
                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data: ['用戶總數', '累計登錄數']
                },
                grid: {
                    top: 70,
                    bottom: 50
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: colors[1]
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return '累計登錄數  ' + params.value
                                        + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                }
                            }
                        },
                        data: [getDayAndWeek(-6), getDayAndWeek(-5), getDayAndWeek(-4), getDayAndWeek(-3), getDayAndWeek(-2), '昨天', '今天']
                    },
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: colors[0]
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return '用戶總數  ' + params.value
                                        + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                                }
                            }
                        },
                        data: [getDayAndWeek(-6), getDayAndWeek(-5), getDayAndWeek(-4), getDayAndWeek(-3), getDayAndWeek(-2), '昨天', '今天']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '用戶總數',
                        type: 'line',
                        xAxisIndex: 1,
                        smooth: true,
                        data: userTotal
                    },
                    {
                        name: '累計登錄數',
                        type: 'line',
                        smooth: true,
                        data: loginTotal
                    }
                ]
            };
            echartsRecords.setOption(optionRecords);
            echarts_source.setOption(option_source);
            echarts_register.setOption(option_register);
            window.onresize = function () {
                echartsRecords.resize();
                echarts_source.resize();
                echarts_register.resize();
            }
            window.onload = function () {
                echartsRecords.resize();
                echarts_source.resize();
                echarts_register.resize();
            }
            var carousel = layui.carousel;
            carousel.on('change(LAY-index-dataview)', function (obj) {
                //test1来源于对应HTML容器的 lay-filter="test1" 属性值
                echartsRecords.resize();
                echarts_source.resize();
                echarts_register.resize();
            });
        });
    });
})

function resize_echars() {
    echartsRecords.resize();
    echarts_source.resize();
    echarts_register.resize();
}

function logout() {
    showConfirm("溫馨提示", "您確認要退出登錄嗎？", function (index) {
        showNoticeSucc("正在退出登錄...");
        top.location.href = "/logout";
    });
}

function getDay(day) {
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = doHandleMonth(tMonth + 1);
    tDate = doHandleMonth(tDate);
    return tYear + "-" + tMonth + "-" + tDate;
}

function getHours() {
    var today = new Date();
    var targetday_milliseconds = today.getTime();
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    return today.getHours();
}

function doHandleMonth(month) {

    var m = month;

    if (month.toString().length == 1) {

        m = "0" + month;

    }

    return m;

}

function goLine() {
    showMsg("跳轉中...");
    window.open("https://lin.ee/d1T4veq");
}

function aboutOur() {
    layer.open({
        type: 2,
        title: false,
        area: ['630px', '360px'],
        shade: 0.8,
        closeBtn: 0,
        anim: 4, //0-6的动画形式，-1不开启
        shadeClose: true,
        content: 'https://www.youtube.com/embed/P-rU2aYsOmw'
        // content: 'https://static.iskwen.com/yuntechlife/mp4/aboutOur.mp4'
    });
}

function getListsInfoBydate(list, date) {
    for (let i = 0; i < list.length; i++) {
        if (formatter(list[i].add_time, "yyyy-MM-dd") === date) {
            return list[i];
        }
    }
    return {
        pv_count: 0,
        visit_count: 0,
        visitor_count: 0,
        avg_visit_time: 0,
        new_visitor_count: 0,
        bounce_ratio: 0.00,
    };
}

function addDay(val, num) {
    var today = new Date(val);
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * num;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = doHandleMonth(tMonth + 1);
    tDate = doHandleMonth(tDate);
    return tYear + "-" + tMonth + "-" + tDate;
}

function getDayAndWeek(day) {
    var a = ["日", "一", "二", "三", "四", "五", "六"];
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = doHandleMonth(tMonth + 1);
    tDate = doHandleMonth(tDate);
    return tMonth + "-" + tDate + "[周" + a[today.getDay()] + "]";
}

function getStyleByColor(color) {
    let result = "layui-bg-";
    //1red,2orange,3green,4cyan,5blue,6black,7gray
    switch (color) {
        case 1:
            return result + "red";
        case 2:
            return result + "orange";
        case 3:
            return result + "green";
        case 4:
            return result + "cyan";
        case 5:
            return result + "blue";
        case 6:
            return result + "black";
        case 7:
            return result + "gray";
        default:
            return result + "red";
    }

}
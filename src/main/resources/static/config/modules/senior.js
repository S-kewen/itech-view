/** layuiAdmin.std-v1.2.1 LPPL License By http://www.layui.com/admin/ */
var weekInsUps = [];
var weekInsDowns = [];
var weekExtUps = [];
var weekExtDowns = [];
var weekFlows = [];
var weekRatios = [];
var weekInss = [];
var weekExts = [];
var weekUps = [];
var weekDowns = [];
var allInsUp = 0;
var allInsDowns = 0;
var allExtUps = 0;
var allExtDowns = 0;
var allFlow = 0;
var allTitle = "";
var allFlows = [];
var allRatios = [];
var allAddTimes = [];
var historyTitle = "";
var total;
var timestamp = (new Date()).getTime();
var nowDate = getDay(0);
$.when(
    $.ajax({
        url: "//itech-api.iskwen.com/api/getEchartsInfoByWeek?ip=" + getUrlValue("ip") + "&nowDate=" + nowDate,
        type: "POST",
        dataType: "json",
        // async: false,
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status === 0) {
                //console.js("解析數據1:" + Math.abs((new Date()).getTime() - timestamp));
                for (let i = 0; i < 7; i++) {
                    let week = getListsInfoBydate(msg.list, addDay(nowDate, -i));
                    weekInsUps[6 - i] = week.ins_up.toFixed(4);
                    weekInsDowns[6 - i] = week.ins_down.toFixed(4);
                    weekExtUps[6 - i] = week.ext_up.toFixed(4);
                    weekExtDowns[6 - i] = week.ext_down.toFixed(4);
                    weekFlows[6 - i] = week.flow.toFixed(4);
                    weekRatios[6 - i] = week.ratio.toFixed(4);
                    weekInss[6 - i] = (week.ins_up + week.ins_down).toFixed(2);
                    weekExts[6 - i] = (week.ext_up + week.ext_down).toFixed(2);
                    weekUps [6 - i] = (week.ins_up + week.ext_up).toFixed(2);
                    weekDowns [6 - i] = (week.ins_down + week.ext_down).toFixed(2);
                }
                //console.js("解析1完成:" + Math.abs((new Date()).getTime() - timestamp));
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
        url: "//itech-api.iskwen.com/api/getEchartsInfoByAll?ip=" + getUrlValue("ip"),
        type: "POST",
        dataType: "json",
        // async: false,
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status == 0) {
                //console.js("解析數據2:" + Math.abs((new Date()).getTime() - timestamp));
                allInsUp = msg.allInsUp;
                allInsDowns = msg.allInsDowns;
                allExtUps = msg.allExtUps;
                allExtDowns = msg.allExtDowns;
                allFlow = msg.allFlow;
                allTitle = "累計" + msg.dayNum + "天";
                //console.js("解析2完成:" + Math.abs((new Date()).getTime() - timestamp));
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
        url: "//itech-api.iskwen.com/api/getEchartsInfoByHistory?ip=" + getUrlValue("ip"),
        type: "POST",
        dataType: "json",
        // async: false,
        headers: {'Authorization': getCookie("token")},
        success: function (msg) {
            if (msg.status === 0) {
                //console.js("解析數據3:" + Math.abs((new Date()).getTime() - timestamp));
                //showNoticeInfo(",正在解析數據二...");
                for (let i = 0; i < msg.list.length; i++) {
                    allFlows[i] = msg.list[i].flow;
                    allRatios[i] = msg.list[i].ratio;
                    allAddTimes[i] = formatter(msg.list[i].add_time, "yyyy-MM-dd hh:mm:ss");
                }
                historyTitle = "共" + msg.list.length + "條數據";
                total = msg.total;
                //console.js("解析3完成:" + Math.abs((new Date()).getTime() - timestamp));
                //showNoticeInfo("解析成功!");
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
    layui.define(function (e) {
        layui.use(["admin", "carousel"], function () {
            var e = layui.$,
                a = (layui.admin, layui.carousel),
                t = layui.element,
                i = layui.device();
            e(".layadmin-carousel").each(function () {
                var t = e(this);
                a.render({
                    elem: this,
                    width: "100%",
                    arrow: "none",
                    interval: t.data("interval"),
                    autoplay: t.data("autoplay") === !0,
                    trigger: i.ios || i.android ? "click" : "hover",
                    anim: t.data("anim")
                })
            }), t.render("progress")
        }), layui.use(["carousel", "echarts"], function () {
            //console.js("開始繪圖:" + Math.abs((new Date()).getTime() - timestamp));
            var e = layui.$,
                a = (layui.carousel, layui.echarts),
                t = [],
                i = [{
                    title: {
                        text: "校內校外分佈圖",
                        subtext: "近七日",
                        x: "left"
                    },
                    tooltip: {
                        trigger: "axis"
                    },
                    legend: {
                        data: ["校內", "校外"]
                    },
                    calculable: !0,
                    xAxis: [{
                        type: "category",
                        boundaryGap: !1,
                        data: [getDayAndWeek(-6), getDayAndWeek(-5), getDayAndWeek(-4), getDayAndWeek(-3), getDayAndWeek(-2), "昨天", "今天"]
                    }],
                    yAxis: [{
                        type: "value",
                        axisLabel: {
                            formatter: "{value} Gb"
                        }
                    }],
                    series: [{
                        name: "校內",
                        type: "line",
                        data: weekInss,
                        markPoint: {
                            data: [{
                                type: "max",
                                name: "最大值"
                            }, {
                                type: "min",
                                name: "最小值"
                            }]
                        },
                        markLine: {
                            data: [{
                                type: "average",
                                name: "平均值"
                            }]
                        }
                    }, {
                        name: "校外",
                        type: "line",
                        data: weekExts,
                        markPoint: {
                            data: [{
                                type: "max",
                                name: "最大值"
                            }, {
                                type: "min",
                                name: "最小值"
                            }]
                        },
                        markLine: {
                            data: [{
                                type: "average",
                                name: "平均值"
                            }]
                        }
                    }]
                }],
                n = e("#LAY-index-normline").children("div"),
                l = function (e) {
                    t[e] = a.init(n[e], layui.echartsTheme), t[e].setOption(i[e]), window.onresize = t[e].resize
                };
            if (n[0]) {
                l(0);
                var r = [],
                    o = [{
                        title: {
                            // text: "趨勢分析圖",
                            // subtext: "近七日",
                            // x: "left"
                        },
                        tooltip: {
                            trigger: "axis"
                        },
                        legend: {
                            data: ["校內上傳", "校內下載", "校外上傳", "校外下載", "傳輸比", "總流量"]
                        },
                        calculable: !0,
                        xAxis: [{
                            type: "category",
                            boundaryGap: !1,
                            data: [getDayAndWeek(-6), getDayAndWeek(-5), getDayAndWeek(-4), getDayAndWeek(-3), getDayAndWeek(-2), "昨天", "今天"]
                        }],
                        yAxis: [{
                            type: "value",
                            axisLabel: {
                                formatter: "{value} Gb"
                            }
                        }],
                        series: [{
                            name: "校內上傳",
                            type: "line",
                            stack: "总量",
                            data: weekInsUps
                        }, {
                            name: "校內下載",
                            type: "line",
                            stack: "总量",
                            data: weekInsDowns
                        }, {
                            name: "校外上傳",
                            type: "line",
                            stack: "总量",
                            data: weekExtUps
                        }, {
                            name: "校外下載",
                            type: "line",
                            stack: "总量",
                            data: weekExtDowns
                        }, {
                            name: "傳輸比",
                            type: "line",
                            stack: "总量",
                            data: weekRatios
                        }, {
                            name: "總流量",
                            type: "line",
                            stack: "总量",
                            data: weekFlows
                        }]
                    }],
                    m = e("#LAY-index-heapline").children("div"),
                    s = function (e) {
                        r[e] = a.init(m[e], layui.echartsTheme), r[e].setOption(o[e]), window.onresize = r[e].resize
                    };
                if (m[0]) {
                    s(0);
                    var y = [],
                        d = [{
                            title: {
                                text: "上傳下載分佈圖",
                                subtext: "近七日",
                                x: "left"
                            },
                            tooltip: {
                                trigger: "axis"
                            },
                            legend: {
                                data: ["上傳", "下載"]
                            },
                            calculable: !0,
                            xAxis: [{
                                type: "category",
                                boundaryGap: !1,
                                data: [getDayAndWeek(-6), getDayAndWeek(-5), getDayAndWeek(-4), getDayAndWeek(-3), getDayAndWeek(-2), "昨天", "今天"]
                            }],
                            yAxis: [{
                                type: "value",
                                axisLabel: {
                                    formatter: "{value} Gb"
                                }
                            }],
                            series: [{
                                name: "上傳",
                                type: "line",
                                data: weekUps,
                                markPoint: {
                                    data: [{
                                        type: "max",
                                        name: "最大值"
                                    }, {
                                        type: "min",
                                        name: "最小值"
                                    }]
                                },
                                markLine: {
                                    data: [{
                                        type: "average",
                                        name: "平均值"
                                    }]
                                }
                            }, {
                                name: "下載",
                                type: "line",
                                data: weekDowns,
                                markPoint: {
                                    data: [{
                                        type: "max",
                                        name: "最大值"
                                    }, {
                                        type: "min",
                                        name: "最小值"
                                    }]
                                },
                                markLine: {
                                    data: [{
                                        type: "average",
                                        name: "平均值"
                                    }]
                                }
                            }]
                        }],
                        c = e("#LAY-index-diffline").children("div"),
                        p = function (e) {
                            y[e] = a.init(c[e], layui.echartsTheme), y[e].setOption(d[e]), window.onresize = y[e].resize
                        };
                    if (c[0]) {
                        p(0);
                        var u = [],
                            x = [{
                                title: {
                                    text: "分塊分析圖",
                                    subtext: "近七日",
                                    x: "left"
                                },
                                tooltip: {
                                    trigger: "axis",
                                    axisPointer: {
                                        type: "shadow"
                                    }
                                },
                                legend: {
                                    data: ["校內上傳", "校內下載", "校外上傳", "校外下載"]
                                },
                                calculable: !0,
                                xAxis: [{
                                    type: "value",
                                    axisLabel: {
                                        formatter: "{value} Gb"
                                    }
                                }],
                                yAxis: [{
                                    type: "category",
                                    data: [getDayAndWeek(-6), getDayAndWeek(-5), getDayAndWeek(-4), getDayAndWeek(-3), getDayAndWeek(-2), "昨天", "今天"]
                                }],
                                series: [{
                                    name: "校內上傳",
                                    type: "bar",
                                    stack: "总量",
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: !'0.00',
                                                position: "insideRight"
                                            }
                                        }
                                    },
                                    data: weekInsUps
                                }, {
                                    name: "校內下載",
                                    type: "bar",
                                    stack: "总量",
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: !'0.00',
                                                position: "insideRight"
                                            }
                                        }
                                    },
                                    data: weekInsDowns
                                }, {
                                    name: "校外上傳",
                                    type: "bar",
                                    stack: "总量",
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: !'0.00',
                                                position: "insideRight"
                                            }
                                        }
                                    },
                                    data: weekExtUps
                                }, {
                                    name: "校外下載",
                                    type: "bar",
                                    stack: "总量",
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                show: !'0.00',
                                                position: "insideRight"
                                            }
                                        }
                                    },
                                    data: weekExtDowns
                                }]
                            }],
                            v = e("#LAY-index-heaparea").children("div"),
                            b = function (e) {
                                u[e] = a.init(v[e], layui.echartsTheme), u[e].setOption(x[e]), window.onresize = u[e].resize
                            };
                        if (v[0]) {
                            b(0);
                            var h = [],
                                f = [{
                                    title: {
                                        text: "歷史數據圖",
                                        subtext: historyTitle,
                                        x: "center"
                                    },
                                    tooltip: {
                                        trigger: "axis",
                                        formatter: function (e) {
                                            return e[0].name + "<br/>" + e[0].seriesName + " : " + e[0].value + " Gb<br/>" + e[1].seriesName + " : " + e[1].value + " (U/L)"
                                        }
                                    },
                                    legend: {
                                        // data: ["總流量", "傳輸比"],
                                        data: [],
                                        x: "left"
                                    },
                                    dataZoom: {
                                        show: !0,
                                        realtime: !0,
                                        start: 0,
                                        end: 100
                                    },
                                    xAxis: [{
                                        type: "category",
                                        boundaryGap: !1,
                                        axisLine: {
                                            onZero: !1
                                        },
                                        data: allAddTimes
                                    }],
                                    yAxis: [{
                                        name: "總流量(Gb)",
                                        type: "value"
                                        // max: 500
                                    }, {
                                        name: "傳輸比(U/L)",
                                        type: "value",
                                        // max: 1,
                                        axisLabel: {
                                            formatter: function (e) {
                                                return e
                                            }
                                        }
                                    }],
                                    series: [{
                                        name: "總流量",
                                        type: "line",
                                        itemStyle: {
                                            normal: {
                                                areaStyle: {
                                                    type: "default"
                                                }
                                            }
                                        },
                                        data: allFlows
                                    }, {
                                        name: "傳輸比",
                                        type: "line",
                                        yAxisIndex: 1,
                                        itemStyle: {
                                            normal: {
                                                areaStyle: {
                                                    type: "default"
                                                }
                                            }
                                        },
                                        data: allRatios
                                    }]
                                }],
                                g = e("#LAY-index-area").children("div"),
                                S = function (e) {
                                    h[e] = a.init(g[e], layui.echartsTheme), h[e].setOption(f[e]), window.onresize = h[e].resize
                                };
                            if (g[0]) {
                                S(0);
                                var A = [],
                                    w = [{
                                        title: {
                                            text: "數據匯總圖",
                                            subtext: allTitle,
                                            x: "left"
                                        },
                                        tooltip: {
                                            trigger: "axis"
                                        },
                                        legend: {
                                            data: [allTitle]
                                        },
                                        calculable: !0,
                                        xAxis: [{
                                            type: "value",
                                            boundaryGap: [0, .01],
                                            axisLabel: {
                                                formatter: "{value} Gb"
                                            }
                                        }],
                                        yAxis: [{
                                            type: "category",
                                            data: ['校外下載', '校外上傳', '校內下載', '校內上傳', '總流量']
                                        }],
                                        series: [{
                                            name: "合計",
                                            type: "bar",
                                            color: ['#6AB0B8', '#2F4554', '#FFF065', '#3CB2EF', '#E85C58'],
                                            data: [allExtDowns, allExtUps, allInsDowns, allInsUp, allFlow]
                                        }]
                                    }],
                                    k = e("#LAY-index-logline").children("div"),
                                    z = function (e) {
                                        A[e] = a.init(k[e], layui.echartsTheme), A[e].setOption(w[e]), window.onresize = A[e].resize
                                    };
                                k[0] && z(0)
                                if (total !== null && total !== undefined && total !== "") {
                                    showNoticeSucc("共整理" + total + "條數據");
                                } else {
                                    showNoticeSucc("共整理0條數據");
                                }
                                console.log(getPerformanceTiming());
                                showNoticeSucc("耗時:" + Math.abs((new Date()).getTime() - timestamp) + "Ms");
                                //完成全部
                                //console.js("全部完成:" + Math.abs((new Date()).getTime() - timestamp));
                            }
                        }
                    }
                }
            }
        }), layui.use(["carousel", "echarts"], function () {
            var e = layui.$,
                a = (layui.carousel, layui.echarts),
                t = [],
                i = [{
                    title: {
                        text: "某地区蒸发量和降水量",
                        subtext: "纯属虚构"
                    },
                    tooltip: {
                        trigger: "axis"
                    },
                    legend: {
                        data: ["蒸发量", "降水量"]
                    },
                    calculable: !0,
                    xAxis: [{
                        type: "category",
                        data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
                    }],
                    yAxis: [{
                        type: "value"
                    }],
                    series: [{
                        name: "蒸发量",
                        type: "bar",
                        data: [2, 4.9, 7, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20, 6.4, 3.3],
                        markPoint: {
                            data: [{
                                type: "max",
                                name: "最大值"
                            }, {
                                type: "min",
                                name: "最小值"
                            }]
                        },
                        markLine: {
                            data: [{
                                type: "average",
                                name: "平均值"
                            }]
                        }
                    }, {
                        name: "降水量",
                        type: "bar",
                        data: [2.6, 5.9, 9, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6, 2.3],
                        markPoint: {
                            data: [{
                                name: "年最高",
                                value: 182.2,
                                xAxis: 7,
                                yAxis: 183,
                                symbolSize: 18
                            }, {
                                name: "年最低",
                                value: 2.3,
                                xAxis: 11,
                                yAxis: 3
                            }]
                        },
                        markLine: {
                            data: [{
                                type: "average",
                                name: "平均值"
                            }]
                        }
                    }]
                }],
                n = e("#LAY-index-normcol").children("div"),
                l = function (e) {
                    t[e] = a.init(n[e], layui.echartsTheme), t[e].setOption(i[e]), window.onresize = t[e].resize
                };
            if (n[0]) {
                l(0);
                var r = [],
                    o = [{
                        tooltip: {
                            trigger: "axis",
                            axisPointer: {
                                type: "shadow"
                            }
                        },
                        legend: {
                            data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎", "百度", "谷歌", "必应", "其他"]
                        },
                        calculable: !0,
                        xAxis: [{
                            type: "category",
                            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
                        }],
                        yAxis: [{
                            type: "value"
                        }],
                        series: [{
                            name: "直接访问",
                            type: "bar",
                            data: [320, 332, 301, 334, 390, 330, 320]
                        }, {
                            name: "邮件营销",
                            type: "bar",
                            stack: "广告",
                            data: [120, 132, 101, 134, 90, 230, 210]
                        }, {
                            name: "联盟广告",
                            type: "bar",
                            stack: "广告",
                            data: [220, 182, 191, 234, 290, 330, 310]
                        }, {
                            name: "视频广告",
                            type: "bar",
                            stack: "广告",
                            data: [150, 232, 201, 154, 190, 330, 410]
                        }, {
                            name: "搜索引擎",
                            type: "bar",
                            data: [862, 1018, 964, 1026, 1679, 1600, 1570],
                            markLine: {
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            type: "dashed"
                                        }
                                    }
                                },
                                data: [
                                    [{
                                        type: "min"
                                    }, {
                                        type: "max"
                                    }]
                                ]
                            }
                        }, {
                            name: "百度",
                            type: "bar",
                            barWidth: 5,
                            stack: "搜索引擎",
                            data: [620, 732, 701, 734, 1090, 1130, 1120]
                        }, {
                            name: "谷歌",
                            type: "bar",
                            stack: "搜索引擎",
                            data: [120, 132, 101, 134, 290, 230, 220]
                        }, {
                            name: "必应",
                            type: "bar",
                            stack: "搜索引擎",
                            data: [60, 72, 71, 74, 190, 130, 110]
                        }, {
                            name: "其他",
                            type: "bar",
                            stack: "搜索引擎",
                            data: [62, 82, 91, 84, 109, 110, 120]
                        }]
                    }],
                    m = e("#LAY-index-heapcol").children("div"),
                    s = function (e) {
                        r[e] = a.init(m[e], layui.echartsTheme), r[e].setOption(o[e]), window.onresize = r[e].resize
                    };
                if (m[0]) {
                    s(0);
                    var y = [],
                        d = [{
                            title: {
                                text: "双数值柱形图",
                                subtext: "纯属虚构"
                            },
                            tooltip: {
                                trigger: "axis",
                                axisPointer: {
                                    show: !0,
                                    type: "cross",
                                    lineStyle: {
                                        type: "dashed",
                                        width: 1
                                    }
                                },
                                formatter: function (e) {
                                    return e.seriesName + " : [ " + e.value[0] + ", " + e.value[1] + " ]"
                                }
                            },
                            legend: {
                                data: ["数据1", "数据2"]
                            },
                            calculable: !0,
                            xAxis: [{
                                type: "value"
                            }],
                            yAxis: [{
                                type: "value",
                                axisLine: {
                                    lineStyle: {
                                        color: "#dc143c"
                                    }
                                }
                            }],
                            series: [{
                                name: "数据1",
                                type: "bar",
                                data: [
                                    [1.5, 10],
                                    [5, 7],
                                    [8, 8],
                                    [12, 6],
                                    [11, 12],
                                    [16, 9],
                                    [14, 6],
                                    [17, 4],
                                    [19, 9]
                                ],
                                markPoint: {
                                    data: [{
                                        type: "max",
                                        name: "最大值",
                                        symbol: "emptyCircle",
                                        itemStyle: {
                                            normal: {
                                                color: "#dc143c",
                                                label: {
                                                    position: "top"
                                                }
                                            }
                                        }
                                    }, {
                                        type: "min",
                                        name: "最小值",
                                        symbol: "emptyCircle",
                                        itemStyle: {
                                            normal: {
                                                color: "#dc143c",
                                                label: {
                                                    position: "bottom"
                                                }
                                            }
                                        }
                                    }, {
                                        type: "max",
                                        name: "最大值",
                                        valueIndex: 0,
                                        symbol: "emptyCircle",
                                        itemStyle: {
                                            normal: {
                                                color: "#1e90ff",
                                                label: {
                                                    position: "right"
                                                }
                                            }
                                        }
                                    }, {
                                        type: "min",
                                        name: "最小值",
                                        valueIndex: 0,
                                        symbol: "emptyCircle",
                                        itemStyle: {
                                            normal: {
                                                color: "#1e90ff",
                                                label: {
                                                    position: "left"
                                                }
                                            }
                                        }
                                    }]
                                },
                                markLine: {
                                    data: [{
                                        type: "max",
                                        name: "最大值",
                                        itemStyle: {
                                            normal: {
                                                color: "#dc143c"
                                            }
                                        }
                                    }, {
                                        type: "min",
                                        name: "最小值",
                                        itemStyle: {
                                            normal: {
                                                color: "#dc143c"
                                            }
                                        }
                                    }, {
                                        type: "average",
                                        name: "平均值",
                                        itemStyle: {
                                            normal: {
                                                color: "#dc143c"
                                            }
                                        }
                                    }, {
                                        type: "max",
                                        name: "最大值",
                                        valueIndex: 0,
                                        itemStyle: {
                                            normal: {
                                                color: "#1e90ff"
                                            }
                                        }
                                    }, {
                                        type: "min",
                                        name: "最小值",
                                        valueIndex: 0,
                                        itemStyle: {
                                            normal: {
                                                color: "#1e90ff"
                                            }
                                        }
                                    }, {
                                        type: "average",
                                        name: "平均值",
                                        valueIndex: 0,
                                        itemStyle: {
                                            normal: {
                                                color: "#1e90ff"
                                            }
                                        }
                                    }]
                                }
                            }, {
                                name: "数据2",
                                type: "bar",
                                barHeight: 10,
                                data: [
                                    [1, 2],
                                    [2, 3],
                                    [4, 4],
                                    [7, 5],
                                    [11, 11],
                                    [18, 15]
                                ]
                            }]
                        }],
                        c = e("#LAY-index-diffcol").children("div"),
                        p = function (e) {
                            y[e] = a.init(c[e], layui.echartsTheme), y[e].setOption(d[e]), window.onresize = y[e].resize
                        };
                    if (c[0]) {
                        p(0);
                        var u = [],
                            x = [{
                                title: {
                                    x: "center",
                                    text: "ECharts例子个数统计",
                                    subtext: "Rainbow bar example",
                                    link: "http://echarts.baidu.com/doc/example.html"
                                },
                                tooltip: {
                                    trigger: "item"
                                },
                                calculable: !0,
                                grid: {
                                    borderWidth: 0,
                                    y: 80,
                                    y2: 60
                                },
                                xAxis: [{
                                    type: "category",
                                    show: !1,
                                    data: ["Line", "Bar", "Scatter", "K", "Pie", "Radar", "Chord", "Force", "Map", "Gauge", "Funnel"]
                                }],
                                yAxis: [{
                                    type: "value",
                                    show: !1
                                }],
                                series: [{
                                    name: "ECharts例子个数统计",
                                    type: "bar",
                                    itemStyle: {
                                        normal: {
                                            color: function (e) {
                                                var a = ["#C1232B", "#B5C334", "#FCCE10", "#E87C25", "#27727B", "#FE8463", "#9BCA63", "#FAD860", "#F3A43B", "#60C0DD", "#D7504B", "#C6E579", "#F4E001", "#F0805A", "#26C0C0"];
                                                return a[e.dataIndex]
                                            },
                                            label: {
                                                show: !0,
                                                position: "top",
                                                formatter: "{b}\n{c}"
                                            }
                                        }
                                    },
                                    data: [12, 21, 10, 4, 12, 5, 6, 5, 25, 23, 7],
                                    markPoint: {
                                        tooltip: {
                                            trigger: "item",
                                            backgroundColor: "rgba(0,0,0,0)",
                                            formatter: function (e) {
                                                return '<img src="' + e.data.symbol.replace("image://", "") + '"/>'
                                            }
                                        },
                                        data: [{
                                            xAxis: 0,
                                            y: 350,
                                            name: "Line",
                                            symbolSize: 20
                                        }, {
                                            xAxis: 1,
                                            y: 350,
                                            name: "Bar",
                                            symbolSize: 20
                                        }, {
                                            xAxis: 2,
                                            y: 350,
                                            name: "Scatter",
                                            symbolSize: 20
                                        }, {
                                            xAxis: 3,
                                            y: 350,
                                            name: "K",
                                            symbolSize: 20
                                        }, {
                                            xAxis: 4,
                                            y: 350,
                                            name: "Pie",
                                            symbolSize: 20
                                        }, {
                                            xAxis: 5,
                                            y: 350,
                                            name: "Radar",
                                            symbolSize: 20
                                        }, {
                                            xAxis: 6,
                                            y: 350,
                                            name: "Chord",
                                            symbolSize: 20
                                        }, {
                                            xAxis: 7,
                                            y: 350,
                                            name: "Force",
                                            symbolSize: 20
                                        }, {
                                            xAxis: 8,
                                            y: 350,
                                            name: "Map",
                                            symbolSize: 20
                                        }, {
                                            xAxis: 9,
                                            y: 350,
                                            name: "Gauge",
                                            symbolSize: 20
                                        }, {
                                            xAxis: 10,
                                            y: 350,
                                            name: "Funnel",
                                            symbolSize: 20
                                        }]
                                    }
                                }]
                            }],
                            v = e("#LAY-index-colorline").children("div"),
                            b = function (e) {
                                u[e] = a.init(v[e], layui.echartsTheme), u[e].setOption(x[e]), window.onresize = u[e].resize
                            };
                        if (v[0]) {
                            b(0);
                            var h = [],
                                f = [{
                                    title: {
                                        text: "世界人口总量",
                                        subtext: "数据来自网络"
                                    },
                                    tooltip: {
                                        trigger: "axis"
                                    },
                                    legend: {
                                        data: ["2011年", "2012年"]
                                    },
                                    calculable: !0,
                                    xAxis: [{
                                        type: "value",
                                        boundaryGap: [0, .01]
                                    }],
                                    yAxis: [{
                                        type: "category",
                                        data: ["巴西", "印尼", "美国", "印度", "中国", "世界人口(万)"]
                                    }],
                                    series: [{
                                        name: "2011年",
                                        type: "bar",
                                        data: [18203, 23489, 29034, 104970, 131744, 630230]
                                    }, {
                                        name: "2012年",
                                        type: "bar",
                                        data: [19325, 23438, 31e3, 121594, 134141, 681807]
                                    }]
                                }],
                                g = e("#LAY-index-normbar").children("div"),
                                S = function (e) {
                                    h[e] = a.init(g[e], layui.echartsTheme), h[e].setOption(f[e]), window.onresize = h[e].resize
                                };
                            if (g[0]) {
                                S(0);
                                var A = [],
                                    w = [{
                                        tooltip: {
                                            trigger: "axis",
                                            axisPointer: {
                                                type: "shadow"
                                            }
                                        },
                                        legend: {
                                            data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
                                        },
                                        calculable: !0,
                                        xAxis: [{
                                            type: "value"
                                        }],
                                        yAxis: [{
                                            type: "category",
                                            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
                                        }],
                                        series: [{
                                            name: "直接访问",
                                            type: "bar",
                                            stack: "总量",
                                            itemStyle: {
                                                normal: {
                                                    label: {
                                                        show: !0,
                                                        position: "insideRight"
                                                    }
                                                }
                                            },
                                            data: [320, 302, 301, 334, 390, 330, 320]
                                        }, {
                                            name: "邮件营销",
                                            type: "bar",
                                            stack: "总量",
                                            itemStyle: {
                                                normal: {
                                                    label: {
                                                        show: !0,
                                                        position: "insideRight"
                                                    }
                                                }
                                            },
                                            data: [120, 132, 101, 134, 90, 230, 210]
                                        }, {
                                            name: "联盟广告",
                                            type: "bar",
                                            stack: "总量",
                                            itemStyle: {
                                                normal: {
                                                    label: {
                                                        show: !0,
                                                        position: "insideRight"
                                                    }
                                                }
                                            },
                                            data: [220, 182, 191, 234, 290, 330, 310]
                                        }, {
                                            name: "视频广告",
                                            type: "bar",
                                            stack: "总量",
                                            itemStyle: {
                                                normal: {
                                                    label: {
                                                        show: !0,
                                                        position: "insideRight"
                                                    }
                                                }
                                            },
                                            data: [150, 212, 201, 154, 190, 330, 410]
                                        }, {
                                            name: "搜索引擎",
                                            type: "bar",
                                            stack: "总量",
                                            itemStyle: {
                                                normal: {
                                                    label: {
                                                        show: !0,
                                                        position: "insideRight"
                                                    }
                                                }
                                            },
                                            data: [820, 832, 901, 934, 1290, 1330, 1320]
                                        }]
                                    }],
                                    k = e("#LAY-index-heapbar").children("div"),
                                    z = function (e) {
                                        A[e] = a.init(k[e], layui.echartsTheme), A[e].setOption(w[e]), window.onresize = A[e].resize
                                    };
                                if (k[0]) {
                                    z(0);
                                    var L = [],
                                        C = {
                                            normal: {
                                                label: {
                                                    position: "right"
                                                }
                                            }
                                        },
                                        P = [{
                                            title: {
                                                text: "交错正负轴标签",
                                                subtext: "From ExcelHome",
                                                sublink: "http://e.weibo.com/1341556070/AjwF2AgQm"
                                            },
                                            tooltip: {
                                                trigger: "axis",
                                                axisPointer: {
                                                    type: "shadow"
                                                }
                                            },
                                            grid: {
                                                y: 80,
                                                y2: 30
                                            },
                                            xAxis: [{
                                                type: "value",
                                                position: "top",
                                                splitLine: {
                                                    lineStyle: {
                                                        type: "dashed"
                                                    }
                                                }
                                            }],
                                            yAxis: [{
                                                type: "category",
                                                axisLine: {
                                                    show: !1
                                                },
                                                axisLabel: {
                                                    show: !1
                                                },
                                                axisTick: {
                                                    show: !1
                                                },
                                                splitLine: {
                                                    show: !1
                                                },
                                                data: ["ten", "nine", "eight", "seven", "six", "five", "four", "three", "two", "one"]
                                            }],
                                            series: [{
                                                name: "生活费",
                                                type: "bar",
                                                stack: "总量",
                                                itemStyle: {
                                                    normal: {
                                                        color: "orange",
                                                        borderRadius: 5,
                                                        label: {
                                                            show: !0,
                                                            position: "left",
                                                            formatter: "{b}"
                                                        }
                                                    }
                                                },
                                                data: [{
                                                    value: -.07,
                                                    itemStyle: C
                                                }, {
                                                    value: -.09,
                                                    itemStyle: C
                                                }, .2, .44, {
                                                    value: -.23,
                                                    itemStyle: C
                                                }, .08, {
                                                    value: -.17,
                                                    itemStyle: C
                                                }, .47, {
                                                    value: -.36,
                                                    itemStyle: C
                                                }, .18]
                                            }]
                                        }],
                                        T = e("#LAY-index-windline").children("div"),
                                        O = function (e) {
                                            L[e] = a.init(T[e], layui.echartsTheme), L[e].setOption(P[e]), window.onresize = L[e].resize
                                        };
                                    T[0] && O(0)
                                }
                            }
                        }
                    }
                }
            }
        }), layui.use(["carousel", "echarts"], function () {
            var e = layui.$,
                a = (layui.carousel, layui.echarts),
                t = [],
                i = [{
                    title: {
                        text: "2011全国GDP（亿元）",
                        subtext: "数据来自国家统计局"
                    },
                    tooltip: {
                        trigger: "item"
                    },
                    dataRange: {
                        orient: "horizontal",
                        min: 0,
                        max: 55e3,
                        text: ["高", "低"],
                        splitNumber: 0
                    },
                    series: [{
                        name: "2011全国GDP分布",
                        type: "map",
                        mapType: "china",
                        mapLocation: {
                            x: "center"
                        },
                        selectedMode: "multiple",
                        itemStyle: {
                            normal: {
                                label: {
                                    show: !0
                                }
                            },
                            emphasis: {
                                label: {
                                    show: !0
                                }
                            }
                        },
                        data: [{
                            name: "西藏",
                            value: 605.83
                        }, {
                            name: "青海",
                            value: 1670.44
                        }, {
                            name: "宁夏",
                            value: 2102.21
                        }, {
                            name: "海南",
                            value: 2522.66
                        }, {
                            name: "甘肃",
                            value: 5020.37
                        }, {
                            name: "贵州",
                            value: 5701.84
                        }, {
                            name: "新疆",
                            value: 6610.05
                        }, {
                            name: "云南",
                            value: 8893.12
                        }, {
                            name: "重庆",
                            value: 10011.37
                        }, {
                            name: "吉林",
                            value: 10568.83
                        }, {
                            name: "山西",
                            value: 11237.55
                        }, {
                            name: "天津",
                            value: 11307.28
                        }, {
                            name: "江西",
                            value: 11702.82
                        }, {
                            name: "广西",
                            value: 11720.87
                        }, {
                            name: "陕西",
                            value: 12512.3
                        }, {
                            name: "黑龙江",
                            value: 12582
                        }, {
                            name: "内蒙古",
                            value: 14359.88
                        }, {
                            name: "安徽",
                            value: 15300.65
                        }, {
                            name: "北京",
                            value: 16251.93,
                            selected: !0
                        }, {
                            name: "福建",
                            value: 17560.18
                        }, {
                            name: "上海",
                            value: 19195.69,
                            selected: !0
                        }, {
                            name: "湖北",
                            value: 19632.26
                        }, {
                            name: "湖南",
                            value: 19669.56
                        }, {
                            name: "四川",
                            value: 21026.68
                        }, {
                            name: "辽宁",
                            value: 22226.7
                        }, {
                            name: "河北",
                            value: 24515.76
                        }, {
                            name: "河南",
                            value: 26931.03
                        }, {
                            name: "浙江",
                            value: 32318.85
                        }, {
                            name: "山东",
                            value: 45361.85
                        }, {
                            name: "江苏",
                            value: 49110.27
                        }, {
                            name: "广东",
                            value: 53210.28,
                            selected: !0
                        }]
                    }]
                }],
                n = e("#LAY-index-plat").children("div"),
                l = function (e) {
                    t[e] = a.init(n[e], layui.echartsTheme), t[e].setOption(i[e]), window.onresize = t[e].resize
                };
            n[0] && l(0)
        }), e("senior", {})
    });
});

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

function doHandleMonth(month) {

    var m = month;

    if (month.toString().length == 1) {

        m = "0" + month;

    }

    return m;
}

function getListsInfoBydate(list, date) {
    for (let i = 0; i < list.length; i++) {
        //console.log(list[i].add_time);
        if (formatter(list[i].add_time, "yyyy-MM-dd") === date) {
            return list[i];
        }
    }
    return {ins_up: 0.0000, ins_down: 0.0000, ext_up: 0.0000, ext_down: 0.0000, flow: 0.0000, ratio: 0.0000,};
}

function getPerformanceTiming() {

    var performance = window.performance;

    if (!performance) {
        // 当前浏览器不支持
        console.log('你的浏览器不支持 performance 接口');
        return;
    }

    var t = performance.timing;

    var times = {};

    //【重要】页面加载完成的时间
    //【原因】这几乎代表了用户等待页面可用的时间
    times.loadPage = t.loadEventEnd - t.navigationStart;

    //【重要】解析 DOM 树结构的时间
    //【原因】反省下你的 DOM 树嵌套是不是太多了！
    times.domReady = t.domComplete - t.responseEnd;

    //【重要】重定向的时间
    //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
    times.redirect = t.redirectEnd - t.redirectStart;

    //【重要】DNS 查询时间
    //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
    // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)
    times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;

    //【重要】读取页面第一个字节的时间
    //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
    // TTFB 即 Time To First Byte 的意思
    // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
    times.ttfb = t.responseStart - t.navigationStart;

    //【重要】内容加载完成的时间
    //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
    times.request = t.responseEnd - t.requestStart;

    //【重要】执行 onload 回调函数的时间
    //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
    times.loadEvent = t.loadEventEnd - t.loadEventStart;

    // DNS 缓存时间
    times.appcache = t.domainLookupStart - t.fetchStart;

    // 卸载页面的时间
    times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;

    // TCP 建立连接完成握手的时间
    times.connect = t.connectEnd - t.connectStart;

    return times;

}

layui.config({
    base:'https://static.iskwen.com/yuntechlife/config/'
}).extend({
    index: 'lib/index' //主入口模塊
}).use([ 'form', 'step','index'], function () {
    var $ = layui.$,
        form = layui.form,
        step = layui.step;
    step.render({
        elem: '#stepForm',
        filter: 'stepForm',
        width: '100%', //设置容器宽度
        stepWidth: '750px',
        height: '550px',
        stepItems: [{
            title: '填寫任務資訊'
        },{
            title: '填寫個人資訊'
        }, {
            title: '確認'
        }, {
            title: '完成'
        }]
    });
    form.on('submit(formStep)', function (data) {
        var logistics_name = $("#logistics_name").val();
        var logistics_num = $("#logistics_num").val();
        var consignee_name = $("#consignee_name").val();
        var consignee_phone = $("#consignee_phone").val();
        var logistics_type = $('#logistics_type').val();
        var logistics_points = $('#logistics_points').val();
        if(logistics_name==''){
            showTip("任務名稱不能為空");
            $("#logistics_name").focus();
            return false;
        }
        if(logistics_num==''){
            showTip("任務敘述不能為空");
            $("#logistics_num").focus();
            return false;
        }
        if(consignee_name==''){
            showTip("經驗要求不能為空");
            $("#consignee_name").focus();
            return false;
        }
        if(consignee_phone==''){
            showTip("金額不能為空");
            $("#consignee_phone").focus();
            return false;
        }
        if(!checkMoney(consignee_phone)){
            showTip("金額必須是大於0的整數");
            $("#consignee_phone").focus();
            return false;
        }
        step.next('#stepForm');
        return false;
    });
    form.on('submit(formStep2)', function (data) {
        var logistics_points = $('#logistics_points').val();
        var logistics_name = $("#logistics_name").val();
        var logistics_num = $("#logistics_num").val();
        var consignee_name = $("#consignee_name").val();
        var consignee_phone = $("#consignee_phone").val();
        var logistics_type = $('#logistics_type').val();
        var logistics_points = $('#logistics_points').val();
        var pickup_points = $("#pickup_points").val();
        var appointment_time = $("#appointment_time").val();
        var post_name = $("#post_name").val();
        var post_line = $("#post_line").val();
        var post_phone = $('#post_phone').val();
        var remark = $('#remark').val();
        var need_amount=0;
        var actual_amount=0;
        if(pickup_points==''){
            showTip("任務地址不能為空");
            $("#pickup_points").focus();
            return false;
        }
        if(!checkDateTime(appointment_time)){
            showTip("任務時間輸入有誤");
            return false;
        }
        if(!contrastTime(appointment_time)){
            showTip("上門時間必須大於["+getNowTime(1200)+"]");
            return false;
        }
        if(post_name==''){
            showTip("聯繫人姓名不能為空");
            $("#post_name").focus();
            return false;
        }
        if(post_line==''){
            showTip("聯繫人Line不能為空");
            $("#post_line").focus();
            return false;
        }
        if(!checkPhone(post_phone)){
            showTip("聯繫人電話輸入有誤(如:0974123456)");
            $("#post_phone").focus();
            return false;
        }
        if (logistics_points=="7" && remark==''){
            showTip("請將取貨地址記錄在備註欄內");
            $("#logistics_points").focus();
            return false;
        }
        if(remark.length>255){
            showTip("備註長度不能大於255");
            $("#remark").focus();
            return false;
        }
        $("#display_logistics_name").html(logistics_name);
        $("#display_logistics_num").html(logistics_num);
        $("#display_consignee_name").html(consignee_name);
        $("#display_consignee_phone").html(consignee_phone);
        $("#display_logistics_type").html(getLogisticsTypeTip(logistics_type));
        $("#display_logistics_points").html(getLogisticsPointsTip(logistics_points));
        $("#display_pickup_points").html(pickup_points);
        $("#display_appointment_time").html(appointment_time);
        $("#display_post_name").html(post_name);
        $("#display_post_line").html(post_line);
        $("#display_post_phone").html(post_phone);
        $("#display_remark").html(remark);
        // if (logistics_type==1){
        //     need_amount=25;
        // }else if (logistics_type==2){
        //     need_amount=50;
        // }else if (logistics_type==3){
        //     need_amount=100;
        // }else if (logistics_type==4){
        //     need_amount=200;
        // }else{
        //     need_amount=200;
        // }

        need_amount=consignee_phone;
        actual_amount=need_amount*1;
        $("#display_need_amount").html(need_amount);
        $("#display_actual_amount").html(actual_amount);
        step.next('#stepForm');
        return false;
    });
    form.on('submit(formStep3)', function (data) {
        addAgentOrder(step);
        return false;
    });
    form.on('submit(formStep4)', function (data) {
        step.next('#stepForm');
        return false;
    });
    form.on('submit(formStep5)', function (data) {
        location.href = "/index#/layuimini-v1.0.4/page/listMyAgentOrder.html?mpi=m-p-i-7";
        return false;
    });
    $('.pre').click(function () {
        step.pre('#stepForm');
        return false;
    });
    $('.next').click(function () {
        step.next('#stepForm');
        return false;
    });
})
layui.use('laydate', function () {
    var laydate = layui.laydate;
    var myDate = new Date();
    laydate.render({
        elem: '#appointment_time',
        type: 'datetime',
        lang: getLaydateLang(),
        min: 0,
        max: 7,
        format: 'yyyy-MM-dd HH:mm:ss'
    });
});

function checkDateTime(str) {
    var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    var r = str.match(reg);
    if (r == null) return false;
    var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
    return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7]);
}

function addAgentOrder(step) {
    $.ajax({
        url: "//itech-api.iskwen.com/api/addExpressTaker",
        type: "POST",
        async: false,
        dataType: "json",
        headers: {'Authorization': getCookie("token")},
        data: $("#addAgentOrder").serialize() + "&" + $("#addAgentOrder2").serialize(),
        success: function (msg) {
            if (msg.status == 0) {
                //showMsg("提交成功");
                step.next('#stepForm');
                return true;
            } else {
                showTip(msg.tip);
                return false;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showErrorMsg("系統在開小差,請稍候再試");
            return false;
        }
    });
}

function getLogisticsTypeTip(id) {
    switch (id) {
        case '1':
            return "小件";
        case '2':
            return "中件";
        case '3':
            return "大件";
        case '4':
            return "超大件";
        default:
            return "未知";
    }
}

function getLogisticsPointsTip(id) {
    switch (id) {
        case '1':
            return "[超商取貨]全家-龍潭店";
        case '2':
            return "[超商取貨]全家-四維店";
        case '3':
            return "[超商取貨]711-雲龍店";
        case '4':
            return "[校內]宿舍郵件中心";
        case '5':
            return "[校內]i郵箱";
        case '6':
            return "[校內]文書組";
        case '7':
            return "[其他]其他";
        case '8':
            return "[超商取貨]全家-雲大店";
        default:
            return "未知";
    }
}

function contrastTime(start) {
    var thetime = start;
    var d = new Date(Date.parse(thetime.replace(/-/g, "/")));//傳入時間
    var curDate = new Date();//現在時間
    curDate.setTime(curDate.getTime() + 60 * 20 * 1000);
    if (d <= curDate) {
        return false;
    }
    return true;
}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getNowTime(addSecond) {
    var curDate = new Date();//現在時間
    curDate.setTime(curDate.getTime() + addSecond * 1000);
    return curDate.Format("yyyy-MM-dd hh:mm:ss");
}

function checkPhone(str) {
    var re = /^[0-9]+$/;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}

layui.use(['form'], function () {
    var form = layui.form;
    form.on('select(logistics_type)', function (data) {
        var logistics_type = $('#logistics_type').val();
        layer.msg('貨物種類: ' + getLogisticsTypeTip(logistics_type), {
            offset: '6px'
        });
        if (logistics_type == 1) {
            layer.tips('大小：長寬高均不超過20cm<br>重量：小於2kg<br>費用：25元', data.othis)
        } else if (logistics_type == 2) {
            layer.tips('大小：長寬高均不超過40cm<br>重量：小於4kg<br>費用：50元', data.othis)
        } else if (logistics_type == 3) {
            layer.tips('大小：長寬高均不超過1m<br>重量：小於10kg<br>費用：100元', data.othis)
        } else if (logistics_type == 4) {
            layer.tips('大小：長寬高均不超過2m<br>重量：小於20kg<br>費用：200元', data.othis)
        }
    });
    form.on('select(logistics_points)', function (data) {
        var logistics_points = $('#logistics_points').val();
        layer.msg('取貨地址: ' + getLogisticsPointsTip(logistics_points), {
            offset: '6px'
        });
        if (logistics_points == 1) {
            layer.tips('地址：640雲林縣斗六市龍潭北路2號', data.othis)
        } else if (logistics_points == 2) {
            layer.tips('地址：640雲林縣斗六市四維路132號', data.othis)
        } else if (logistics_points == 3) {
            layer.tips('地址：640雲林縣斗六市龍潭路14之1號', data.othis)
        } else if (logistics_points == 4) {
            layer.tips('地址：學生宿舍郵件處理中心', data.othis)
        } else if (logistics_points == 5) {
            layer.tips('地址：學生餐廳入口旁郵箱櫃', data.othis)
        } else if (logistics_points == 6) {
            layer.tips('地址：雲科文書組', data.othis)
        } else if (logistics_points == 7) {
            layer.tips('溫馨提示：請將取貨地址記錄在備註欄內(下一頁)', data.othis)
        } else if (logistics_points == 8) {
            layer.tips('地址：640雲林縣斗六市中山路573號', data.othis)
        }
    });
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

function checkMoney(val){
    return val % 1 === 0 && val>0;
}
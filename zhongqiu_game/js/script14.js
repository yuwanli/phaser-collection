function getMiao(){
    var miaosha = $("#miaosha").html();
    var miaosha_tmp = Handlebars.compile(miaosha);
    Handlebars.registerHelper('start', function(e) {
        var now = new Date().getTime();
        var start  = new Date(e).getTime();
        if(now<start){//未开始
            return  'noStart'
        }else{
            return 'start open'
        }
    });
    Handlebars.registerHelper('getTime', function(e) {
        var now = new Date().getTime();
        var start  = new Date(e).getTime();
        var time = start - now;
        if(time<0){//已开始
            return "00:00:00"
        }else{
            var h = parseInt(time/1000/60/60)>9?parseInt(time/1000/60/60):"0"+parseInt(time/1000/60/60);
            var m = parseInt((time-h*1000*60*60)/1000/60)>9?parseInt((time-h*1000*60*60)/1000/60):"0"+parseInt((time-h*1000*60*60)/1000/60);
            var s = parseInt((time - h*1000*60*60 - m*1000*60)/1000)>9?parseInt((time - h*1000*60*60 - m*1000*60)/1000):"0"+parseInt((time - h*1000*60*60 - m*1000*60)/1000);
            return h+":"+m+":"+s;
        }
    });
    var miaosha_str = miaosha_tmp(miaosha_data);
    $(".miaosha").prepend(miaosha_str);
    setInterval(function(){
        $(".miaosha .down .time").each(function(){
            var array = $(this).html().split(":");
            var h = parseInt(array[0]);
            var m = parseInt(array[1]);
            var s = parseInt(array[2]);
            var time = s+m*60+h*60*60;
            if(time>0){
                time -= 1;
                var n_h = parseInt(time/60/60)>9?parseInt(time/60/60):"0"+parseInt(time/60/60);
                var n_m = parseInt((time-n_h*60*60)/60)>9?parseInt((time-n_h*60*60)/60):"0"+parseInt((time-n_h*60*60)/60);
                var n_s = parseInt(time - n_h*60*60 - n_m*60)>9?parseInt(time - n_h*60*60 - n_m*60):"0"+parseInt(time - n_h*60*60 - n_m*60);
                $(this).html(n_h+":"+n_m+":"+n_s);
            }
        })
    },1000);
}
function getFour(d,t){
    var four = $("#four").html();
    var four_tmp = Handlebars.compile(four);
    var four_str = four_tmp(d);
    $(t).html(four_str);
}
function initBrand(d,t){
    var night = $("#night").html();
    var night_tmp = Handlebars.compile(night);
    var night_str = night_tmp(d);
    $(t).html(night_str);
    getData(0);
}
function getOption(d,t){
    var option = $("#option").html();
    var option_tmp = Handlebars.compile(option);
    Handlebars.registerHelper('selected', function(e) {
        if(e == selectedStr){
            return "selected"
        }
    });
    var option_str = option_tmp(d);
    $(t).html(option_str);
}
function getData(i){
    $(".section3 .night_list li").removeClass("active");
    $($(".section3 .night_list li")[i]).addClass("active");
    var d = ppth_data[i]["data"];
    getFour(d,".section3 .four_list");
}
//初始化地图函数  自定义函数名init
function initAddress() {
    //定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
    var center = new qq.maps.LatLng($("#map").attr("data-jd"), $("#map").attr("data-wd"));
    var map = new qq.maps.Map(document.getElementById("map"), {
        center: center,      // 地图的中心地理坐标。
        zoom: 90,
        scaleControl: true,
        panControl: false,
        zoomControl: false,
        draggable: true,
        disableDoubleClickZoom: true,
        scrollwheel: true
    });
    var marker = new qq.maps.Marker({
        position: center,
        map: map
    });
}
//获取get参数id
function getPar(par){
    //获取当前URL
    var local_url = document.location.href;
    //获取要取得的get参数位置
    var get = local_url.indexOf(par +"=");
    if(get == -1){
        return "";
    }
    //截取字符串
    var get_par = local_url.slice(par.length + get + 1);
    //判断截取后的字符串是否还有其他get参数
    var nextPar = get_par.indexOf("&");
    if(nextPar != -1){
        get_par = get_par.slice(0, nextPar);
    }
    return get_par;
}

function getSignData(id){
    $.ajax({
        type: "get",
        url:"http://vip.zjqq.mobi/pub/SignListCar.html?num=9999",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "get_jsonpCallback",
        success: function(data) {
            // 处理并显示返回数据
            if(data['state']=='ok'){
                var theData = data;
                $.each(theData['list'],function(){
                    var theItem = $(this)[0];
                    $(".apply-main").append("<li>"+"["+theItem['city']+" "+theItem['name']+"] "+theItem['wantcar']+" "+theItem['mobile']+" "+theItem['signtime']+"</li>");
                });
                // theUserList();
            }

        }
    });
}


function getPercent(){
    var total = parseInt($("#total").html());
    $.ajax({
        type: "post",
        async: false,
        url:'http://vip.zjqq.mobi/pub/GetPayNum?id='+$(".percent").attr("data-id"),
        dataType: "json",
        error: function (request) {
            console.log(request);
        },
        success: function (data) {
            if(data.state == "error"){
                console.log(data.msg);
                return;
            }
            var d = data.data;
            $("#current").html(d);
            var percent = d/total*100;
            $(".funding .schedule .inner").animate({"width":percent+"%"},1000);
        }
    });
}
var city = "杭州";
var selectedStr = "杭州";
function getIp(){
    city = IPData[3];
    switch(city){
        case '杭州市':
            city = '杭州';
            break;
        case '宁波市':
            city = '宁波';
            break;
        case '金华市':
            city = '金华';
            break;
        //case '台州市':
        //    city = '台州';
        //    break;
        //case '湖州市':
        //    city = '湖州';
        //    break;
        //case '绍兴市':
        //    city = '绍兴';
        //    break;
        default:
            city = '杭州';
            break;
    }
    if(!getPar("href")){
      if(city!=$("body").attr("data-city")) {
          window.location.href = city_list[city];
      }
    }else{
        switch (parseInt(getPar("href"))){
            case 0:
                selectedStr = "杭州";
                break;
            case 1:
                selectedStr = "宁波";
                break;
            case 2:
                selectedStr = "金华";
                break;
            //case 3:
            //    selectedStr = "台州";
            //    break;
            //case 4:
            //    selectedStr = "湖州";
            //    break;
            //case 5:
            //    selectedStr = "绍兴";
            //    break;
            default :
                selectedStr = "杭州";
                break;
        }
        console.log(selectedStr);
    }
    return city;
}

$(function(){
    getIp();
    getMiao();
    getPercent();
    getFour(djkh_data,".section1 .four_list");
    getOption(href_list,".top select");
    $(document).on("change",".top select",function(){
        var t = this.options[this.selectedIndex];
        console.log($(t).attr("value"));
        window.location.href = $(t).attr("value");
    });
    $(window).on("scroll",function(){
        getFour(cjzg_data["0"],".section2 .four_list");
        initBrand(ppth_data,".section3 .night_list");
        initAddress();
        getSignData($(".apply").attr("data-id"));
        $(window).unbind("scroll");
    });
    $(document).on("click",".section3 .night_list li",function(){
        getData($(this).index());
    });
    $(document).on("click",".noStart",function(e){
        alert("秒杀未开始，敬请期待...");
    });
    $(document).on("click",".start.open",function(){
        $('.back_sign').fadeIn();
        $('.cover_sign').fadeIn();
        $('.frame').fadeIn();
        $('#frame').attr('src',$(this).attr('data-link'))
    });
    $(document).on('click','.back_sign,.cover_sign',function(event){
        //取消事件冒泡
        $('.back_sign').fadeOut();
        $('.cover_sign').fadeOut();
        $('.frame').fadeOut();
    });
    $(document).on("click",".top ul li",function(){
        var target = $(this).attr("data-href");
        $("html,body").animate({"scrollTop": ($("."+target+"").offset().top)}, "slow");
    });
    $(".slideCon .slide").hover(function(){
        if($(this).hasClass("slide3")){
            $(".slideCon .slide1").css("z-index","60");
            $(".slideCon .slide2").css("z-index","80");
            $(".slideCon .slide3").css("z-index","200");
            $(".slideCon .base").show();
            $(".slideCon .slide2 .base2").hide();
			$(".slideCon .slide3 .base").hide();
        }
        if($(this).hasClass("slide2")){
            $(".slideCon .slide1").css("z-index","60");
            $(".slideCon .slide2").css("z-index","200");
            $(".slideCon .slide3").css("z-index","60");
            $(".slideCon .base").show();
            $(".slideCon .slide2 .base").hide();
        }
        if($(this).hasClass("slide1")){
            $(".slideCon .slide1").css("z-index","200");
            $(".slideCon .slide2").css("z-index","80");
            $(".slideCon .slide3").css("z-index","60");
            $(".slideCon .base").show();
        }
        getFour(cjzg_data[$(this).index()],".section2 .four_list");
        //console.log($(this).index());
        $(".slideCon .slide").removeClass("active");
        $(this).addClass("active");
    });
});/*  |xGv00|99aacb768d94acb5b8bbbb9cb5cb9b0a */
var winWidth = window.innerWidth;
var winHeight = window.innerHeight;
var ratio = parseInt(document.getElementsByTagName("html")[0].style.fontSize);
var game;
var points = [];
var bmd;
var beforeX;
var beforeY;
var flag = true;//用来处理连续作画的标志位
var init = true;//是否为画之前的初始状态
var ifDone = false;//判断画框里是否有对象存在
var minX = 0;
var minY = 0;
var maxX = 0;
var maxY = 0;
var rec;
var button;
var bmd_draw;
var group1;
var group2;
var mySwiper;

game = new Phaser.Game(winWidth, winHeight, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render },true);
function preload() {

}
function create() {
    group1 = game.add.group();
    group2 = game.add.group();
    bmd = game.make.bitmapData(winWidth, winHeight);
    bmd.addToWorld();
    stars = [];

    game.input.onUp.add(onUp, this);
    rec = new Phaser.Rectangle(0, 0, 0, 0);
}

function sure(e){
    game.input.moveCallbacks = [];
    bmd_draw = game.make.bitmapData(maxX-minX+4, maxY-minY+4);
    var photo = bmd_draw.copy(bmd, minX-2,minY-2,  maxX-minX+4, maxY-minY+4,0,0,  maxX-minX+4, maxY-minY+4);
    document.getElementById("draw_result").setAttribute("src",photo.canvas.toDataURL());
    $(".control").fadeOut();
    bmd.clear();
    reset();
    $(".s1 .btn").fadeOut();
    $("#game").removeClass("s1");
    $("#game").addClass("s2");
    $("#sure").attr("data-id","sure1");
    $("#draw_result").animate({
        "left":"0"
    },2000,"linear");
    $(".bat").animate({
        "width":"1.8rem",
        "right":"0"
    },4000,"linear");
}
function reset(){
    minX = 0;
    minY = 0;
    maxX = 0;
    maxY = 0;
    init = true;
    flag = true;
    ifDone = false;
}
function sure_common(){
    game.input.moveCallbacks = [];
    //console.log(game.input);
    bmd_draw = game.make.bitmapData(maxX-minX+4, maxY-minY+4);
    var photo = bmd_draw.copy(bmd, minX-2,minY-2,  maxX-minX+4, maxY-minY+4,0,0,  maxX-minX+4, maxY-minY+4);
    document.getElementById("draw_result1").setAttribute("src",photo.canvas.toDataURL());
    $("#draw_result1").css({
        "left":(minX-2)/ratio+"rem",
        "top":(minY-2)/ratio+"rem"
    })
    bmd.clear();
}
function sure1(){
    sure_common();
    reset();
    $(".stage2 .tips").fadeOut();
    $(".s2 .btn").fadeOut();
    $(".stage2").addClass("out");
    setTimeout(function(){
        $("#game").removeClass("s2");
        $("#game").addClass("s3");
        $("#sure").attr("data-id","sure2");
    },3500);
    $("#draw_result1").animate({
        "opacity":"0"
    },2000,"linear");
}
function sure2(){
    sure_common();
    reset();
    $("#draw_result1").css("opacity","1");
    $(".stage3").addClass("out");
    $("#draw_result1").animate({
        "left":"1.9rem",
        "top":"1rem",
        "opacity":'0'
    },1000,"linear");
    setTimeout(function(){
        $(".spiderCon .spider").addClass("done");
    },3000);
    setTimeout(function(){
        $("#game").removeClass("s3");
        $("#game").addClass("s4");
        $("#sure").attr("data-id","sure3");
        $("#draw_result").animate({
            "left":"30%"
        },2000,"linear");
    },5500);
    $(".stage3 .tips").fadeOut();
    $(".s3 .btn").fadeOut();


}
function sure3(){
    sure_common();
    reset();
    $(".stage5").addClass("out");
    $("#draw_result1").css("opacity","1");
    $("#draw_result1").animate({
        "left":"70%",
        "top":"80%",
        "opacity":"0"
    },1000,"linear");
    $(".stage5 .tips").fadeOut();
    $(".s5 .btn").fadeOut();
}
function sure4(){
    sure_common();
    $(".stage6 .arrow").css({
        "width":(maxX-minX)*1.5+"px",
        "left":minX+"px",
        "top":minY+(maxY-minY)/2+"px",
        "opacity":"1"
    });
    setTimeout(function(){
        $(".witchCon").css({
            "-webkit-transform":"rotateZ(-20deg)"
        })
    },1000);

    reset();

    $(".stage6").addClass("out");
    $("#draw_result1").css("opacity","1");
    $(".stage6 .tips").fadeOut();
    $(".s6 .btn").fadeOut();
    $("#draw_result1").animate({
        "opacity":"0"
    },1000,"linear");
    $(".stage6 .arrow").animate({
        "width":"0.89rem",
        "left":"1.05rem",
        "top":"2.8rem",
        "opacity":"1"
    },400,"linear");

}
function onUp(e){
    flag = true;
    rec = new Phaser.Rectangle(minX, minY, maxX-minX, maxY-minY);
}
function paint(pointer,x,y) {
    if(!ifDone){
        ifDone = true;
    }
    if(flag){
        beforeX=x;
        beforeY=y;
        flag = false;
    }
    if(init){
        maxX = x;
        minX = x;
        maxY = y;
        minY = y;
        init = false;
    }
    if(
        x<(winWidth-$(".drawCon").width())/2||
            x>winWidth-((winWidth-$(".drawCon").width())/2)||
            y<winHeight*0.2||
            y>winHeight*0.2+$(".drawCon").height()
    ){
        beforeX=x;
        beforeY=y;
        return;
    }
    bmd.line(beforeX, beforeY, x, y, '#5C5C5C',2);
    beforeX=x;
    beforeY=y;
    if(game.input.activePointer.position.x>maxX){
        maxX = x;
    }
    if(game.input.activePointer.position.x<minX){
        minX = x;
    }
    if(game.input.activePointer.position.y>maxY){
        maxY = y;
    }
    if(game.input.activePointer.position.y<minY){
        minY = y;
    }
}
function paint_all(pointer,x,y) {
    if(!ifDone){
        ifDone = true;
    }
    if(flag){
        beforeX=x;
        beforeY=y;
        flag = false;
    }
    if(init){
        maxX = x;
        minX = x;
        maxY = y;
        minY = y;
        init = false;
    }
    bmd.line(beforeX, beforeY, x, y, '#5C5C5C',2);
    beforeX=x;
    beforeY=y;
    if(game.input.activePointer.position.x>maxX){
        maxX = x;
    }
    if(game.input.activePointer.position.x<minX){
        minX = x;
    }
    if(game.input.activePointer.position.y>maxY){
        maxY = y;
    }
    if(game.input.activePointer.position.y<minY){
        minY = y;
    }
}
function update() {
    for (var i=0, len = stars.length; i < len; i++)
    {
        stars[i].x = stars[i].ox + waveform[stars[i].cx].x;
        stars[i].y = stars[i].oy + waveform[stars[i].cy].y;
        stars[i].cx++;

        if (stars[i].cx > xl)
        {
            stars[i].cx = 0;
        }
        stars[i].cy++;

        if (stars[i].cy > yl)
        {
            stars[i].cy = 0;
        }

    }

}

function render() {

}
function jssdkIndex(){
    $.ajax({
        url:'http://wxjz.zjqq.mobi/data/h5card/index',
        data:{id:getPar(),url:window.location.href},
        type:'POST',
        dataType:'json',
        success:function(res){
            if(res.state == 'ok'){
                wx.config({
                    debug: false,
                    appId: res.data.signPackage.appId,
                    timestamp: res.data.signPackage.timestamp,
                    nonceStr: res.data.signPackage.nonceStr,
                    signature: res.data.signPackage.signature,
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone',
                        'checkJsApi',
                        'addCard'
                    ]
                });
                wx.ready(function () {
                    wx.onMenuShareAppMessage(shareData);
                    wx.onMenuShareTimeline(shareData);
                    wx.onMenuShareQQ(shareData);
                    wx.onMenuShareWeibo(shareData);
                    wx.onMenuShareQZone(shareData);
                });
                cardid = res.data.signCard.cardId;
                nonce_str = res.data.signCard.nonce_str;
                timestamp = res.data.signCard.timestamp;
                signature = res.data.signCard.signature;
            } else {
                console.log(res.msg)
            }
        }
    });
}
//获取get参数id
function getPar(){
    //获取当前URL
    var local_url = document.location.href;
    var get_par = local_url.lastIndexOf("#")>-1?local_url.substring(local_url.lastIndexOf("#")+1):"";
    return get_par;
}

function lazyLoad(t){
    $(t).each(function(i,e){
        $(e).attr("src",$(e).attr("data-src"));
    })

}
Pace.on("hide", function () {
    $(".container").addClass("cover");
    lazyLoad(".stage1 img");
//        $(".container").addClass("game");
//        $("#game").addClass("s7");
});
$(function(){
    jssdkIndex();
    $(document).on("touchstart",".page_cover",function(e){e.preventDefault()});
    for(var i = 0;i<100;i++){
        var size = parseInt(Math.random()*2+3);
        var left = (Math.random()*100).toFixed(1);
        var top = (Math.random()*100).toFixed(1);
        var delay = Math.random().toFixed(1);
        var str = '<i style="-webkit-animation-delay:'+delay+'s;width: '+size+'px;height:'+size+'px;left:'+left+'%;top:'+top+'%;background-color:#fff;"></i>'
        $("#star").append(str);
    }
    audiojs.events.ready(function() {
        var as = audiojs.create(document.getElementsByTagName("audio")[0],{
            css:false,
            createPlayer: {
                markup: false,
                playPauseClass: 'play-pauseZ',
                scrubberClass: 'scrubberZ',
                progressClass: 'progressZ',
                loaderClass: 'loadedZ',
                timeClass: 'timeZ',
                durationClass: 'durationZ',
                playedClass: 'playedZ',
                errorMessageClass: 'error-messageZ',
                playingClass: 'playingZ'
            }
        });
    });
    $(document).on("webkitAnimationEnd",".page_cover .bottom .start",function(){
        $(document).on("tap",".page_cover",function(){

            $(".container").removeClass("cover");
            $(".page_cover").addClass("out");
            setTimeout(function(){
                $(".container").addClass("game");
                $("#game").addClass("s1");
                lazyLoad(".stage2 img");
            },3200);
        });
    });
    $(document).on("webkitAnimationEnd",".stage1 .text.text2",function(){
        game.input.addMoveCallback(paint, this);
        $(".s1 .btn").fadeIn();
    });
    $(document).on("webkitAnimationEnd",".stage2 .text.text2",function(){
        game.input.addMoveCallback(paint_all, this);
        $(".s2 .btn").fadeIn();
        lazyLoad(".stage3 img");
    });
    $(document).on("webkitAnimationEnd",".stage3 .text.text1",function(){
        game.input.addMoveCallback(paint_all, this);
        $(".s3 .btn").fadeIn();
        lazyLoad(".stage4 img");
        lazyLoad(".stage5 img");
    });
    $(document).on("webkitAnimationEnd",".stage4 .text.text2",function(){
        $("#game").removeClass("s4");
        $("#game").addClass("s5");
        setTimeout(function(){
            $(".devilCon").animate({
                "-webkit-transform":"translateX(-100%)"
            },2000,"linear");
        },2000);

        $("#draw_result").animate({
            "left":"0"
        },2000,"linear");
    });
    $(document).on("webkitAnimationEnd",".stage5 .text.text2",function(){
        game.input.addMoveCallback(paint_all, this);
        $(".s5 .btn").fadeIn();
        lazyLoad(".stage6 img");
    });
    $(document).on("webkitAnimationEnd",".stage5 .text.text3",function(){
        $("#game").removeClass("s5");
        $("#game").addClass("s6");
        $("#sure").attr("data-id","sure4");
    });
    $(document).on("webkitAnimationEnd",".stage6 .text.text2",function(){
        game.input.addMoveCallback(paint_all, this);
        $(".s6 .btn").fadeIn();
        lazyLoad(".stage7 img");
    });
    $(document).on("webkitAnimationEnd",".stage6 .text.text3",function(){
        $(".stage6 .arrow").hide();
        $("#draw_result").animate({
            "opacity":"0"
        },2000,"linear");
        $("canvas").css("display","none");
        $("#game").removeClass("s6");
        $("#game").addClass("s7");
        mySwiper = new Swiper('.swiper-container', {
            pagination : '.swiper-pagination',
            prevButton:'.swiper-button-prev',
            nextButton:'.swiper-button-next',
        })
    });
    $(document).on("tap","#sure",function(){
        if(!ifDone){
            return;
        }
        var id = $(this).attr("data-id");
        switch (id){
            case "sure":
                sure();
                break;
            case "sure1":
                sure1();
                break;
            case "sure2":
                sure2();
                break;
            case "sure3":
                sure3();
                break;
            case "sure4":
                sure4();
                break;
            default :
                break;
        }
    });
    $(document).on("tap",".again",function(){
        reset();
        bmd.clear();
    });
    $(document).on("tap",".stage7 .zh",function(){
        $(".stage7").addClass("active")
    });
    $(document).one("webkitAnimationEnd",".stage7 .resultCon",function(){
        $(".stage7 .resultCon,.stage7 .btnGroup").addClass("out");
    });
    $(document).on("tap",".stage7 .btnGroup .button",function(){
        var id = $(this).attr("data-id");
        switch (id){
            case "more":
                window.location.reload();
                break;
            case "share":
                $(".stage7 .shareCon").fadeIn();
                break;
            case "detail":
                $(".swiperCon").addClass("active");
                break;
            case "card":
                wx.addCard({
                    cardList: [
                        {
                            cardId: cardid,
                            cardExt: '{"nonce_str":"'+nonce_str+'","timestamp":"'+timestamp+'","signature":"'+signature+'"}'
                        }
                    ],
                    success: function (res) {
                        alert('已添加卡券');
                    }
                });
                break;
            default :
                break;
        }
    });
    $(document).on("tap",".stage7 .swiperCon .close",function(){
        $(".swiperCon").removeClass("active");
    })
    $(document).on("tap",".stage7 .resultCon .color",function(){
        $(".swiperCon").addClass("active");
        var index = $(this).attr("data-index");
        mySwiper.slideTo(index,1000,false);
    });
    $(document).on("tap",".stage7 .shareCon",function(){
        $(this).fadeOut();
    })
})
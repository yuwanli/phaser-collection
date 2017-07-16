var winWidth = window.innerWidth;
var winHeight = window.innerHeight;
//var imagesPath = 'http://mat1.gtimg.com/zj/yuwanli/dzw1609/photo/images/';
var imagesPath = '../images/';
var game = new Phaser.Game(winWidth, winHeight, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });

var group_bg;//月亮和星星
var group_dash_behind;//人物虚线框 后排
var group_dash_front;//人物虚线框 前排
var group_person_behind;//后排人物
var group_person_behind_move;//后排人物 移动
var group_person_front_move;//前排人物 移动
var group_person_front;//前排人物
var group_move;//待拖动人物
var group_mask;//矩形块
var mask_1;//矩形框内背景
var mask_2;//矩形框下方遮罩
var mask_3;//矩形框左方遮罩
var mask_4;//矩形框右方遮罩
var mask_5;//矩形框上方遮罩
var index = 0;//已成功拖到矩形框内的人物位置索引
var count = 0;
var array = [];//记录未显示在待拖动区域的人物索引
var array_move = [];//记录待拖动区域的空位置索引
var rectangle;//矩形框
var moveIndex =0;//移除矩形框的人物索引
var text;
var shoot;//拍照按钮
var moon;//月亮
var kacha;
var time;
var moveFlag = false;


var ratio = parseInt(document.getElementById("html").getAttribute("data-dpr"))/2;
var distance = 100*ratio;
var toTop = 0.06*winHeight.toFixed(0)*ratio;
var toRectangle = 0.35*winHeight.toFixed(0);
var rectangleWidth = 590*ratio;
var rectangleHeight = 386*ratio;
var dashWidth = 120*ratio;
var personWidth = 150*ratio;
var headWidth = 124*ratio;
var headHeight = 190*ratio;



function preload(){
    game.load.image('rectangle', imagesPath+"rectangle.png");
    game.load.image('moon', imagesPath+"moon.png");
    game.load.image('dash', imagesPath+"dash.png");
    game.load.spritesheet('take_photo', imagesPath+"take_photo.png");
    game.load.spritesheet('person_head', imagesPath + 'person_head.png',124,190);
    game.load.spritesheet('person_all', imagesPath + 'person.png',150,354);
    game.load.audio('kacha', imagesPath + 'kacha.mp3');
}
function create(){
    game.stage.backgroundColor = '#4B4387';
    mask_1 = game.add.bitmapData(winWidth,winHeight);
    mask_1.context.fillStyle = "#3F3678";
    mask_1.context.fillRect((winWidth-rectangleWidth)/2, toTop, rectangleWidth, rectangleHeight);
    mask_1.addToWorld();
    group_bg = game.add.group();
    group_dash_behind = game.add.group();
    group_person_behind = game.add.group();
    group_person_behind_move = game.add.group();
    group_dash_front = game.add.group();
    group_person_front = game.add.group();
    group_person_front_move = game.add.group();
    group_mask = game.add.group();
    mask_2 = game.add.bitmapData(winWidth,winHeight);
    mask_2.context.fillStyle = "#4B4387";
    mask_2.context.fillRect((winWidth-rectangleWidth)/2, rectangleHeight+toTop, rectangleWidth, rectangleHeight);
    mask_2.addToWorld();
    mask_3 = game.add.bitmapData(winWidth,winHeight);
    mask_3.context.fillStyle = "#4B4387";
    mask_3.context.fillRect(0, toTop, (winWidth-rectangleWidth)/2, rectangleHeight*2);
    mask_3.addToWorld();
    mask_4 = game.add.bitmapData(winWidth,winHeight);
    mask_4.context.fillStyle = "#4B4387";
    mask_4.context.fillRect(winWidth-(winWidth-rectangleWidth)/2, toTop, (winWidth-rectangleWidth)/2, rectangleHeight*2);
    mask_4.addToWorld();
    mask_5 = game.add.bitmapData(winWidth,winHeight);
    mask_5.context.fillStyle = "#4B4387";
    mask_5.context.fillRect(0, 0, winWidth, toTop);
    mask_5.addToWorld();
    var fontSize = 28*ratio;
    var style = { font: "bold "+fontSize+"px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    text = game.add.text(0, 0, "将人物拖动至上方照片内", style);
    text.setTextBounds(0, 0.7*winHeight, winWidth, 100);
    group_move = game.add.group();
    rectangle = game.add.sprite(winWidth/2, toTop, 'rectangle');
    rectangle.anchor.set(0.5,0,5);
    rectangle.scale.set(ratio,ratio);
    group_mask.add(rectangle);
    kacha = game.add.audio('kacha');
}
function update(){

}
function init(){
    var color=["FFFFFF","ADADFF"];
    for(var i = 0;i<50;i++){
        var cor = color[parseInt(Math.random()*2)];
        var size = parseInt(Math.random()*2+6)*ratio;
        var left = (Math.random()*rectangleWidth+(winWidth-rectangleWidth)/2).toFixed(1);
        var top = (Math.random()*rectangleHeight+toTop).toFixed(1);
        var graphics = game.add.graphics(left, top);
        var delayNum = parseInt(Math.random()*10);
        graphics.beginFill("0x"+cor, 1);
        graphics.drawCircle(size,size,size);
        group_bg.add(graphics);
    }
    moon = game.add.sprite(winWidth/2, toTop+0.5*rectangleHeight, 'moon');
    moon.scale.set(ratio*2,ratio*2);
    group_bg.add(moon);
    game.add.tween(moon.scale).to({x:ratio,y:ratio},2000,Phaser.Easing.Quadratic.In,true);
    game.add.tween(moon.position).to({x:(winWidth-rectangleWidth)/2+30,y:toTop+20},2000,Phaser.Easing.Quadratic.In,true);

    for(var i = 0;i<7;i++){
        var d = game.add.sprite(0,0, 'dash');
        d.scale.set(ratio,ratio);
        d.alpha = 0;
        if(i<4){
            d.position.x = (winWidth- d.width*4)/2+(i*d.width);
            d.position.y = rectangle.height+rectangle.top- d.height;
            group_dash_front.add(d);
        }else{
            d.position.x = (winWidth-d.width*3)/2+((i-4)*d.width);
            d.position.y = rectangle.height+rectangle.top- d.height-distance;
            group_dash_behind.add(d);
        }
    }
    for(var i = 0;i<7;i++){
        if(i<3){
            var p = game.add.sprite(0,0, 'person_head',i);
            p.scale.set(ratio,ratio);
            p.position.x = (winWidth-p.width*4)/2+i*p.width+3*i*(p.width*4/3-p.width)/2+0.5*winWidth;
            p.position.y = rectangle.height+rectangle.top- p.height+toRectangle-(100*ratio);
            p.positionIndex = i;
            p.name = i;
            p.inputEnabled = true;
            p.input.enableDrag();
            p.events.onDragUpdate.add(dragUpdate, this);
            p.events.onDragStop.add(dropHandler, this);
            group_move.add(p);
            game.add.tween(p.position).to({x:(winWidth-p.width*4)/2+i*p.width+3*i*(p.width*4/3-p.width)/2},2000,Phaser.Linear,true);
        }else{
            array.push(i);
        }
    }
    shoot = game.add.button(winWidth/2, 0.8*winHeight, 'take_photo',shoot,this);
    shoot.scale.set(ratio,ratio);
    shoot.anchor.set(0.5,0,5);
    shoot.alpha = 0;
    game.time.events.loop(Phaser.Timer.SECOND *1, moveOut, this);
}
function moveOut(e){
    var r = game.rnd.integerInRange(1, 2);
    var newTime = game.time.events.add(Phaser.Timer.SECOND * r, function(){
        if(group_person_front.children.length==0&&group_person_behind.children.length==0){
            return;
        }
        if(moveIndex<4){
            var n = parseInt(group_person_front.children[0].name);
            var i = group_person_front.children[0].positionIndex;
            var p_b = game.add.sprite(0,0, 'person_all',n);
            p_b.scale.set(ratio,ratio);
            p_b.position.x = (winWidth-dashWidth*4)/2+((i)*dashWidth)-(15*ratio);
            p_b.position.y = rectangle.height+rectangle.top- p_b.height+160*ratio-6;
            p_b.alpha = 0.8;
            group_person_front_move.add(p_b);
            group_person_front.children[0].destroy();
            var random = game.rnd.integerInRange(1, 2);
            var a = random==1?(winWidth-rectangleWidth)/2-dashWidth:winWidth-(winWidth-rectangleWidth)/2;
            var t = random==1?
            (p_b.position.x+dashWidth)/(winWidth/2-dashWidth-15*ratio):(winWidth-p_b.position.x)/(winWidth/2-dashWidth-15*ratio);
            moveFlag = true;
            group_dash_front.children[i].alpha = 1;
            var s = game.add.tween(p_b).
                to({x: a},
                (t*500).toFixed(0),
                Phaser.Linear,
                true);
            s.onComplete.addOnce(function(){
                moveFlag = false;
                p_b.destroy();
                array.push(n);
                count--;
                group_dash_front.children[i].alpha = 0;
                if(group_move.children.length < 3){
                    dispose(null,array_move[0]);
                }
            }, this);

        }
        else{
            var n = parseInt(group_person_behind.children[0].name);
            var i = group_person_behind.children[0].positionIndex;
            var p_b = game.add.sprite(0,0, 'person_all',n);
            p_b.scale.set(ratio,ratio);
            p_b.position.x = (winWidth-dashWidth*3)/2+((i)*dashWidth)-(15*ratio);
            p_b.position.y = rectangle.height+rectangle.top- p_b.height-100*ratio+160*ratio-3;
            p_b.alpha = 0.8;
            group_person_behind_move.add(p_b);
            var random = game.rnd.integerInRange(1, 2);
            var a = random==1?(winWidth-rectangleWidth)/2-dashWidth:winWidth-(winWidth-rectangleWidth)/2;
            var t =  random==1?
            (p_b.position.x+dashWidth)/(winWidth/2-dashWidth-15*ratio):(winWidth-p_b.position.x)/(winWidth/2-dashWidth-15*ratio);
            group_dash_behind.children[i].alpha = 1;
            moveFlag = true;
            var s = game.add.tween(p_b).
                to({x: a},
                (t*500).toFixed(0),
                Phaser.Linear,
                true);
            s.onComplete.addOnce(function(){
                moveFlag = false;
                p_b.destroy();
                array.push(n);
                count--;
                group_dash_behind.children[i].alpha = 0;
                if(group_move.children.length < 3){
                    dispose(null,array_move[0]);
                }
            }, this);
            group_person_behind.children[0].destroy();
        }
        moveIndex++;
        if(moveIndex==7){
            moveIndex = 0;
        }
    }, this);


}
function dragUpdate(e){
    if(judgeDrop(e)){
        if(index == 7){
            index = 0;
        }
        if(index<4){
            group_dash_front.children[index].alpha=1;
        }else{
            group_dash_behind.children[index-4].alpha=1;
        }
    }else{
        if(index == 7){
            return;
        }
        if(index<4){
            group_dash_front.children[index].alpha=0;
        }else{
            group_dash_behind.children[index-4].alpha=0;
        }
    }
}
function dropHandler(e){//释放目标元素生成新的目标元素
    var a = parseInt(e.name);
    var b = e.positionIndex;
    if(judgeDrop(e)){
        if(index == 7){
            index = 0;
        }
        if(index<4){
            group_dash_front.children[index].alpha=0;
        }else{
            group_dash_behind.children[index-4].alpha=0;
        }
        dispose(e,b);
        generate(a);
    }else{
        game.add.tween(e.position).
            to({x: (winWidth-dashWidth*4)/2+b*e.width+3*b*(dashWidth*4/3-e.width)/2, y: rectangle.height+rectangle.top- e.height-100*ratio+toRectangle},
            150,
            Phaser.Easing.Cubic.InOut,
            true);
    }
}
function dispose(e,b){
    if(e){
        e.destroy();
        array_move.push(b);
    }
    var a = parseInt(array_move[0]);
    if(isNaN(array[0])){
        return
    }else{
        array_move.splice(0,1);
    }
    var k = parseInt(array.splice(0,1));
    var p_h = game.add.sprite(0,0, 'person_head',k);
    p_h.scale.set(ratio,ratio);
    p_h.positionIndex = b;
    p_h.name = k;
    p_h.position.x = (winWidth-dashWidth*4)/2+a*p_h.width+3*a*((dashWidth*4/3)-p_h.width)/2;
    p_h.position.y = rectangle.height+rectangle.top- p_h.height-(100*ratio)+toRectangle;
    p_h.inputEnabled = true;
    p_h.input.enableDrag();
    p_h.events.onDragUpdate.add(dragUpdate, this);
    p_h.events.onDragStop.add(dropHandler, this);
    group_move.add(p_h);
}
function generate(i){
    var p_b = game.add.sprite(0,0, 'person_all',i);
    p_b.scale.set(ratio,ratio);
    if(index<4){
        p_b.position.x = (winWidth-dashWidth*4)/2+((index)*dashWidth)-(15*ratio);
        p_b.position.y = rectangle.height+rectangle.top- p_b.height+160*ratio-6;
        p_b.positionIndex = index;
        p_b.name = i;
        group_person_front.add(p_b);
    }else{
        p_b.position.x = (winWidth-dashWidth*3)/2+((index-4)*dashWidth)-(15*ratio);
        p_b.position.y = rectangle.height+rectangle.top- p_b.height-100*ratio+160*ratio-3;
        p_b.positionIndex = index-4;
        p_b.name = i;
        group_person_behind.add(p_b);
    }
    count++;
    index++;
    //moveFlag = false;
}

function shootFlash(){
    white.style.display = 'none';
    white.setAttribute('class','abs white');
    white.style.display = 'block';
    setTimeout(function(){
        white.setAttribute('class','abs white flash');
        white.style.display = 'none';
    },100);
}

function judgeDrop(e){//判断是否进入矩形线框中
    //console.log(index);
    if(count ==7){
        return false;
    }
    if(
        e.y>toTop-headHeight/4
        &&e.y<rectangleHeight+toTop-headHeight/4*3
        &&e.x>(winWidth-rectangleWidth)/4
        &&e.x<winWidth-(winWidth-rectangleWidth)/4
    ){
        return true;
    }else{
        return false;
    }
}
function shoot(){
    kacha.play();
    shootFlash();
    shoot.alpha = 0;
    var bmd = game.make.bitmapData(rectangleWidth, rectangleHeight);
    var bmd1 = game.make.bitmapData(rectangleWidth, rectangleWidth);
    var bmd_draw = game.make.bitmapData(game.width, game.height);
    bmd_draw.drawFull(game.world);
    var photo = bmd.copy(bmd_draw, (winWidth-rectangleWidth)/2, toTop, rectangleWidth, rectangleHeight,0,0, rectangleWidth, rectangleHeight);
    var photo1 = bmd1.copy(bmd_draw, (winWidth-rectangleWidth)/2, toTop-(rectangleWidth-rectangleHeight)/2, rectangleWidth, rectangleWidth,0,0, rectangleWidth, rectangleWidth);
    $(".container").removeClass("game").addClass("result");
    $("#result").attr("src",photo.canvas.toDataURL());
    creatImg(photo1.canvas.toDataURL());
    //console.log(moveFlag);
    if(count == 7&&!moveFlag){
        $('.page1').removeClass("failed");
        window.shareData.tTitle = "终于抓住乱跑的熊孩子了！拍摄全家福太不容易了！";
    }else{
        $('.page1').addClass("failed");
        window.shareData.tTitle = "家里人聚齐实在太困难了！熊孩子总乱跑，臣妾抓不到啊！！！";
    }
}
function RndNum(n){
    var rnd="";
    for(var i=0;i<n;i++)
        rnd+=Math.floor(Math.random()*10);
    return rnd;
}
function creatImg(c){
    var timestamp = new Date().getTime();
    var user = timestamp + RndNum(4);
    var updata = {
        'user': user,
        'img_base64': c.replace(/^data:image\/(png|jpg);base64,/, "")
    }
    $.ajax({
        cache: true,
        type: "post",
        url:'http://vip.zjqq.mobi/tool/base64ToImg',
        data:updata,
        dataType:"json",
        async: true,
        error: function(request) {
            alert("fail");
        },
        success: function(data) {
            var img = new Image();
            img.onload = function(){
                alert("11");
                window.shareData.imgUrl = data.path;
            }
            img.src = data.path;
        }
    });
}

$(function(){
    function orient(){
        if(window.orientation!=0){
            $(".error").show();
        }else{
            $(".error").hide();
        }
    }
    window.addEventListener('orientationchange', function(){
        orient();
    }, false);
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
    var color=["#FFFFFF","#ADADFF"];
    for(var i = 0;i<100;i++){
        var cor = color[parseInt(Math.random()*2)];
        var size = parseInt(Math.random()*4+6)*ratio;
        var left = (Math.random()*100).toFixed(1);
        var top = (Math.random()*100).toFixed(1);
        var delay = Math.random().toFixed(1);
        var str = '<i style="-webkit-animation-delay:'+delay+'s;width: '+size+'px;height:'+size+'px;left:'+left+'%;top:'+top+'%;background-color:'+cor+'"></i>'
        $("#star").append(str);
    }
    $("#enter").on("tap",function(){
        $(".container").removeClass("cover").addClass("rule");
    });
    $("#start").on("tap",function(){
        $(".container").removeClass("rule").addClass("game");
        shoot.alpha = 1;
    });
    $("#more").on("tap",function(){
        $(".page1").removeClass("failed");
        $(".container").removeClass("result").addClass("game");
        shoot.alpha = 1;
    });
    $("#share").on("tap",function(){
        $(".page1 .shareCon").fadeIn();
    });
    $(".page1 .shareCon").on('tap',function(){
        $(".page1 .shareCon").fadeOut();
    })
})
var winWidth = window.innerWidth;
var winHeight = window.innerHeight;
var game = new Phaser.Game(winWidth, winHeight, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });
var imagesPath = '../img/';

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
var index = 0;//已成功拖到矩形框内的人物位置索引
var count = 0;
var array = [];//记录未显示在待拖动区域的人物索引
var array_move = [];//记录待拖动区域的空位置索引
var rectangle;//矩形框
var moveIndex =0;//移除矩形框的人物索引
var text;
var shoot;//拍照按钮
var toTop = 0.06*winHeight.toFixed(0);
var toRectangle = 0.35*winHeight.toFixed(0);
var time;
var rectangleWidth = 590;
var rectangleHeight = 386;



var white = document.getElementById('white');
function shootFlash(){
    white.style.display = 'none';
    white.setAttribute('class','abs white');
    white.style.display = 'block';
    setTimeout(function(){
        white.setAttribute('class','abs white flash');
        white.style.display = 'none';
    },100);
}


function preload(){
    //game.load.image('moon', imagesPath+"game_moon.png");
    game.load.image('rectangle', imagesPath+"rectangle.png");
    game.load.image('dash', imagesPath+"dash.png");
    game.load.spritesheet('take_photo', imagesPath+"take_photo.png");
    game.load.spritesheet('person_head', imagesPath + 'person_head.png',124,190);
    game.load.spritesheet('person_all', imagesPath + 'person.png',150,354);
}
function create(){
    game.load.audio('kacha', imagesPath + 'kacha.mp3');
    game.stage.backgroundColor = '#4B4387';
    mask_1 = game.add.bitmapData(winWidth,winHeight);
    mask_1.context.fillStyle = "#3F3678";
    mask_1.context.fillRect((winWidth-rectangleWidth)/2, toTop, rectangleWidth, rectangleHeight);
    mask_1.addToWorld();
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
    shoot = game.add.button(winWidth/2, 0.8*winHeight, 'take_photo',shoot,this);
    shoot.anchor.set(0.5,0,5);
    var style = { font: "bold 28px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    text = game.add.text(0, 0, "将人物拖动至上方照片内", style);
    text.setTextBounds(0, 0.7*winHeight, winWidth, 100);
    group_move = game.add.group();
    rectangle = game.add.sprite(winWidth/2, toTop, 'rectangle');
    rectangle.anchor.set(0.5,0,5);
    group_mask.add(rectangle);
    for(var i = 0;i<7;i++){
        var d = game.add.sprite(0,0, 'dash');
        if(i<4){
            d.position.x = (winWidth-480)/2+(i*120);
            d.position.y = rectangle.height+rectangle.top- d.height;
            group_dash_front.add(d);
        }else{
            d.position.x = (winWidth-360)/2+((i-4)*120);
            d.position.y = rectangle.height+rectangle.top- d.height-100;
            group_dash_behind.add(d);
        }
    }
    for(var i = 0;i<7;i++){
        if(i<3){
            var p = game.add.sprite(0,0, 'person_head',i);
            p.position.x = (winWidth-480)/2+i*p.width+3*i*(160-p.width)/2;
            p.position.y = rectangle.height+rectangle.top- p.height-100+toRectangle;
            p.positionIndex = i;
            p.name = i;
            p.inputEnabled = true;
            p.input.enableDrag();
            p.events.onDragUpdate.add(dragUpdate, this);
            p.events.onDragStop.add(dropHandler, this);
            group_move.add(p);
        }else{
            array.push(i);
        }
    }
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
            console.log("random:"+r+" name:"+n);
            var i = group_person_front.children[0].positionIndex;
            var p_b = game.add.sprite(0,0, 'person_all',n);
            p_b.position.x = (winWidth-496)/2+((i)*120)-8;
            p_b.position.y = rectangle.height+rectangle.top- p_b.height+160-6;
            group_person_front_move.add(p_b);
            var a = game.rnd.integerInRange(1, 2)==1?-75:winWidth+75;
            var s = game.add.tween(p_b).
                to({x: a,alpha:0.5},
                1000,
                Phaser.Easing.Cubic.In,
                true);
            s.onComplete.addOnce(function(){
                p_b.destroy();
                array.push(n);
                count--;
                if(group_move.children.length < 3){
                    dispose(null,array_move[0]);
                }
            }, this);
            group_dash_front.children[i].alpha = 1;
            group_person_front.children[0].destroy();
        }
        else{
            var n = parseInt(group_person_behind.children[0].name);
            console.log("random:"+r+" name:"+n);
            var i = group_person_behind.children[0].positionIndex;
            var copy = group_person_behind.children[0];
            var p_b = game.add.sprite(0,0, 'person_all',n);
            p_b.position.x = (winWidth-372)/2+((i)*120)-8;
            p_b.position.y = rectangle.height+rectangle.top- p_b.height-100+160-3;
            group_person_behind_move.add(p_b);
            var a = game.rnd.integerInRange(1, 2)==1?-75:winWidth+75;
            var s = game.add.tween(p_b).
                to({x: a,alpha:0.5},
                1000,
                Phaser.Easing.Cubic.In,
                true);
            s.onComplete.addOnce(function(){
                p_b.destroy();
                array.push(n);
                count--;
                if(group_move.children.length < 3){
                    dispose(null,array_move[0]);
                }
            }, this);
            group_dash_behind.children[i].alpha = 1;
            group_person_behind.children[0].destroy();
        }
        moveIndex++;
        if(moveIndex==7){
            moveIndex = 0;
        }
    }, this);


}
function judgeDrop(e){
    //console.log(index);
    if(count ==7){
        return false;
    }
    if(
        e.y>toTop
        &&e.y<rectangleHeight+toTop
        &&e.x>(winWidth-rectangleWidth)/2-10
        &&e.x<winWidth-((winWidth-rectangleWidth)/2+60)+10
    ){
        //alert("ok");
        return true;
    }else{
        return false;
    }
}
function dragUpdate(e){
    if(judgeDrop(e)){
        game.add.tween(e.scale).
            to({x: 0.9, y: 0.9},
            100,
            Phaser.Easing.Linear.In,
            true);
    }else{
        game.add.tween(e.scale).
            to({x: 1, y: 1},
            100,
            Phaser.Easing.Linear.Out,
            true);
    }
}
function dropHandler(e,p){
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
        //if(time == null){
        //    var r = game.rnd.integerInRange(1, 2);
        //    time = game.time.events.add(Phaser.Timer.SECOND * r, moveOut, this);
        //    console.log("r:"+r+" init:"+time);
        //}

    }else{
        game.add.tween(e.position).
            to({x: (winWidth-480)/2+b*e.width+3*b*(160-e.width)/2, y: rectangle.height+rectangle.top- e.height-100+toRectangle},
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
    p_h.positionIndex = b;
    p_h.name = k;
    p_h.position.x = (winWidth-480)/2+a*p_h.width+3*a*(160-p_h.width)/2;
    p_h.position.y = rectangle.height+rectangle.top- p_h.height-100+toRectangle;
    p_h.inputEnabled = true;
    p_h.input.enableDrag();
    p_h.events.onDragUpdate.add(dragUpdate, this);
    p_h.events.onDragStop.add(dropHandler, this);
    group_move.add(p_h);
}
function generate(i){
    var p_b = game.add.sprite(0,0, 'person_all',i);
    if(index<4){
        p_b.position.x = (winWidth-496)/2+((index)*124)-8;
        p_b.position.y = rectangle.height+rectangle.top- p_b.height+160-6;
        p_b.positionIndex = index;
        p_b.name = i;
        group_person_front.add(p_b);
    }else{
        p_b.position.x = (winWidth-372)/2+((index-4)*124)-8;
        p_b.position.y = rectangle.height+rectangle.top- p_b.height-100+160-3;
        p_b.positionIndex = index-4;
        p_b.name = i;
        group_person_behind.add(p_b);
    }
    count++;
    index++;
}
function shoot(){
    shootFlash();
    var bmd = game.make.bitmapData(game.width, game.height);
    var bmd_draw = game.make.bitmapData(game.width, game.height);
    bmd_draw.drawFull(game.world);
    var photo = bmd.copy(bmd_draw, (winWidth-rectangleWidth)/2, toTop, rectangleWidth, rectangleHeight,10,0, rectangleWidth, rectangleHeight);
    photo.addToWorld();
}
function update(){}


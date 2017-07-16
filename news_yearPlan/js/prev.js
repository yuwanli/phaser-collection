var winWidth = window.innerWidth;
var winHeight = window.innerHeight;
var Game = {
    init:function(){
        var _this = this

        _this.game = new Phaser.Game(winWidth, winHeight, Phaser.AUTO, 'game', { preload: _this.preload, create: _this.create, update: _this.update ,render:_this.render},true);
    },
    preload:function(){//58
        var _this = this
        _this.left =0.68*ratio;
        _this.top = 0.6*ratio;
        _this.player_v = 300;//人物移动速度
        _this.index = 0;
        _this.diceCan = false;//骰子可否被投掷的标志位
        _this.diceNum = false;
        _this.flag = true;
        _this.direction = true;//true为正向    false 为反向
        _this.speak_dir = "";//对话框的方向   0:小人在右侧   1:小人在左侧  2:小人在顶部
        _this.num = 0;//小人行进的步数
        _this.walking = false;//小人是否在行走
        _this.game.load.image('bg', 'images/repeat.jpg');
        _this.game.load.spritesheet("dice","images/dice_group.png",50,50,10);
        _this.game.load.spritesheet("player","images/player.png",82,108,8);
        _this.game.load.image("background","images/background.png");
        _this.game.load.spritesheet("speak_group","images/speak_group.png",338,232,4);
        _this.game.load.spritesheet("diceBtn","images/btn_group.png",180,124,2);
        _this.game.load.image("numCon","images/numCon.png",65,65);
    },
    create:function(){
        var _this = this
        _this.game.physics.startSystem(Phaser.Physics.ARCADE);
        _this.game.world.setBounds(0,0,winWidth,19.3*ratio+200);
        _this.playDice = function () {
            var _this = this
            if(_this.diceCan){
                result["r4"].num++;
                _this.dice.animations.play("diceRun");
                _this.dice_btn.animations.play("btnRun");
                var r = parseInt(Math.random()*100)+100;
                _this.dice.body.velocity.y = -1*r;
                _this.diceCan = false;
                _this.diceNum = true;
                // _this.speak_con.visible = false;
            }
        }
        _this.collideHandle = function () {
            if(_this.diceNum){
                _this.dice.animations.stop("diceRun");
                _this.dice_btn.animations.stop("btnRun");
                var random = parseInt(Math.random()*6);
                _this.dice.frame = random+4
                _this.diceNum = false
                // _this.num = random+1
                _this.num = 4
                _this.direction = true;
                _this.goDes()
            }
        }
        _this.goDes = function(){
            _this.diceCan = false;
            //
            if(_this.num==0){
                var p = jsonData[_this.index];
                _this.diceCan = true;
                _this.initSpeak(p.speak,p);
                _this.walking = false;
                _this.collisionPlayer.x = 0;//important
                _this.collisionPlayer.y = 0;//important
                return
            }
            var p = jsonData[_this.index]
            if(_this.direction){
                _this.player.play(p.dir)
            }else{
                _this.player.play(p._dir)
            }
            if(_this.num>0){
                _this.direction = true;
                _this.walking = true;
                _this.index++;
                if(_this.index==59){
                    _this.getResult()
                    return
                }
                _this.collisionPlayer.x = jsonData[_this.index].x/100*ratio+_this.left
                _this.collisionPlayer.y = jsonData[_this.index].y/100*ratio+_this.top
                var i = _this.index-1
                if(Math.abs(parseInt(jsonData[_this.index].x)-parseInt(jsonData[i].x))>0){
                    if(parseInt(jsonData[_this.index].x)-parseInt(jsonData[i].x)>0){
                        _this.player.body.velocity.x=_this.player_v;
                        console.log("100000000")
                    }else{
                        _this.player.body.velocity.x=-_this.player_v;
                    }
                    _this.player.body.setSize(1,_this.player.height,-0.1*_this.player.width,0)
                }else{
                    _this.player.body.setSize(_this.player.width,1,0,0.1*_this.player.height)
                    _this.player.body.velocity.y=_this.player_v
                }
                // _this.num-=1;
                // _this.goDes(callback)
            }
            if(_this.num<0){
                _this.direction = false;
                _this.walking = true;
                _this.index--;
                _this.collisionPlayer.x = jsonData[_this.index].x/100*ratio+_this.left
                _this.collisionPlayer.y = jsonData[_this.index].y/100*ratio+_this.top
                var i = _this.index+1
                if(Math.abs(parseInt(jsonData[_this.index].x)-parseInt(jsonData[i].x))>0){
                    if(parseInt(jsonData[_this.index].x)-parseInt(jsonData[i].x)>0){
                        _this.player.body.velocity.x=_this.player_v
                    }else{
                        _this.player.body.velocity.x=-_this.player_v
                    }
                    _this.player.body.setSize(1,_this.player.height,-0.1*_this.player.width,0)

                }else{
                    _this.player.body.setSize(_this.player.width,1,0,0.1*_this.player.height)
                    _this.player.body.velocity.y=-_this.player_v
                }
                // _this.num+=1;
            }

        }
        _this.initSpeak = function(status,p){
            if(p.result){
                result[p.result].num++
            }
            if(status){
                _this.speak_dir = status;
                _this.text.text = p.text;
                // $(".infoCon").fadeIn(200)
                _this.diceCan = false;
                $("#text h1").html(p.alertInfo.h1)
                $("#text p").html(p.alertInfo.p)
                switch (status){
                    case "0":
                        _this.speak.anchor.set(0.9,1.2);//0
                        _this.text.anchor.set(0.9,1.2);//0
                        _this.speak.frame = 0
                        break;
                    case "1":
                        _this.speak.anchor.set(0.1,1.2);//1
                        _this.text.anchor.set(0,1.2);//1
                        _this.speak.frame = 1
                        break;
                    case "2":
                        _this.speak.anchor.set(0.9,-0.1);//2
                        _this.text.anchor.set(0.9,-0.1);//2
                        _this.speak.frame = 2
                        break;
                    default:
                        break;
                }
                console.log(p.alertInfo.status)
                if(p.alertInfo.status == "stop"){
                    _this.diceCan = false;
                }
                $(document).one("tap",".page3 .infoCon",function(){
                    // _this.diceCan = false;
                    if(p.alertInfo.status=="stop"){
                        _this.stopThree()
                    }else{
                        var n = parseInt(p.alertInfo.status);
                        if(n>0){
                            result["r6"].num++
                            _this.direction = true
                        }else{
                            result["r5"].num++
                            _this.direction = false
                        }
                        _this.num = n;
                        // _this.player.body.velocity.x = 100
                        _this.goDes();
                        _this.diceCan = false;
                    }
                    _this.speak_con.visible = true;
                    $(this).fadeOut(200);

                })
            }else{
                _this.diceCan = true;
            }
        }
        _this.stopThree = function(){
            _this.countDown.visible = true;
            var n = 3;
            var i = setInterval(function(){
                n--;
                if(n<=0){
                    _this.diceCan = true;
                    clearInterval(i)
                    _this.countDown.visible = false;
                    return
                }
                _this.numText.text = n
            },1000)
        }
        _this.playerCollision = function(){
            _this.flag = true;
            _this.player.body.velocity.x=0
            _this.player.body.velocity.y=0
            _this.collisionPlayer.body.velocity.x=0
            _this.collisionPlayer.body.velocity.y=0
            if(!_this.walking){
                return
            }
            if(_this.direction){
                _this.num-=1;
            }else{
                _this.num+=1;
            }
            _this.goDes()
        }
        _this.initPlayer=function(){
            var _this = this
            var t1 = _this.game.add.tween(_this.player).to({ y: _this.top+0.77*ratio }, 1000, Phaser.Easing.Linear.None, true, 0, 0);
            var t2 = _this.game.add.tween(_this.player).to({ x: _this.left+0.57*ratio }, 1000, Phaser.Easing.Linear.None, false, 0, 0);

            t1.onComplete.add(function(){
                _this.player.animations.play("player_right");
                t2.start()
            },this);
            t2.onComplete.add(function(){
                _this.diceCan = true
            })
        }
        _this.getResult = function () {
            console.log(result)
            var r;
            if(result["r1"].num>=2){
                r = "r1"
            }else if(result["r2"].num>=1){
                r = "r2"
            }else if(result["r3"].num>=2){
                r = "r3"
            }else if(result["r4"].num>=20){
                r = "r4"
            }else if(result["r5"]>=6){
                r = "r5"
            }else if(result["r6"]>=6){
                r = "r6"
            }else if(result["r7"]>=1){
                r = "r7"
            }else if(result["r8"]>=1){
                r = "r8"
            }else if(result["r9"]>=1){
                r = "r9"
            }else if(result["r10"]>=1){
                r = "r10"
            }else{
                r = "r1"+parseInt(Math.random()*2+1)
            }
            var reason = result[r]["reason"]
            var desc = result[r]["desc"]
            var name = result[r]["name"]
            var title = result[r]["title"]
        }
        //group
        _this.game_group = _this.game.add.group();
        _this.dice_group = _this.game.add.group();
        _this.speak_con = _this.game.add.group();
        _this.countDown = _this.game.add.group();

        //bg
        _this.bg = _this.game.add.image(_this.left,_this.top,'background');
        _this.bg.width = 5.20*ratio;
        _this.bg.height = 19.3*ratio;
        _this.game_group.add(_this.bg)

        //dice_group
        _this.dice_btn = _this.game.add.sprite(winWidth-0.52*ratio,winHeight-20,"diceBtn",0);
        _this.dice_btn.width = 1.8*ratio;
        _this.dice_btn.height = 1.24*ratio;
        _this.dice_btn.anchor.set(1,1);
        _this.game.physics.arcade.enable(_this.dice_btn);
        _this.dice_btn.body.setSize(_this.dice_btn.width*2,5,0,-20);
        _this.dice_btn.body.immovable = true;
        _this.dice_btn.inputEnabled = true;
        _this.dice_btn.events.onInputDown.add(_this.playDice,this);
        _this.dice_btn.animations.add("btnRun",[0,1],10,true)
        _this.dice_group.add(_this.dice_btn);

        //dice
        _this.dice = _this.game.add.sprite(winWidth-1.5*ratio,winHeight-95,"dice",4);
        _this.dice.width = 1*ratio;
        _this.dice.height = 1*ratio;
        _this.dice.anchor.set(1,1);
        _this.dice_group.add(_this.dice);
        _this.game.physics.arcade.enable(_this.dice);
        _this.dice.body.gravity.y = 200;
        _this.dice.body.bounce.set(0.5);
        _this.dice.body.collideWorldBounds = true;
        _this.dice.animations.add("diceRun",[0,1,2,3],20,true);

        //player
        _this.player = _this.game.add.sprite(_this.left,0,"player");
        _this.player.anchor.set(0.6,0.8);
        _this.player.width = 0.82*ratio;
        _this.player.height = 1.08*ratio;
        _this.game.physics.arcade.enable(_this.player);
        _this.player.body.setSize(1,_this.player.height,-0.1*_this.player.width,0)
        // _this.player.body.collideWorldBounds = true
        _this.player.animations.add("player_back",[0,1],5,true);
        _this.player.animations.add("player_left",[2,3],5,true);
        _this.player.animations.add("player_down",[4,5],5,true);
        _this.player.animations.add("player_right",[6,7],5,true);
        _this.player.animations.play("player_down");

        //collisionPlayer
        _this.collisionPlayer = _this.game.add.sprite(_this.left,0,"player");
        _this.collisionPlayer.anchor.set(0.5,0.5);
        _this.collisionPlayer.width = 10;
        _this.collisionPlayer.height = 10;
        _this.collisionPlayer.immovable = true;
        _this.game.physics.arcade.enable(_this.collisionPlayer);

        //speak
        _this.speak = _this.game.add.sprite(0,0,"speak_group",1)
        // _this.speak.anchor.set(0.9,-0.1);//2
        // _this.speak.anchor.set(0.9,1.2);//0
        // _this.speak.anchor.set(0.1,1.2);//1
        _this.speak.width = 3.38*ratio;
        _this.speak.height = 2.32*ratio;
        _this.speak_con.add(_this.speak);


        //numCon
        _this.numCon = _this.game.add.image(0,0,"numCon");
        _this.numCon.width = 0.65*ratio;
        _this.numCon.height = 0.65*ratio;
        // _this.numCon.anchor.set(0.7,2.4);
        _this.countDown.add(_this.numCon)

        //numText
        var text_style = {font: "40px Arial", fill: "#000", wordWrapWidth:_this.numCon.width,align: "center", backgroundColor: "#ffff00"};
        _this.numText = _this.game.add.text(0, 0, "3", text_style);
        // _this.numText.anchor.set(0.7,2.4);
        _this.numText.anchor.set(0.5);
        _this.countDown.add(_this.numText);
        _this.countDown.visible = false;
        // _this.countDown.anchor.set(0.7,2.4);

        //text
        var style = {
            font:0.3*ratio+"px myFont",
            wordWrap:true,
            wordWrapWidth:_this.speak.width*0.9,
            align:"center"
        }
        _this.text = _this.game.add.text(_this.game.world.centerX,100,"2016哈哈哈 \n2016哈哈 2016哈哈哈 2016哈哈",style)
        // _this.text1.anchor.set(0.9,-0.1);//2
        // _this.text1.anchor.set(0.9,1.2);//0
        // _this.text.anchor.set(0.1,1.2);//1
        _this.speak_con.add(_this.text)
        // _this.speak_con.visible = false;

        _this.cursors = _this.game.input.keyboard.createCursorKeys();

        _this.dice_group.fixedToCamera = true
        _this.game.camera.follow(_this.player);
        _this.initPlayer();
        _this.game_group.add(_this.speak_con);
        _this.game_group.add(_this.dice_group);
    },


    update:function(){
        var _this = this
        _this.game.physics.arcade.collide(_this.player,_this.collisionPlayer,_this.playerCollision,null,this)
        _this.game.physics.arcade.collide(_this.dice_btn,_this.dice,_this.collideHandle);
        // if(!_this.diceCan){
        //     return
        // }
        _this.speak.y = _this.player.y;
        _this.speak.x = _this.player.x;

        _this.numText.x = Math.floor(_this.numCon.x + _this.numCon.width / 2);
        _this.numText.y = Math.floor(_this.numCon.y + _this.numCon.height / 2);
        _this.countDown.x = _this.player.x-_this.player.width*0.45;
        _this.countDown.y = _this.player.y-_this.player.height*1.4;
        //
        // _this.numText.x = _this.player.x;
        // _this.numText.y = _this.player.y;

        switch (_this.speak_dir){
            case "0":
                _this.text.y = _this.player.y-1.2*ratio;//0
                _this.text.x = _this.player.x-_this.speak.width*0.05+_this.text.width*0.1/2;//0
                break;
            case "1":
                _this.text.y = _this.player.y-1.2*ratio;//1
                _this.text.x = _this.player.x-_this.speak.width*0.05;//1
                break;
            case "2":
                _this.text.y = _this.player.y+0.8*ratio;//2
                _this.text.x = _this.player.x-_this.speak.width*0.05;//2
                break;
            default:
                break;
        }

        // _this.text1.x = Math.floor(_this.speak.x)
        // _this.text1.y = Math.floor(_this.speak.y+_this.speak.height/2)
        if (_this.cursors.left.isDown)
        {
            if(_this.flag){
                _this.direction  =false
                _this.num=-1;
                _this.goDes()
                // _this.goTo(jsonData[_this.index],jsonData[--_this.index],function(){_this.flag = true})
                _this.flag = false
            }

        }
        // else
        if (_this.cursors.right.isDown)
        {
            if(_this.flag){
                _this.direction  = true
                _this.num=1;
                _this.goDes()
                _this.flag = false
            }

        }


    },

    render:function(){
        var _this = this
        // _this.game.debug.body(_this.dice)
        _this.game.debug.geom(_this.circle,'#a00');
        _this.game.debug.body(_this.player);
        _this.game.debug.body(_this.text);
        // _this.game.debug.rectangle({x:_this.game.centerX,y:0+_this.game.camera.y,width:1,height:600});
        // _this.game.debug.rectangle({x:0+_this.game.camera.x,y:300+_this.game.camera.y,width:800,height:1});
        // _this.game.debug.body(_this.dice_btn)
        _this.game.debug.text("num:"+_this.num,_this.game.world.centerX,20,"#a00","20px Courier")
        _this.game.debug.text("diceCan:"+_this.diceCan,_this.game.world.centerX,40,"#a00","20px Courier")
        _this.game.debug.text("index:"+_this.index,_this.game.world.centerX,60,"#a00","20px Courier")
    }

}


$(function(){
    Game.init()
    console.log(jsonData.length)
    $(".page1").bind("tap",function(){
        $(this).removeClass("active").addClass("out")
        setTimeout(function(){
            $(".page1").fadeOut(200)
            $(".page2").addClass("active")
        },2000)
    })

    $(document).on("webkitAnimationEnd",".page2.active .user",function(){
        $(".page2").removeClass("active").addClass("out")
    })
})
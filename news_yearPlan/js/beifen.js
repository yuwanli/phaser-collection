var winWidth = window.innerWidth;
var winHeight = window.innerHeight;
var Game = {
    init:function(){
        var _this = this

        _this.game = new Phaser.Game(winWidth, winHeight, Phaser.AUTO, 'game', { preload: _this.preload, create: _this.create, update: _this.update ,render:_this.render},true);
    },
    preload:function(){
        var _this = this
        _this.left =0.68*ratio;
        _this.top = 0.6*ratio;
        _this.player_v = 100;//人物移动速度
        _this.index = 0;
        _this.diceCan = false;//骰子可否被投掷的标志位
        _this.diceNum = false;
        _this.flag = true;
        _this.direction = true;//true为正向    false 为反向
        _this.speak_dir = "";//对话框的方向   0:小人在右侧   1:小人在左侧  2:小人在顶部

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
                _this.speak_con.visible = false;
            }
        }
        _this.collideHandle = function () {
            if(_this.diceNum){
                _this.dice.animations.stop("diceRun");
                _this.dice_btn.animations.stop("btnRun");
                var random = parseInt(Math.random()*6);
                _this.dice.frame = random+4
                _this.diceNum = false
                _this.goDes(random+1,function(){
                    var p = jsonData[_this.index]
                    _this.initSpeak(p.speak,p);
                })
            }
        }
        _this.goDes = function(n,callback){
            _this.diceCan = false;
            if(n==0){
                callback()
                return
            }
            if(n>0){
                _this.direction = true
                n-=1;
                _this.goTo(jsonData[_this.index],jsonData[++_this.index],function(){
                    _this.goDes(n,callback)
                })
            }
            if(n<0){
                _this.direction = false
                n+=1;
                _this.goTo(jsonData[_this.index],jsonData[--_this.index],function(){
                    _this.goDes(n,callback)
                })
            }

        }
        _this.initSpeak = function(status,p){
            if(p.result){
                result[p.result].num++
                console.log(result)
            }
            if(status){
                _this.speak_dir = status;
                _this.text.text = p.text;
                $(".infoCon").fadeIn(200)
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

                $(document).one("tap",".page3 .infoCon",function(){
                    if(p.alertInfo.status=="stop"){
                        _this.stopThree()
                    }else{
                        var n = parseInt(p.alertInfo.status);
                        console.log(n)
                        if(n>0){
                            result["r6"].num++
                        }else{
                            result["r5"].num++
                        }
                        _this.goDes(n,function () {
                            _this.initSpeak(jsonData[_this.index].speak,jsonData[_this.index]);
                            _this.speak_con.visible = false;
                            _this.diceCan = true;
                        })
                    }
                    _this.speak_con.visible = true;
                    $(this).fadeOut(200);

                })
            }else{
                _this.diceCan = true;
            }
        }
        _this.stopThree = function(){
            setTimeout(function(){
                _this.diceCan = true;
            },3000)
        }
        _this.goTo = function (p1,p2,callback) {
            var _this = this
            var tx = parseInt(Math.abs((parseInt(p2.x)-parseInt(p1.x))/100*ratio/_this.player_v*1000));
            var ty = parseInt(Math.abs((parseInt(p2.y)-parseInt(p1.y))/100*ratio/_this.player_v*1000));

            if(_this.direction){
                _this.player.play(p1.dir)
            }else{
                _this.player.play(p1._dir)
            }
            if(tx>0){
                if(parseInt(p2.x)-parseInt(p1.x)>0){
                    _this.player.body.velocity.x+=_this.player_v
                }else{
                    _this.player.body.velocity.x-=_this.player_v
                }
                setTimeout(function(){
                    _this.player.body.velocity.x = 0;
                    callback()
                },tx)
            }
            if(ty>0){
                if(parseInt(p2.y)-parseInt(p1.y)>0){
                    _this.player.body.velocity.y+=_this.player_v
                }else{
                    _this.player.body.velocity.y-=_this.player_v
                }
                setTimeout(function(){
                    _this.player.body.velocity.y = 0;
                    callback()
                },ty)
            }

        }
        _this.initPlayer=function(){
            var _this = this
            var t1 = _this.game.add.tween(_this.player).to({ y: _this.top+0.77*ratio }, 1000, Phaser.Easing.Linear.None, true, 0, 0);
            var  o = {"x":0,"y":"77"}
            t1.onComplete.add(function(){_this.player.animations.play("player_right");_this.goTo(o,jsonData[0],function(){
                _this.diceCan = true;
                // _this.goDes(2,function () {
                //     var p  = jsonData[2]
                //     _this.initSpeak(p.speak,p);
                // });//正式环境删除
            })},this);
        }
        //group
        _this.game_group = _this.game.add.group();
        _this.dice_group = _this.game.add.group();
        _this.speak_con = _this.game.add.group();

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
        // _this.player.body.collideWorldBounds = true
        _this.player.animations.add("player_back",[0,1],5,true);
        _this.player.animations.add("player_left",[2,3],5,true);
        _this.player.animations.add("player_down",[4,5],5,true);
        _this.player.animations.add("player_right",[6,7],5,true);
        _this.player.animations.play("player_down");

        //speak
        _this.speak = _this.game.add.sprite(0,0,"speak_group",1)
        // _this.speak.anchor.set(0.9,-0.1);//2
        // _this.speak.anchor.set(0.9,1.2);//0
        // _this.speak.anchor.set(0.1,1.2);//1
        _this.speak.width = 3.38*ratio;
        _this.speak.height = 2.32*ratio;
        _this.speak_con.add(_this.speak);
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
        _this.speak_con.visible = false;

        _this.cursors = _this.game.input.keyboard.createCursorKeys();

        _this.dice_group.fixedToCamera = true
        _this.game.camera.follow(_this.player);
        _this.initPlayer();
        console.log(_this.speak_con)
        _this.game_group.add(_this.speak_con);
        _this.game_group.add(_this.dice_group);
    },


    update:function(){
        var _this = this
        _this.game.physics.arcade.collide(_this.dice_btn,_this.dice,_this.collideHandle);
        // if(!_this.diceCan){
        //     return
        // }
        _this.speak.y = _this.player.y;
        _this.speak.x = _this.player.x;

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
                _this.goTo(jsonData[_this.index],jsonData[--_this.index],function(){_this.flag = true})
                _this.flag = false
            }

        }
        // else
        if (_this.cursors.right.isDown)
        {
            if(_this.flag){
                _this.direction  = true
                _this.goTo(jsonData[_this.index],jsonData[++_this.index],function(){_this.flag = true})
                _this.flag = false
            }

        }


    },

    render:function(){
        var _this = this
        // _this.game.debug.body(_this.dice)
        _this.game.debug.geom(_this.circle,'#a00');
        // _this.game.debug.body(_this.player);
        _this.game.debug.body(_this.text);
        // _this.game.debug.rectangle({x:_this.game.centerX,y:0+_this.game.camera.y,width:1,height:600});
        // _this.game.debug.rectangle({x:0+_this.game.camera.x,y:300+_this.game.camera.y,width:800,height:1});
        // _this.game.debug.body(_this.dice_btn)
        _this.game.debug.text("前进:"+result["r6"].num+"次",_this.game.world.centerX,30,"#a00","40px Courier")
        _this.game.debug.text("后退:"+result["r5"].num+"次",_this.game.world.centerX,80,"#a00","40px Courier")
        _this.game.debug.text("总共:"+result["r4"].num+"次",_this.game.world.centerX,130,"#a00","40px Courier")
    }

}


$(function(){
    Game.init()
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
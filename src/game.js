
function Game(width,height)
{
  this.score;
  this.state;
  this.width = width;
  this.height = height;
  this.particles=[];
  this.aim=[];
  this.stars=[];
  this.bullets=[];
  this.targets=[];
  this.collected=[];
 
  //target hit by bullet
  this.hitBullet = function(target,isClear){

    //Score
    if(!isClear)
    {
      if(this.aim[0].id === target.element.id)
      {
        this.score = Math.max(0,this.score-=200);
      }else{
        this.score+=10;
      }
    }

    explode(target,this.particles);
  }

function explode(target,particles)
{
  //Explode!
    var colours = ["#434343","#555656",target.element.colour];
    for (var i = 10; i >= 0; i--) {
       particles.push(new Particle(random(5,20),target.x+random(-10,20),target.y+random(-10,20),colours[random(0,2)]));
    };

    play([3,,0.6173,0.1288,0.2868,0.06,,0.0004,0.3461,-0.1752,-0.7647,0.6851,,-0.8441,-0.699,0.3373,-0.0888,-0.066,0.1246,-0.0443,0.7543,0.3621,0.5783,0.56]);
}

  //target hit bottom or player
  this.hit = function(target,hitPlayer){
    if(hitPlayer && this.aim[0].id === target.element.id)
    {
      //Collect!
      this.collected.push(this.aim.splice(0,1));
      this.score+=300
      play([2,,0.0185,0.5998,0.3794,0.5324,,,,,,,,,,,,,1,,,,,0.76]);
    }else{
      //Game Over!
      explode(target,this.particles);
      this.state=Game.States.End;
      addScore(this.score);
      play([0,,0.3336,,0.1194,0.4606,,0.144,,,,,,0.5074,,,,,0.4956,,,0.0734,,0.5]);
    }

    if(this.aim.length==0)
      this.levelUpBegin();
  }
  
  this.getScores = function()  
  {
    return getScores();
  }

  getScores = function()
  {
    var listCookie = docCookies.getItem("a");
    
    if(listCookie!=null)
      return JSON.parse(listCookie);
    else
      return [];
  }

  function addScore(score)
  {
    var date = new Date(),
    datetime = date.today() + " " + date.timeNow(),
    list = getScores();
     
    list.push({"date":datetime,"score":score});  
    list = list.sort(function(a, b){return b.score-a.score});
    list.splice(5);
       
    docCookies.setItem("a",JSON.stringify(list));
  } 

  this.levelUpBegin = function(){
    this.state = Game.States.LevelUp;
    this.level++;

    if(this.collected)
    {
        var newAimTotal = this.collected.length-1;
        if(this.level%2==0)
            newAimTotal++;

        for (var i = newAimTotal; i >= 0; i--) {
          this.aim.push(getElement());    
        };
    }

    this.collected=[];
    play([2,0.14,0.312,0.0001,0.182,0.5,,-0.0016,0.0317,,-0.3134,0.7661,0.4703,0.392,-0.9496,-0.8203,-0.0139,-0.8661,0.7935,0.1313,0.0255,0.2263,0.0828,0.28]);
  }

  this.levelUpEnd = function(){
    this.levelReset();
    play([3,0.576,0.1084,0.1409,0.648,0.978,,0.0004,-0.0108,-0.4425,-0.9875,-0.0481,0.5919,0.2656,-0.1962,0.3111,0.7334,-0.1735,0.9901,-0.0484,0.3699,0.0024,,0.4639]);
  }

  this.drawScore = function(c) {
    if(game.state!=Game.States.LevelUp){
      writeScore(c,"Score " + this.score, this.width-100, 20);
      writeScore(c,"Mission " + this.level, 20, 20);
    }
  }

  function writeScore(c,text,x,y)
  {
    c.textAlign = 'left';
    c.fillStyle = "white";
    c.font = "14px Lucida Console";
    c.fillText(text, x, y);
  }
 
  this.levelReset = function()
  {
    this.collected=[];
    this.state=Game.States.Playing;
    this.player.y = 650;
    play([2,0.14,0.312,0.0001,0.182,0.5,,-0.0016,0.0317,,-0.3134,0.7661,0.4703,0.392,-0.9496,-0.8203,-0.0139,-0.8661,0.7935,0.1313,0.0255,0.2263,0.0828,0.28]);
  }

  this.pause = function()
  {
    if(this.state==Game.States.Playing)
    {
      this.state=Game.States.Pause;
      play([2,0.14,0.312,0.0001,0.182,0.5,,-0.0016,0.0317,,-0.3134,0.7661,0.4703,0.392,-0.9496,-0.8203,-0.0139,-0.8661,0.7935,0.1313,0.0255,0.2263,0.0828,0.28]);
    }
  }

  this.start = function() {
    this.level=0;
    this.score=0;
    this.player=new Player();
    this.player.targetY = this.height-this.player.height-10;
    this.collected=[];
    this.aim = [];   
    this.aim.push(getElement()); 
    this.levelUpBegin(); 
  }

  this.addBullet = function()
  {
    var bullet = new Bullet();
    bullet.x = this.player.x + this.player.width/2-5;
    bullet.y = this.player.y;
    this.bullets.push(bullet);
    play([2,0.0007,0.2614,0.505,0.2718,0.5629,,-0.3972,-0.1386,,,0.4762,,0.2066,0.0639,,-0.0038,0.0012,0.9999,-0.0062,0.6467,0.1699,0.4125,0.282]);
  }

  this.addTarget = function(frameCount)
  {
    if(this.targets.length > 0 && this.targets[0].y <= 50)
        return;  
 
      if(frameCount==60||frameCount==30)
      {
        var target = new Target();
        target.element=getElement();
        target.x = random(0,this.width-Target.width);
        target.y = -Target.height;
        this.targets.push(target);
    }
  }

  function getElement()
  {
    return Game.Elements[random(0, 3)];
  }

  this.stars=[];
  for (var i = 100; i >= 0; i--) {
      this.stars.push(new Star())  
  };
  this.state = Game.States.New;
}

Game.States = {New:0,Playing:1,LevelUp:2,End:3,Pause:4};
Game.Elements = [
  {id:0,colour:"rgba(57,66,255,1)"},//water
  {id:1,colour:"rgba(255,255,255,1)"},//wind
  {id:2,colour:"rgba(246,7,46,1)"}, //fire
  {id:3,colour:"rgba(57,255,20,1)"}//earth
]; 
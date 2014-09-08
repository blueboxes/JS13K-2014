/*
JS based on
http://phrogz.net/JS/classes/OOPinJS.html
http://stackoverflow.com/questions/1535631/static-variables-in-javascript
*/

function Player()
{
  this.y=this.x=this.targetY=-70;
  this.width=80,this.height=45;

  var shipLoaded=false;

  var ship = new Image();
  ship.onload = function() {
       shipLoaded=true;
  };
  ship.src = 'ship.png';

  this.update = function(mousePosX,flyAway) {

    if(mousePosX>0)
      this.x = mousePosX - this.width/2;  

    if(this.y>this.targetY || flyAway && this.y > -this.height)
      this.y-=10;

    if(this.y<-this.height && !flyAway)
      this.y = 650;
  }

  this.draw = function(c) {
    if(shipLoaded)
      c.drawImage(ship, this.x, this.y,this.width,this.height);
  };

};

function Star()
{
  this.s=random(5,20);
  this.o=random(1,10);
  this.v=(random(1,2)==1?5:3);
  this.x=random(0,800);
  this.y= random(0,500);
  
  this.update = function(maxY) {
    this.y=(this.y>maxY?0:this.y += this.v);
  }

  this.draw = function(c) {
    c.fillStyle = "rgba(255,255,255," + this.o/10 + ")";
    c.font = this.s + "px Arial";
    c.fillText(".", this.x, this.y);
  };
 

};

function Target()
{
  this.element;
  this.x=this.y=0;
  this.height=this.width=50;
  this.v=4;
   
  //todo: fix pass in bullets and function calls to hitBullet, hitBottom, hitPlayer
  this.update = function(game,clear) {
    this.y += this.v;

    for (var i = game.bullets.length - 1; i >= 0; i--) {
      if(collision(game.bullets[i],this))
      {
        game.bullets.splice(i,1);
        game.hitBullet(this,false);
        return false;
      }
    };

    if(clear)
    {
        game.bullets.splice(i,1);
        game.hitBullet(this,true);
        return false;
    }

    var hitPlayer = collision(game.player,this);

    if(this.y > game.height || hitPlayer)
    {
      game.hit(this,hitPlayer);
      return false;
    }
  
    return true;
  }

  this.draw = function(c) {
      drawTarget(c,this.x,this.y,this.element);
  }
}

Target.ElementSprite = new Image();
Target.width = 50;
Target.height = 50;

drawTarget = function (c,x,y,element) {    
  grd = c.createRadialGradient(25+x, 25+y, 10, 25+x, 25+y, 25);
  grd.addColorStop(0, 'black');
  grd.addColorStop(0.3, element.colour);
  grd.addColorStop(1, 'rgba(145, 141, 146, 0)'); 
  c.fillStyle = grd;
  c.fillRect(x, y, Target.width, Target.height);

  if(Target.ElementSprite.src==""){
    Target.ElementSprite.src = 'elements.png';
  }

  c.drawImage(Target.ElementSprite, element.id*20,0,20,20,x+15, y+15,20,20);   
};
  
function Bullet()
{
  this.width=15;
  this.height=10;
  this.x=this.y=0;

  this.update = function() {
      this.y -= 10;
      return this.y > -this.height;
  }

  this.draw = function(c) {
    grd = c.createLinearGradient(0+this.x, 5+this.y, 10+this.x, 5+this.y);

    grd.addColorStop(0.000, 'rgba(0, 0, 0, 0)');
    grd.addColorStop(0.400, 'rgba(191, 0, 0, 1)');
    grd.addColorStop(0.500, 'rgba(252, 75, 75, 1)');
    grd.addColorStop(0.600, 'rgba(191, 0, 0, 1)');
    grd.addColorStop(0.993, 'rgba(0, 0, 0, 0)');

    c.fillStyle = grd;
    c.fillRect(this.x,this.y, 10, 15);
  }
}

function Particle(size,x,y,colour)
{
  this.width=size;
  this.x=x;
  this.y=y;
  this.vx=this.vy=0;
  this.scaleSpeed=1;
  this.colour = colour;

  this.update = function() {
     
    // shrinking
    this.width -= this.scaleSpeed * 0.5;

    if (this.width <= 0)
      this.width = 0;
   
    // moving away from explosion center faster
    this.x += this.vx * 0.5;
    this.y += this.vy * 0.5;

    return (this.width>0);
  };

  this.draw = function(c) {
    drawCircle(c,this.width,colour,this.x,this.y);
  };

  function drawCircle(c, diameter, colour,x,y) {
    var radias = diameter/2;
    var centerX = x + radias
    var centerY = y + radias

    c.beginPath();
    c.arc(centerX, centerY,radias , 0, 2 * Math.PI, false);
    c.fillStyle = colour;
    c.fill();
  };

}
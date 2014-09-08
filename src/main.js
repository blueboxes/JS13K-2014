
function ElementWar(){

	var _stage = {}, _game, _startTime,_frameCount=0, _w=800,_h=600;

	this.start = function ()
	{
		_startTime = Date.now();
	 	_stage.canvas = document.getElementById("game");
		_stage.canvas.ctx = _stage.canvas.getContext("2d");
		_game = new Game(_w,_h);
		hookupEvents();
	  	gameLoop(); 	
	}

	function gameLoop() {
		requestAnimationFrame(gameLoop, _stage.canvas);

		if (Date.now() >= _startTime){  
		    update();
			draw();
			_frameCount = (_frameCount==60?0:_frameCount+=1);
		    _startTime = Date.now() + 16.66;//set to 60fps max
		}
	}
	 
	function  update()
	{
		var isLevelUp = _game.state==Game.States.LevelUp;

		if(_game.state==Game.States.Pause || _game.state==Game.States.End)
			return;

		for (var i = _game.stars.length - 1; i >= 0; i--) {
	   		_game.stars[i].update(_h)
	   	};

		if(_game.state!=Game.States.Playing && !isLevelUp)
			return;
		
		if(_game.state==Game.States.Playing)
			_game.addTarget(_frameCount);

		_game.player.update(_stage.mousePos.x,isLevelUp);
		_game.bullets = _game.bullets.filter(function(b) {
			return b.update();
		});

		_game.targets = _game.targets.filter(function(t) {
			return t.update(_game,isLevelUp);
		});

		_game.particles = _game.particles.filter(function(p) {
			return p.update();
		});


	}

	 function draw()
	 {
	 	var ctx = _stage.canvas.ctx;
	 	ctx.clearRect(0, 0, _w, _h);
	    drawBackground(ctx);

		if(_game.state!=Game.States.New)
			drawPlay(ctx);

	 	switch (_game.state) {
		  case Game.States.New:
		    drawNew(ctx);
		   	break;
		  case Game.States.LevelUp:
		    drawLevelUp(ctx);
		   	break;
		  case Game.States.Pause:
		  	drawPause(ctx);
		  	break;
		  case Game.States.End:
		    drawGameOver(ctx);
		}	
	 }

	function drawBackground(ctx)
	{
		 // Tint the background
	     grd = ctx.createLinearGradient(40, 0, 274, 300);
	     grd.addColorStop(0, 'rgba(142, 178, 170, 0.2)');
	     grd.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
	     ctx.fillStyle = grd;
	     ctx.fillRect(0, 0, _w, _h);
	 
		for (var i = _game.stars.length - 1; i >= 0; i--) {
	   		_game.stars[i].draw(ctx)
	   	};
	}

	function  drawNew(ctx)
	{
		drawTitle(ctx,"Element War",_h/2-25,90);
	  	ctx.font = "16px Lucida Console";
	  	ctx.fillText("Click anywhere to start", _w/2, _h/2+70);
	}

	function drawTitle(ctx,text,y,size)
	{
		ctx.textAlign = 'center';
		ctx.fillStyle = "white";
	    var grd = ctx.createLinearGradient(0, 300, 700, 200);
	    grd.addColorStop(0, 'rgba(143, 165, 179, 1)');
	    grd.addColorStop(1, 'rgba(255, 255, 255, 0)');
		ctx.strokeStyle = grd;
	  	ctx.font = size + "px Century Gothic";
	  	ctx.lineWidth = 3;
	  	ctx.strokeText(text,_w/2,y);
	  	ctx.fillText(text,_w/2,y);
	}

	function drawText(ctx,text,y)
	{
		ctx.fillStyle = "white";
	  	ctx.font = "14px Lucida Console";
	  	ctx.fillText(text,_w/2,y);
	};

	function drawDialog(ctx,w,h)
	{
		ctx.beginPath();
		ctx.fillStyle='rgba(30, 76, 100, 0.7)';
		ctx.strokeStyle = '#8fa5b3';
		ctx.lineWidth = 1;
		ctx.rect((_w-w)/2, (_h-h)/2, w, h);
		ctx.fill()
		ctx.stroke();
	}

	function drawLevelUp(ctx)
	{
		drawDialog(ctx,600,400);
		drawTitle(ctx,"Mission " + _game.level, 200,60);
	  	
	  	//Draw targets
		var start = _w/2-((_game.aim.length/2)*65);
	   	for (var i = 0; i < _game.aim.length; i++) {
	       drawTarget(ctx,start+(i*65),260,_game.aim[i]);
	     };

		drawText(ctx,"Remember and collect the elements in order",400)
	  	drawText(ctx,"Destroy all other elements before they pass you.", 425);
	}

	function drawPause(ctx)
	{
		drawDialog(ctx,400,150);
		drawTitle(ctx,"Mission Paused",290,45);
		drawText(ctx,"Press to continue playing!", 330);
	}

	function drawGameOver(ctx)
	{
		drawDialog(ctx,400,350);
		drawTitle(ctx,"Game Over!",190,45);
		drawText(ctx,"Top Scores", 250);

 		var scores = _game.getScores();
		for (var i = 0; i < 4; i++) {
			var s = scores[i];
			if(s)
				drawText(ctx,i+1 + ".		" + s.date + "			" + s.score, 300 + 40*i);
			else
				drawText(ctx,i+1 + ".		-------------------------  ", 300 + 40*i);
		};
	}

	function  drawPlay(ctx)
	{  
	   for (var i = _game.targets.length - 1; i >= 0; i--) {
	   		_game.targets[i].draw(ctx)
	   };

	   for (var i = _game.bullets.length - 1; i >= 0; i--) {
	   		_game.bullets[i].draw(ctx)
	   };

	   for (var i = _game.particles.length - 1; i >= 0; i--) {
	   		_game.particles[i].draw(ctx)
	   };

	   _game.drawScore(ctx);
	   _game.player.draw(ctx);
	}

	function hookupEvents()
	{
		 _stage.canvas.addEventListener('mousedown', function(e) {
		 	if(_game.state==Game.States.Playing)
				_game.addBullet();
			else if(_game.state==Game.States.LevelUp)
				_game.levelUpEnd();
			else if (_game.state==Game.States.Pause)
				_game.state=Game.States.Playing;
			else
				_game.start();
		 }, false);

	    _stage.canvas.addEventListener('mouseout', function(evt) {
	    	_game.pause();
	      }, false);

		_stage.mousePos={x:0,y:0};
	    _stage.canvas.addEventListener('mousemove', function(evt) {
	        var mousePos = getMousePos(_stage.canvas, evt);
	        _stage.mousePos = mousePos;
	      }, false);
	}
}

var game = new ElementWar();
game.start();

// 适配各个浏览器
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
	window.setTimeout(callback, 1000 / 60);
  };
})();

var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d');

var width = $(window).get(0).innerWidth,
  height = $(window).get(0).innerHeight;

canvas.width = width;
canvas.height = height;

//控制游戏变量
var platforms = [],
	image = document.getElementById("sprite"),
	player, platformCount = 10,
	position = 0,
	gravity = 0.2,
	animloop,
	flag = 0,
	menuloop, broken = 0,
	dir, score = 0, firstRun = true,
	clientX;

//基准线
var Base = function () {
	this.height = 5;
	this.width = width;
	this.moved = 0;
	this.x = 0;
	this.y = height - this.height;
};

var base = new Base();

//群星小球
var Player = function() {
	this.vy = 11;
	this.vx = 0;
	this.isMovingLeft = false;
	this.isMovingRight = false;
	this.isDead = false;
	this.width = 260;
	this.height = 212;
	this.dir = "left";
	this.x = width / 2 - this.width / 2;
	this.y = height;
	this.pic = new Image();
	this.pic.src = 'imgs/person.png';

	this.draw = function() {
		try {
			ctx.drawImage(this.pic, this.x, this.y, this.width, this.height);
		} catch (e) {}
	};

	//普通跳跃和弹簧跳跃
	this.jump = function() {
		this.vy = -16;
	};
	this.jumpHigh = function() {
		this.vy = -32;
	};

};

player = new Player();

//云朵跳台
function Platform() {
	this.width = 280;
	this.height = 60;
	this.x = Math.random() * (width - this.width);
	this.y = position;
	position += (height / platformCount);
	this.flag = 0;
	this.state = 0
	this.picLeft = new Image();
	this.picRight = new Image();
	this.picBroke = new Image();
	this.picOnce = new Image();
	this.picNone = new Image();
	this.picLeft.src = 'imgs/left.png';
	this.picRight.src = 'imgs/right.png';
	this.picBroke.src = 'imgs/broke.png';
	this.picOnce.src = 'imgs/once.png';

	this.draw = function() {
		try {
			var pic;
			if (this.type == 1) pic = this.picLeft;
			else if (this.type == 2) pic = this.picRight;
			else if (this.type == 3 && this.flag === 0) pic = this.picBroke;
			else if (this.type == 3 && this.flag == 1) pic = this.picNone;
			else if (this.type == 4 && this.state === 0) pic = this.picOnce;
			else if (this.type == 4 && this.state == 1) pic = this.picNone;
			ctx.drawImage(pic, this.x, this.y, this.width, this.height);
		} catch (e) {}
	};

	//Platform types
	//1: Normal 普通的云 向左
	//2: Moving 会移动的云向右
	//3: Breakable 裂开的云
	//4: Vanishable 
	if (score >= 5000) this.types = [2, 3, 3, 3, 4, 4, 4, 4];
	else if (score >= 2000 && score < 5000) this.types = [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
	else if (score >= 1000 && score < 2000) this.types = [2, 2, 2, 3, 3, 3, 3, 3];
	else if (score >= 500 && score < 1000) this.types = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];
	else if (score >= 100 && score < 500) this.types = [1, 1, 1, 1, 2, 2];
	else this.types = [1];

	this.type = this.types[Math.floor(Math.random() * this.types.length)];

	if (this.type == 3 && broken < 1) {
		broken++;
	} else if (this.type == 3 && broken >= 1) {
		this.type = 1;
		broken = 0;
	}

	this.moved = 0;
	this.vx = 1;
}

for (var i = 0; i < platformCount; i++) {
	platforms.push(new Platform());
}

//破碎的云
var Platform_broken_substitute = function() {
	this.height = 142;
	this.width = 280;
	this.x = 0;
	this.y = 0;
	this.appearance = false;
	this.pic = new Image();
	this.pic.src = 'imgs/broken.png'
	this.draw = function() {
		try {
			if (this.appearance === true) ctx.drawImage(this.pic, this.x, this.y, this.width, this.height);
			else return;
		} catch (e) {}
	};
};

var platform_broken_substitute = new Platform_broken_substitute();

//弹簧
var spring = function() {
	this.x = 0;
	this.y = 0;
	this.width = 78;
	this.height = 90;
	this.cx = 0;
	this.cy = 0;
	this.cwidth = 45;
	this.cheight = 53;
	this.state = 0;

	this.draw = function() {
	try {
		if (this.state === 0) this.cy = 445;
		else if (this.state == 1) this.cy = 501;
		ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
	} catch (e) {}
	};
};

var Spring = new spring();

function init() {
	var dir = "left",
	jumpCount = 0;
	firstRun = false;

	//清除画布
	function paintCanvas() {
		ctx.clearRect(0, 0, width, height);
	}

  //initWechat();
  function playerCalc() {
	if (dir == "left") {
	  player.dir = "left";
	  if (player.vy < -7 && player.vy > -15) player.dir = "left_land";
	} else if (dir == "right") {
	  player.dir = "right";
	  if (player.vy < -7 && player.vy > -15) player.dir = "right_land";
	}

	//Adding keyboard controls
	$('#canvas').on('touchstart', function(e){
		var x = e.originalEvent.changedTouches[0].clientX;
		clientX = x + '    ' + width * 0.5
		if(x < width * 0.5){
			dir = "left";
			player.isMovingLeft = true;
		} else{
			dir = "right";
			player.isMovingRight = true;
		}
	})

	$('#canvas').on('touchend', function(e){
		var x = e.originalEvent.changedTouches[0].clientX;
		clientX = x + '    ' + width * 0.5
		if(x < width * 0.5){
			dir = "left";
		player.isMovingLeft = false;
		} else{
			dir = "right";
		player.isMovingRight = false;
		}
	})
	document.onkeydown = function(e) {
	  var key = e.keyCode;
	  
	  if (key == 37) {
		dir = "left";
		player.isMovingLeft = true;
	  } else if (key == 39) {
		dir = "right";
		player.isMovingRight = true;
	  }
	};


	document.onkeyup = function(e) {
	  var key = e.keyCode;
	
	  if (key == 37) {
		dir = "left";
		player.isMovingLeft = false;
	  } else if (key == 39) {
		dir = "right";
		player.isMovingRight = false;
	  }
	};

	//Accelerations produces when the user hold the keys
	if (player.isMovingLeft === true) {
	  player.x += player.vx;
	  player.vx -= 0.15;
	} else {
	  player.x += player.vx;
	  if (player.vx < 0) player.vx += 0.1;
	}

	if (player.isMovingRight === true) {
	  player.x += player.vx;
	  player.vx += 0.15;
	} else {
	  player.x += player.vx;
	  if (player.vx > 0) player.vx -= 0.1;
	}

	// Speed limits!
	if(player.vx > 8)
	  player.vx = 8;
	else if(player.vx < -8)
	  player.vx = -8;

	//console.log(player.vx);
	
	//Jump the player when it hits the base
	if ((player.y + player.height) > base.y && base.y < height) player.jump();

	//Gameover if it hits the bottom 
	if (base.y > height && (player.y + player.height) > height && player.isDead != "lol") player.isDead = true;

	//Make the player move through walls
	if (player.x > width) player.x = 0 - player.width;
	else if (player.x < 0 - player.width) player.x = width;

	//Movement of player affected by gravity
	if (player.y >= (height / 2) - (player.height / 2)) {
	  player.y += player.vy;
	  player.vy += gravity;
	}

	//When the player reaches half height, move the platforms to create the illusion of scrolling and recreate the platforms that are out of viewport...
	else {
	  platforms.forEach(function(p, i) {

		if (player.vy < 0) {
		  p.y -= player.vy;
		}

		if (p.y > height) {
		  platforms[i] = new Platform();
		  platforms[i].y = p.y - height;
		}

	  });

	  base.y -= player.vy;
	  player.vy += gravity;

	  if (player.vy >= 0) {
		player.y += player.vy;
		player.vy += gravity;
	  }

	  score++;
	}

	//Make the player jump when it collides with platforms
	collides();

	if (player.isDead === true) gameOver();
  }


	function springCalc() {
		var s = Spring;
		var p = platforms[0];

		if (p.type == 1 || p.type == 2) {
			s.x = p.x + p.width / 2 - s.width / 2;
			s.y = p.y - p.height - 10;
			if (s.y > height / 1.1) s.state = 0;
			s.draw();
		} else {
			s.x = 0 - s.width;
			s.y = 0 - s.height;
		}
	}

	function platformCalc() {
		var subs = platform_broken_substitute;

		platforms.forEach(function(p, i) {
			if (p.type == 2) {
				if (p.x < 0 || p.x + p.width > width) p.vx *= -1;
				p.x += p.vx;
			}

			if (p.flag == 1 && subs.appearance === false && jumpCount === 0) {
				subs.x = p.x;
				subs.y = p.y;
				subs.appearance = true;
				jumpCount++;
			}

			p.draw();
		});

		if (subs.appearance === true) {
			subs.draw();
			subs.y += 8;
		}

		if (subs.y > height) subs.appearance = false;
	}

//检测碰撞
function collides() {
	//Platforms
	platforms.forEach(function(p, i) {
		if (player.vy > 0 && p.state === 0 && (player.x + 15 < p.x + p.width) && (player.x + player.width - 15 > p.x) && (player.y + player.height > p.y) && (player.y + player.height < p.y + p.height)) {

			if (p.type == 3 && p.flag === 0) {
				p.flag = 1;
				jumpCount = 0;
				return;
			} else if (p.type == 4 && p.state === 0) {
				player.jump();
				p.state = 1;
			} else if (p.flag == 1) return;
				else {
				player.jump();
			}
		}
	});

	//Springs
	var s = Spring;
	if (player.vy > 0 && (s.state === 0) && (player.x + 15 < s.x + s.width) && (player.x + player.width - 15 > s.x) && (player.y + player.height > s.y) && (player.y + player.height < s.y + s.height)) {
	  s.state = 1;
	  player.jumpHigh();
	}

}

  function updateScore() {
	var scoreText = document.getElementById("score");
	scoreText.innerHTML = score + ' m' + clientX;
  }

  function gameOver() {
	platforms.forEach(function(p, i) {
	  p.y -= 12;
	});

	if(player.y > height/2 && flag === 0) {
	  player.y -= 8;
	  player.vy = 0;
	} 
	else if(player.y < height / 2) flag = 1;
	else if(player.y + player.height > height) {
	  showGoMenu();
	  hideScore();
	  player.isDead = "lol";    
	}
  }

  //Function to update everything

  function update() {
	paintCanvas();
	platformCalc();

	springCalc();

	playerCalc();
	player.draw();

	updateScore();
  }

  menuLoop = function(){return;};
  animloop = function() {
	update();
	requestAnimFrame(animloop);
  };

  animloop();

  hideMenu();
  showScore();
}

function reset() {
  hideGoMenu();
  showScore();
  player.isDead = false;
  
  flag = 0;
  position = 0;
  score = 0;

  base = new Base();
  player = new Player();
  Spring = new spring();
  platform_broken_substitute = new Platform_broken_substitute();

  platforms = [];
  for (var i = 0; i < platformCount; i++) {
	platforms.push(new Platform());
  }
}

function share(){
	hideGoMenu();
	var menu = document.getElementById("shareMenu");
	  menu.style.zIndex = 1;
	  menu.style.visibility = "visible";
}

function hideShare(){
	showGoMenu();
	var menu = document.getElementById("shareMenu");
	menu.style.zIndex = -1;
	menu.style.visibility = "hidden";
}

//Hides the menu
function hideMenu() {
  var menu = document.getElementById("mainMenu");
  menu.style.zIndex = -1;
}

function showGoMenu() {
  var menu = document.getElementById("gameOverMenu");
  menu.style.zIndex = 1;
  menu.style.visibility = "visible";

  var scoreText = document.getElementById("go_score");
  scoreText.innerHTML = "恭喜你获得 " + score + " 株茱萸!";
  var ran = Math.random()
	if(ran < 0.33){
		$('.greet').src = 'imgs/greeta.svg';
	} else if(ran < 0.66) {
		$('.greet').src = 'imgs/greetb.svg';
	}  else {
		$('.greet').src = 'imgs/greetc.svg';
	}
  
}

function hideGoMenu() {
  var menu = document.getElementById("gameOverMenu");
  menu.style.zIndex = -1;
  menu.style.visibility = "hidden";
}

function showScore() {
  var menu = document.getElementById("scoreBoard");
  menu.style.zIndex = 1;
}

function hideScore() {
  var menu = document.getElementById("scoreBoard");
  menu.style.zIndex = -1;
}

function playerJump() {
  player.y += player.vy;
  player.vy += gravity;

  if (player.vy > 0 && 
	(player.x + 15 < 260) && 
	(player.x + player.width - 15 > 155) && 
	(player.y + player.height > 475) && 
	(player.y + player.height < 500))
	player.jump();

  if (dir == "left") {
	player.dir = "left";
	if (player.vy < -7 && player.vy > -15) player.dir = "left_land";
  } else if (dir == "right") {
	player.dir = "right";
	if (player.vy < -7 && player.vy > -15) player.dir = "right_land";
  }

  //Adding keyboard controls
  document.onkeydown = function(e) {
	var key = e.keyCode;

	if (key == 37) {
	  dir = "left";
	  player.isMovingLeft = true;
	} else if (key == 39) {
	  dir = "right";
	  player.isMovingRight = true;
	}
  
  };

  document.onkeyup = function(e) {
	var key = e.keyCode;

	if (key == 37) {
	  dir = "left";
	  player.isMovingLeft = false;
	} else if (key == 39) {
	  dir = "right";
	  player.isMovingRight = false;
	}
  };

  $('#canvas').on('touchstart', function(e){
		var x = e.originalEvent.changedTouches[0].clientX;
		if(x < width * 0.5){
			console.log(x + ' 1 '+ width * 0.5);
			dir = "left";
			player.isMovingLeft = true;
		} else{
			console.log(x + ' 2 '+ width * 0.5);
			dir = "right";
			player.isMovingRight = true;
		}
	})

	$('#canvas').on('touchend', function(e){
		var x = e.originalEvent.changedTouches[0].clientX;
		if(x < width * 0.5){
			console.log(x + ' 3 '+ width * 0.5);
			dir = "left";
		player.isMovingLeft = false;
		} else{
			console.log(x + ' 4 '+ width * 0.5);
			dir = "right";
		player.isMovingRight = false;
		}
	})

  //Accelerations produces when the user hold the keys
  if (player.isMovingLeft === true) {
	player.x += player.vx;
	player.vx -= 0.15;
  } else {
	player.x += player.vx;
	if (player.vx < 0) player.vx += 0.1;
  }

  if (player.isMovingRight === true) {
	player.x += player.vx;
	player.vx += 0.15;
  } else {
	player.x += player.vx;
	if (player.vx > 0) player.vx -= 0.1;
  }

  //Jump the player when it hits the base
  if ((player.y + player.height) > base.y && base.y < height) player.jump();

  //Make the player move through walls
  if (player.x > width) player.x = 0 - player.width;
  else if (player.x < 0 - player.width) player.x = width;

  player.draw();
}

function update() {
  ctx.clearRect(0, 0, width, height);
  playerJump();
}   

menuLoop = function() {
  update();
  requestAnimFrame(menuLoop);
};

menuLoop();

function Orientation() {
	this.init = function(){
		window.addEventListener('deviceorientation', this.orientationListener, false);
		window.addEventListener('MozOrientation', this.orientationListener, false);
		window.addEventListener('devicemotion', this.orientationListener, false);
	}

	this.orientationListener = function (evt) {
		// For FF3.6+
		if (!evt.gamma && !evt.beta) {
			// angle=radian*180.0/PI 在firefox中x和y是弧度值,
			evt.gamma = (evt.x * (180 / Math.PI)); //转换成角度值,
			evt.beta = (evt.y * (180 / Math.PI)); //转换成角度值
			evt.alpha = (evt.z * (180 / Math.PI)); //转换成角度值
		}
		/* beta:  -180..180 (rotation around x axis) */
		/* gamma:  -90..90  (rotation around y axis) */
		/* alpha:    0..360 (rotation around z axis) (-180..180) */

		var gamma = evt.gamma;
		var beta = evt.beta;
		var alpha = evt.alpha;

		if (evt.accelerationIncludingGravity) {
			// window.removeEventListener('deviceorientation', this.orientationListener, false);
			gamma = event.accelerationIncludingGravity.x * 10;
			beta = -event.accelerationIncludingGravity.y * 10;
			alpha = event.accelerationIncludingGravity.z * 10;
		}

		if (this._lastGamma != gamma) {
			if (gamma < 0) {
			dir = "left";
			player.isMovingLeft = false;
			} else if (gamma > 0) {
				dir = "right";
				player.isMovingRight = false;
			}
			this._lastGamma = gamma;
		}
	}
}

function initWechat () {
	var nonceStr = 'abcdefg';
	var timestamp = '1474961111318';
	var locationUrl = location.origin + location.pathname + location.search;
	var shareLogo = 'https://www.iqunxing.com/minisites/metersbonwe/imgs/wechart-logo.png';
	var optionBase = {
		title: '重阳登高，登上人生巅峰，不服来战',
		desc: '重阳登高，登上人生巅峰，不服来战',
		link: location.href,
		imgUrl: 'https://www.iqunxing.com/minisites/midautumn/imgs/share.jpg'
	};

	var optionTimeline = $.extend(optionBase, { success: function () {
		try {
			TDAPP.onEvent('微信分享－朋友圈');
		} catch (e) {}
	} });

	var optionAppMessage = $.extend(optionBase, { success: function () {
			try {
				TDAPP.onEvent('微信分享－朋友');
			} catch (e) {}
		} });

	var optionQQ = $.extend(optionBase, { success: function () {
			try {
				TDAPP.onEvent('微信分享－QQ');
			} catch (e) {}
		} });

	$.ajax({
		url: '/services/public/mobile/getWechatSignature',
		type: 'POST',
		data: {
			nonceStr: nonceStr,
			timestamp: timestamp,
			url: locationUrl
		},
		success: function (resp) {
			wx.config({
				debug: false,
				appId: 'wx5b8b94317c7511eb',
				timestamp: timestamp,
				nonceStr: nonceStr,
				signature: resp.result.signature,
				jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ']
			});
		}
	});

	wx.ready(function () {
		var link = locationUrl;
		wx.onMenuShareTimeline(optionTimeline);
		wx.onMenuShareAppMessage(optionAppMessage);
		wx.onMenuShareAppMessage(optionQQ);
	});
}
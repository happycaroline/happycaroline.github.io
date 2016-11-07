var can1;
var ctx1;

var can2;
var ctx2;

var canWidth;
var canHeight;

var lastTime;//上次执行时间
var deltaTime;//时间间隔

var bgPic = new Image();
var ane;
var fruit;
var mom;

//鼠标
var mx;
var my;

var baby;
var babyTail = [];
var babyEye = [];
var babyBody = [];

var momTail = [];
var momEye = [];
var momBodyOra = [];
var momBodyBlue = [];
var data;
var wave;
var feedWave;
document.body.onload = game;

var dust;
var dustPic = [];

function game() {
	init();
	lastTime = Date.now();
	deltaTime = 0;
	gameloop();
}

function init(){
	can1 = document.getElementById('canvas1');//fishes, dust, circle, UI
	ctx1 = can1.getContext('2d');
	ctx1.fillStyle = 'white';
	ctx1.font = '30px Verdana';
	ctx1.textAlign = 'center';

	can2 = document.getElementById('canvas2');//bg, fruits,ane
	ctx2 = can2.getContext('2d');

	can1.addEventListener('mousemove', onMouseMove, false);

	bgPic.src = 'src/background.jpg';

	canWidth = can1.width;
	canHeight = can1.height;

	ane = new Ane();
	ane.init();

	fruit = new Fruit();
	fruit.init();

	mom = new Mom();
	mom.init();

	mx = canWidth * 0.5;
	my = canHeight * 0.5;

	baby = new Baby();
	baby.init();

	for (var i = 0; i < 8; i++) {
		babyTail[i] = new Image();
		babyTail[i].src = 'src/babyTail' + i + '.png';
	}

	for (var i = 0; i < 2; i++) {
		babyEye[i] = new Image();
		babyEye[i].src = 'src/babyEye' + i + '.png';
	}


	for (var i = 0; i < 20; i++) {
		babyBody[i] = new Image();
		babyBody[i].src = 'src/babyFade' + i + '.png';
	}

	for (var i = 0; i < 8; i++) {
		momTail[i] = new Image();
		momTail[i].src = 'src/bigTail' + i + '.png';
	}

	for (var i = 0; i < 2; i++) {
		momEye[i] = new Image();
		momEye[i].src = 'src/bigEye' + i + '.png';
	}

	for (var i = 0; i < 8; i++) {
		momBodyOra[i] = new Image();
		momBodyOra[i].src = 'src/bigSwim' + i + '.png';
		momBodyBlue[i] = new Image();
		momBodyBlue[i].src = 'src/bigSwimBlue' + i + '.png';
	}



	data = new Data();
	wave = new Wave();
	wave.init();

	feedWave = new FeedWave();
	feedWave.init();

	for (var i = 0; i < 7; i++) {
		dustPic[i] = new Image();
		dustPic[i].src = 'src/dust' + i + '.png';
	}
	dust = new Dust();
	dust.init();
}

function gameloop() {
	window.requestAnimFrame(gameloop);//setInterval() setTimeout  requestAnimFrame会根据你浏览器的性能来确定， frame per second
	var now = Date.now();
	deltaTime = now - lastTime;
	lastTime = now;
	if(deltaTime > 40) deltaTime = 40;
	drawBg();
	ane.draw();
	fruitMonitor();

	fruit.draw();


	ctx1.clearRect(0, 0, canWidth, canHeight)
	mom.draw();
	momFruitsCollsion();

	baby.draw();
	momBabyCollsion();

	data.draw();
	wave.draw();
	feedWave.draw();
	dust.draw();
}


function drawBg(){
	ctx2.drawImage(bgPic, 0, 0, canWidth, canHeight)
}

function Ane() {
	//画贝塞尔曲线 start point,control point, end point(sin) 通过正弦函数
	this.rootX = [];
	this.headX = [];
	this.headY = [];
	this.alpha = 0;
	this.amp = [];
}

Ane.prototype.num = 50;

Ane.prototype.init  = function () {
	for(var i = 0; i < this.num; i++){
		this.rootX[i] = i * 16 + Math.random()*20;//[0, 1)
		this.headX[i] = this.rootX[i];
		this.headY[i] = canHeight - 250 + Math.random() * 50;
		this.amp[i] = Math.random() * 50;
	}

	
}

Ane.prototype.draw = function (){
	this.alpha += deltaTime * 0.0008;// [-1, 1]
	var l = Math.sin(this.alpha);
	ctx2.save();
	ctx2.strokeStyle = '#3b154e';
	ctx2.lineCap = 'round';
	ctx2.lineWidth = 20;
	ctx2.globalAlpha = 0.6;
	for(var i = 0; i < this.num; i++){
		//beginPath, moveTo, lineTo, stroke, strokeStyle,lineWidth, lineCap,globalAlpha
		ctx2.beginPath();
		ctx2.moveTo(this.rootX[i], canHeight);
		this.headX[i] = this.rootX[i] + l * this.amp[i];
		ctx2.quadraticCurveTo(this.rootX[i], canHeight - 100, this.headX[i], this.headY[i]);

		ctx2.stroke();
	}
	ctx2.restore()
}

function Fruit(){
	this.alive = [];//bool
	this.x = [];
	this.y = [];
	this.l = [];
	this.spd = [];
	this.fruitType = [];
	this.orange = new Image();
	this.blue = new Image();
	this.aneNo = [];
}

Fruit.prototype.num = 30;

Fruit.prototype.init = function(){
	for(var i = 0; i < this.num; i++){
		this.alive[i] = false;
		this.x[i] = 0;
		this.y[i] = 0;
		this.fruitType[i] = '';
		this.spd[i] = Math.random() * 0.017 + 0.003; 
		this.aneNo[i] = 0;
	}
	this.orange.src  = 'src/fruit.png';
	this.blue.src = 'src/blue.png';
}

Fruit.prototype.draw = function(){
	for(var i = 0; i < this.num; i++){
		//fina an ane, grow, fly up
		
		if(this.alive[i]) {
			var pic;
			if (this.fruitType[i] == 'orange') {
				pic = this.orange;
			} else {
				pic = this.blue;
			}
			if(this.l[i] <= 14){
				var NO = this.aneNo[i];
				this.x[i] = ane.headX[NO];
				this.y[i] = ane.headY[NO];
				this.l[i] += this.spd[i] * deltaTime;
			} else {
				this.y[i] -= this.spd[i] * 7 * deltaTime;
			}
			
			ctx2.drawImage(pic, this.x[i]-this.l[i] * 0.5, this.y[i] - this.l[i]* 0.5, this.l[i], this.l[i])

			if(this.y[i] < 0){
				this.alive[i] = false;
			}
		}
	}
}

Fruit.prototype.born = function (i) {
	this.aneNo[i] = Math.floor(Math.random() * ane.num);
	this.l[i] = 0;
	this.alive[i] = true;
	var ran = Math.random();
	if(ran < 0.3){
		this.fruitType[i] = 'blue';
	} else {
		this.fruitType[i] = 'orange';
	}
}

Fruit.prototype.dead = function (i) {
	this.alive[i] = false;
}

function fruitMonitor() {
	var screenNum = 0;
	for(var i = 0;i<fruit.num; i++) {
		if(fruit.alive[i]) screenNum++;
	}
	if(screenNum < 15){
		//send fruit
		sendFruit();
		return;
	}
}

function sendFruit(){
	for(var i = 0; i < fruit.num; i++){
		if(!fruit.alive[i]){
			fruit.born(i);
			return;
		}
	}
}

//配适各个浏览器
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			return window.setTimeout(callback, 1000 / 60);
		};
})();

//鱼妈妈
function Mom() {
	this.x;
	this.y;
	this.angle

	this.momTailTimer = 0;
	this.momTailCount = 0;

	this.momEyeTimer = 0;
	this.momEyeCount = 0;
	this.momEyeInterval = 1000;

	this.momBodyCount = 0;

}

Mom.prototype.init = function () {
	this.x = canWidth * 0.5;
	this.y = canHeight * 0.5;
	this.angle = 0;
}

Mom.prototype.draw = function () {
	//lerp x, y
	this.x = lerpDistance(mx, this.x, 0.98);
	this.y = lerpDistance(my, this.y, 0.99);

	//delta angle  Math.atan2(y, x)
	var deltaY = my - this.y;
	var deltaX = mx - this.x;
	var beta = Math.atan2(deltaY, deltaX) + Math.PI;//-PI,PI

	//lerp angle
	this.angle = lerpAngle(beta, this.angle, 0.6) 

	//tail
	this.momTailTimer += deltaTime;
	if(this.momTailTimer > 50){
		this.momTailCount = (this.momTailCount+1) % 8;
		this.momTailTimer %= 50;
	}

	//eye
	this.momEyeTimer += deltaTime;
	if(this.momEyeTimer > this.momEyeInterval){
		this.momEyeCount = (this.momEyeCount + 1) % 2;
		this.momEyeTimer %= this.momEyeInterval;
		if(this.momTailCount == 0){
			this.momEyeInterval = Math.random() * 1500 + 2000;
		} else {
			this.momEyeInterval = 200;
		}
	}

	ctx1.save();
	ctx1.translate(this.x, this.y);
	ctx1.rotate(this.angle);
	var momTailCount = this.momTailCount;
	ctx1.drawImage(momTail[momTailCount], -momTail[momTailCount].width * 0.5 + 30, -momTail[momTailCount].height * 0.5);
	var momBodyCount = this.momBodyCount;
	if(data.double == 1){
		ctx1.drawImage(momBodyOra[momBodyCount], -momBodyOra[momBodyCount].width * 0.5, -momBodyOra[momBodyCount].height * 0.5);
	} else {
		ctx1.drawImage(momBodyBlue[momBodyCount], -momBodyBlue[momBodyCount].width * 0.5, -momBodyBlue[momBodyCount].height * 0.5);
	}	
	
	var momEyeCount = this.momEyeCount;
	ctx1.drawImage(momEye[momEyeCount], -momEye[momEyeCount].width * 0.5, -momEye[momEyeCount].height * 0.5);
	ctx1.restore();
};

function onMouseMove (e) {
	if(!data.gameOver){
		if(e.offsetX || e.layerX){
			mx = e.offsetX == undefined ? e.layerX : e.offsetX;
			my = e.offsetY == undefined ? e.layerY : e.offsetY;
		}
	}
}

//趋近于目标值，追随目标值
function lerpDistance(aim, cur, ratio) {
	var delta = cur - aim;
	return aim + delta * ratio;
}

//趋近角度
function lerpAngle(a, b, t) {
	var d = b - a;
	if (d > Math.PI) d = d - 2 * Math.PI;
	if (d < -Math.PI) d = d + 2 * Math.PI;
	return a + d * t;
}

//大鱼吃果实碰撞检测 （大鱼和小鱼的距离
function momFruitsCollsion (){
	if(!data.gameOver){
		for (var i = 0; i < fruit.num; i++) {
			if(fruit.alive[i]){
				//calculate length
				var l = calLength2(fruit.x[i], fruit.y[i], mom.x, mom.y)
				if(l < 900){
					//fruit eaten
					fruit.dead(i);
					data.fruitNum++;
					mom.momBodyCount++;
					if(mom.momBodyCount > 7){
						mom.momBodyCount = 7;
					}
					if(fruit.fruitType[i] == 'blue'){//blue
						data.double = 2;
						wave.born(fruit.x[i],fruit.y[i]);
					}
				}
			}
		}	
	}
	
}

function calLength2(x1, y1, x2, y2) {//判断两个点的距离
	return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}


function Baby(){
	this.x;
	this.y;
	this.angle;
	this.babyBody = new Image();

	this.babyTailTimer = 0;
	this.babyTailCount = 0;

	this.babyEyeTimer = 0;
	this.babyEyeCount = 0;
	this.babyEyeInterval = 1000;

	this.babyBodyTimer = 0;
	this.babyBodyCount = 0;
}

Baby.prototype.init = function () {
	this.x = canWidth * 0.5 -50;
	this.y = canHeight * 0.5 + 50;
	this.angle = 0;
	this.babyBody.src = 'src/babyFade0.png';
}

Baby.prototype.draw = function () {
	//lerp x, y
	this.x = lerpDistance(mom.x, this.x, 0.98);
	this.y = lerpDistance(mom.y, this.y, 0.98);

	//delta angle  Math.atan2(y, x)
	var deltaY = mom.y - this.y;
	var deltaX = mom.x - this.x;
	var beta = Math.atan2(deltaY, deltaX) + Math.PI;//-PI,PI

	//lerp angle
	this.angle = lerpAngle(beta, this.angle, 0.6)

	//baby tail count
	this.babyTailTimer += deltaTime;
	if(this.babyTailTimer > 50){
		this.babyTailCount = (this.babyTailCount + 1) % 8;
		this.babyTailTimer %= 50;
	}

	//baby body
	this.babyBodyTimer += deltaTime;
	if(this.babyBodyTimer > 300){
		this.babyBodyCount = this.babyBodyCount + 1;
		this.babyBodyTimer %= 300;
		if(this.babyBodyCount > 19){
			this.babyBodyCount = 19;
			//game over
			data.gameOver = true;
		}
	}

	//baby eye
	this.babyEyeTimer += deltaTime;
	if(this.babyEyeTimer > this.babyEyeInterval){
		this.babyEyeCount = (this.babyEyeCount + 1) % 2;
		this.babyEyeTimer %= this.babyEyeInterval;

		if(this.babyEyeCount == 0){
			this.babyEyeInterval = Math.random()* 1500 + 2000;//[2000, 3500)
		} else {
			this.babyEyeInterval = 200;
		}
	}

	var babyTailCount = this.babyTailCount;
	ctx1.save();
	ctx1.translate(this.x, this.y);
	ctx1.rotate(this.angle);
	ctx1.drawImage(babyTail[babyTailCount], -babyTail[babyTailCount].width * 0.5 + 25, -babyTail[babyTailCount].height * 0.5);
	var babyBodyCount = this.babyBodyCount;
	ctx1.drawImage(babyBody[babyBodyCount], -babyBody[babyBodyCount].width * 0.5, -babyBody[babyBodyCount].height * 0.5);
	var babyEyeCount = this.babyEyeCount;
	ctx1.drawImage(babyEye[babyEyeCount], -babyEye[babyEyeCount].width * 0.5, -babyEye[babyEyeCount].height * 0.5);
	ctx1.restore();
}

//大鱼小鱼碰撞检测 （大鱼和小鱼的距离
function momBabyCollsion (){
	if(data.fruitNum > 0 && !data.gameOver){
		var l = calLength2(mom.x, mom.y, baby.x, baby.y)
		if(l < 900){
			//baby recover
			baby.babyBodyCount = 0;
			//data => 0
			//data.reset();
			mom.momBodyCount = 0;

			//score update
			data.addScore();
			feedWave.born(baby.x, baby.y)
		}
	}
}


//分值计算
function Data (){
	this.fruitNum = 0;
	this.double = 1;
	this.score = 0;
	this.gameOver = false;
	this.alpha = 0;
}

Data.prototype.draw = function(){
	var w = can1.width;
	var h = can1.height;

	ctx1.save();
	ctx1.shadowBlur = 10;
	ctx1.shadowColor = 'white';
	ctx1.fillText('SCORE:' + this.score, w * 0.5, h - 30);
	if(this.gameOver){
		this.alpha += deltaTime * 0.0005;
		if(this.alpha > 1){
			this.alpha = 1;
		}
		ctx1.fillStyle = 'rgba(255, 255, 255,' + this.alpha + ')';
		ctx1.fillText('GAME OVER', w * 0.5,	h * 0.5);
	}
	ctx1.restore();
}

Data.prototype.addScore = function(){
	this.score += this.fruitNum * 100 * this.double;
	this.fruitNum = 0;
	this.double = 1;
}

function Wave(){
	this.x = [];
	this.y = [];
	this.alive = [];
	this.r = [];

}

Wave.prototype.num = 10;
Wave.prototype.init = function(){
	for (var i = 0; i < this.num; i++) {
		this.alive[i] = false;
		this.r[i] = 0;
	}
}

Wave.prototype.draw = function () {
	ctx1.save();
	ctx1.lineWidth = 2;
	ctx1.shadowBlur = 10;
	ctx1.shadowColor = 'white';
	for (var i = 0; i < this.num; i++) {
		if(this.alive[i]){
			this.r[i] += deltaTime * 0.04;

			if(this.r[i] > 50){
				this.alive[i] = false;
				break;
			}
			var alpha = 1-this.r[i] / 50;
			ctx1.beginPath();
			ctx1.arc(this.x[i], this.y[i], this.r[i], 0, Math.PI * 2);
			ctx1.closePath();
			ctx1.strokeStyle = 'rgba(255, 255, 255,' + alpha +')';
			ctx1.stroke();
		}
	}
	ctx1.restore();
}

Wave.prototype.born = function (x, y) {
	for (var i = 0; i < this.num; i++) {
		if(!this.alive[i]){
			//born
			this.alive[i] = true;
			this.r[i] = 20;

			this.x[i] = x;
			this.y[i] = y;
			return;
		}
	}
}

function FeedWave(){
	this.x = [];
	this.y = [];
	this.alive = [];
	this.r = [];
}

FeedWave.prototype.num = 5;
FeedWave.prototype.init = function(){
	for (var i = 0; i < this.num; i++) {
		this.x[i] = 0;
		this.y[i] = 0;
		this.alive[i] = false;
		this.r[i] = 0;
	}
}

FeedWave.prototype.draw = function(){
	ctx1.save();
	ctx1.lineWidth = 2;
	ctx1.shadowBlur = 10;
	ctx1.shadowColor = 'rgba(203, 91, 0, 1)';
	for (var i = 0; i < this.num; i++) {
		if(this.alive[i]){
			this.r[i] += deltaTime * 0.05;
			if(this.r[i] > 100){
				this.alive[i] = false;
				break;
			}
			var alpha = 1 - this.r[i] / 100;
			ctx1.beginPath();
			ctx1.arc(this.x[i], this.y[i], this.r[i], 0, Math.PI * 2);
			ctx1.closePath();
			ctx1.strokeStyle = 'rgba(203, 91, 0,'+ alpha +')';
			ctx1.stroke();
		}
	}
	ctx1.restore();
}

FeedWave.prototype.born = function (x, y) {
	for (var i = 0; i < this.num; i++) {
		if(!this.alive[i]){
			this.x[i] = x;
			this.y[i] = y;
			this.r[i] = 10;
			this.alive[i] = true;
		}
	}
}


function Dust (){
	this.x = [];
	this.y = [];
	this.amp = [];
	this.NO = [];

	this.alpha;
}

Dust.prototype.num = 30;

Dust.prototype.init = function (){
	for (var i = 0; i < this.num; i++) {
		this.x[i] = Math.random() * canWidth;
		this.y[i] = Math.random() * canHeight;
		this.amp[i] = Math.random() * 15 + 20;
		this.NO[i] = Math.floor(Math.random() * 7);
	}
	this.alpha = 0;
}

Dust.prototype.draw = function () {
	this.alpha += deltaTime * 0.0008;
	var l = Math.sin(this.alpha);
	for (var i = 0; i < this.num; i++) {
		var no = this.NO[i];
		ctx1.drawImage(dustPic[no], this.x[i] + this.amp[i] * l, this.y[i]);
	}
}
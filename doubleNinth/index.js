/**
 * minisite common JS
 *
 * @author tingzhou
 * @version 1.0.0
 * @since at 09.26.2016
 * @lastUpdatedBy tingzhou at 9.27.2016
 **/


var can;
var ctx;

var canWidth;
var canHeight;

var lastTime;//上次执行时间
var deltaTime;//时间间隔

var bgPic = new Image();

var player;
var cloud;

document.body.onload = game;

function game() {
    init();
    lastTime = Date.now();
    deltaTime = 0;
    //initWechat();
    gameloop();
}

function init() {
    var $canvas;

    can = document.getElementById('game');
    ctx = can.getContext('2d');
    $canvas = $(can);

    //resize
    $canvas.attr('width', $(window).get(0).innerWidth);
    $canvas.attr('height', $(window).get(0).innerHeight);
    bgPic.src = 'imgs/bg.jpg';

    canWidth = can.width;
    canHeight = can.height;

    player = new Player();
    player.init();

    $canvas.on('mousedown', function (e) {
        var x = e.clientX;
        player.move(x);
    });

    (new Orientation()).init();

    cloud = new Cloud();
    cloud.init();
}

function gameloop() {
    window.requestAnimFrame(gameloop);//setInterval() setTimeout  requestAnimFrame会根据你浏览器的性能来确定， frame per second
    var now = Date.now();
    deltaTime = now - lastTime;
    lastTime = now;
    drawBg();
    player.draw();
    cloud.draw();
    cloudMonitor();
}

function drawBg() {
    ctx.drawImage(bgPic, 0, 0, canWidth, canHeight);
}

function Player() {
    this.width = 80;
    this.height = 80;
    this.x = canWidth * 0.5 - this.width * 0.5;
    this.y = canHeight - this.height * 2;
    this.pic = new Image();
    this.orientation = 1;
}

Player.prototype.init = function () {
    this.pic.src = 'imgs/person.png';
};

Player.prototype.draw = function () {
    this.y += 0.3 * deltaTime * this.orientation;
    if (this.orientation < 0) {
        if (this.y < 200) {
            this.orientation = 1;
        }
    } else {
        if (this.y > canHeight - this.height * 2) {
            this.orientation = -1;
        }
    }

    ctx.drawImage(this.pic, this.x, this.y, this.width, this.height);
};

Player.prototype.move = function (x) {
    if (x >= canWidth * 0.5) {
        this.x += 1.2 * deltaTime;
    } else {
        this.x -= 1.2 * deltaTime;
    }
};

function Cloud() {
    this.width = 90;
    this.height = 30;
    this.x = [];
    this.y = [];
    this.alive = [];
    this.cloudType = [];
    this.leftPic = new Image();
    this.rightPic = new Image();
}

Cloud.prototype.num = 20;

Cloud.prototype.init = function () {
    for (var i = 0; i < 10; i++) {
        this.alive[i] = true;
        this.x[i] = 0;
        this.cloudType[i] = 0;
        this.y[i] = canHeight * Math.random();
    }

    this.leftPic.src = 'imgs/left.png';
    this.rightPic.src = 'imgs/right.png';
};

Cloud.prototype.come = function (i) {
    this.x[i] = Math.floor(Math.random() * (canWidth - this.width));
    this.y[i] = 10;
    this.alive[i] = true;
    var ran = Math.random();
	if(ran < 0.5){
		this.cloudType[i] = 'left';
	} else {
		this.cloudType[i] = 'right';
	}
};

Cloud.prototype.draw = function () {
    for (var i = 0; i < this.num; i++) {
        if (this.alive[i]) {
        	var pic;
			if (this.cloudType[i] == 'left') {
				pic = this.leftPic;
			} else {
				pic = this.rightPic;
			}
            this.y[i] += 0.1 * deltaTime;
            ctx.drawImage(pic, this.x[i], this.y[i], this.width, this.height);

            if (this.y[i] > canHeight - this.height * 2) {
                this.alive[i] = false;
            }
        }

    }
};

function cloudMonitor() {
    var screenNum = 0;
    for (var i = 0; i < cloud.num; i++) {
        if (cloud.alive[i]) screenNum++;
    }

    if (screenNum < 10) {
        cloudGo();
        return;
    }
}

function cloudGo() {
    for (var i = 0; i < cloud.num; i++) {
        if (!cloud.alive[i]) {
            cloud.come(i);
            return;
        }
    }
}

function Orientation(selector) {

}

Orientation.prototype.init = function () {
    window.addEventListener('deviceorientation', this.orientationListener, false);
    window.addEventListener('MozOrientation', this.orientationListener, false);
    window.addEventListener('devicemotion', this.orientationListener, false);
};

Orientation.prototype.orientationListener = function (evt) {
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
        player.x = gamma / 90 * 200 + 200;
        this._lastGamma = gamma;
    }
};

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

//配适各个浏览器
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            return window.setTimeout(callback, 1000 / 60);
        };
})();

var screenWidth = document.body.clientWidth;
var screenHeight;
if (document.compatMode == "BackCompat")
	screenHeight = document.body.clientHeight;
else
	screenHeight = document.documentElement.clientHeight;

var tag = new Array();
var tagPosX = new Array();
var tagPosY = new Array();
var tagTime = new Array();
var tagNowRotation = new Array();
var tagRotation = new Array();
var tagArrangeTimer = new Array();
var isRandomMove = new Array();

tag[0] = document.getElementById('htmlPic');
tag[1] = document.getElementById('cppPic');
tag[2] = document.getElementById('javaPic');
tag[3] = document.getElementById('windowsPic');
tag[4] = document.getElementById('coderPic');
tag[5] = document.getElementById('indoorPic');
tag[6] = document.getElementById('doubiPic');
tag[7] = document.getElementById('repoPic');
tag[8] = document.getElementById('blogPic');
tag[9] = document.getElementById('graphPic');

//Initial setting
for (var i = tag.length - 1; i >= 0; i--) {
	tag[i].style.left = Math.random() * (screenWidth - 200) + 'px';
	tag[i].style.top = Math.random() * (screenHeight - 200) + 'px';
	tagNowRotation[i] = Math.random() * 360;
	tag[i].style.transform = "rotate(" + tagNowRotation[i] + "deg)";
	tag[i].style.opacity = '0.5';
	tagTime[i] = Math.random() * 50;
	tagArrangeTimer[i] = 0;
	isRandomMove[i] = true;
	getRandom(i);
};

//Random move
function move () {
	for (var i = tag.length - 1; i >= 0; i--) {
		if(isRandomMove[i]) {
			if (tagTime[i] >= 50) {
				tagTime[i] = 0;
				getRandom(i);
			} else {
				moveX(tag[i], tagPosX[i]);
				moveY(tag[i], tagPosY[i]);
				rotate(tag[i], i, tagRotation[i]);
				tagTime[i] = tagTime[i] + 1;
			};
		};
	};
}
setInterval(move, 40);

function moveX (obj, end_posX) {
	obj.style.left = parseInt(obj.style.left) + (end_posX - parseInt(obj.style.left)) / 24 + 'px';
}

function moveY (obj, end_posY) {
	obj.style.top = parseInt(obj.style.top) + (end_posY - parseInt(obj.style.top)) / 24 + 'px';
}

function rotate (obj, i, end_deg) {
	var now_deg = tagNowRotation[i];
	obj.style.transform = "rotate(" + (now_deg + (end_deg - now_deg) / 24) + "deg)";
	tagNowRotation[i] = now_deg + (end_deg - now_deg) / 24;
}

function getRandom (i) {
	tagPosX[i] = Math.random() * (screenWidth - 200);
	tagPosY[i] = Math.random() * (screenHeight - 200);
	tagRotation[i] = Math.random() * 360;
}

var backPic = document.getElementById('imanity');
backPic.style.left = (screenWidth / 2 - 260) + 'px';

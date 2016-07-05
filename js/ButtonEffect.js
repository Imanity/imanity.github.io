var button = new Array();
var hint = new Array();
var buttonRate = new Array();
var timer = new Array();
var tagTimer = new Array();

button[0] = document.getElementById('homeBtn');
button[1] = document.getElementById('aboutBtn');
button[2] = document.getElementById('githubBtn');
button[3] = document.getElementById('mailBtn');
hint[0] = document.getElementById('homeHint');
hint[1] = document.getElementById('aboutHint');
hint[2] = document.getElementById('githubHint');
hint[3] = document.getElementById('mailHint');

var aboutDlg = document.getElementById('about');
aboutDlg.style.left = (screenWidth / 2 - 250) + 'px';

var picSize = 100;
var xPos = new Array();
var yPos;

var jumpHeight = 25;
var jumpDirection = 1;

for (var i = 3; i >= 0; i--) {
	xPos[i] = screenWidth / 2 + picSize * (i - 2);
	buttonRate[i] = 1;
};
yPos = screenHeight * 0.65 - picSize / 2;

//Initial set
for (var i = button.length - 1; i >= 0; i--) {
	button[i].style.left = xPos[i] + 'px';
	button[i].style.top = yPos + 'px';
	hint[i].style.left = xPos[i] + 'px';
	hint[i].style.opacity = '0.3';
};

//mouse event
function mouseEvent (i, rate) {
	var first_tag, end_tag;
	switch(i) {
		case 0:
		first_tag = 0;
		end_tag = 3;
		break;
		case 1:
		first_tag = 4;
		end_tag = 6;
		break;
		case 2:
		first_tag = 7;
		end_tag = 9;
		break;
	}
	if(rate != 1) {
		for (var j = first_tag; j <= end_tag; ++j) {
			tag[j].style.opacity = '1';
			isRandomMove[j] = false;
		}
		arrangeTag(i);
		hint[i].style.opacity = '1';
	} else {
		for (var j = first_tag; j <= end_tag; ++j) {
			tag[j].style.opacity = '0.5';
			isRandomMove[j] = true;
		}
		hint[i].style.opacity = '0.3';
	}
	clearInterval(timer[i]);
	zoomBtn(button[i], i, rate);
}

//animation
function zoomBtn (button, i, rate) {
	function animation () {
		button.style.transform = 'scale(' + (buttonRate[i] + (rate - buttonRate[i]) / 10) + ')';
		buttonRate[i] = buttonRate[i] + (rate - buttonRate[i]) / 10;
		if(Math.abs(rate - buttonRate[i]) <= 0.01)
			clearInterval(timer[i]);
	}
	timer[i] = setInterval(animation, 15);
}

function arrangeTag (buttonNum) {
	var first_tag, end_tag;
	switch(buttonNum) {
		case 0:
		first_tag = 0;
		end_tag = 3;
		break;
		case 1:
		first_tag = 4;
		end_tag = 6;
		break;
		case 2:
		first_tag = 7;
		end_tag = 9;
		break;
	}
	for(var i = first_tag; i <= end_tag; ++i) {
		quickMove(i, xPos[buttonNum] - picSize / 2 + 15 * (i - first_tag), yPos - 48 * (i - first_tag) - picSize * 2 / 3, (i - first_tag) * 10);
	}
}

function quickMove (i, target_x, target_y, target_Deg) {
	var start_x = parseInt(tag[i].style.left);
	var start_y = parseInt(tag[i].style.top);
	var start_Deg = tagNowRotation[i];
	function tagAnimation () {
		quickMoveX(tag[i], start_x, target_x);
		quickMoveY(tag[i], start_y, target_y);
		quickRotate(tag[i], i, start_Deg, target_Deg);
		tagArrangeTimer[i]++;
		if(tagArrangeTimer[i] >= 12) {
			tagArrangeTimer[i] = 0;
			clearInterval(tagTimer[i]);
		}
	}
	tagTimer[i] = setInterval(tagAnimation, 15);
}

function quickMoveX (obj, start_posX, end_posX) {
	obj.style.left = parseInt(obj.style.left) + (end_posX - start_posX) / 12 + 'px';
}

function quickMoveY (obj, start_posY, end_posY) {
	obj.style.top = parseInt(obj.style.top) + (end_posY - start_posY) / 12 + 'px';
}

function quickRotate (obj, i, start_Deg, end_Deg) {
	var now_deg = tagNowRotation[i];
	obj.style.transform = "rotate(" + (now_deg + (end_Deg - start_Deg) / 12) + "deg)";
	tagNowRotation[i] = now_deg + (end_Deg - start_Deg) / 12;
}

function showAbout () {
	about.style.display = 'inline';
}

function hideAbout () {
	about.style.display = 'none';
}

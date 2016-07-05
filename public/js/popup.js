var isShowPopup = false;
var layerX = 0;
var layerY = 0;
var isDraggable = true;
var closeKey = 27;

$("#btn").onclick = function (argument) {
	$("#cover").attr("style", "position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; display: inline;");
	$("#popupLayer").attr("style", "position: fixed; left: " + layerX + "px; top: " + layerY + "px; font-size: 1.3em; padding: 10px; background-color: #fff; display: inline;");
	isShowPopup = true;
}

$("#cover").onclick = function (argument) {
	if (isShowPopup) {
		$("#cover").attr("style", "position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; display: none;");
		$("#popupLayer").attr("style", "position: fixed; left: 0px; top: 0px; font-size: 1.3em; padding: 10px; background-color: #fff; display: none;");
		isShowPopup = false;
	};
}

var isPressed = false;
var mouseX = 0;
var mouseY = 0;

function mouseDown (e) {
	mouseX = e.pageX;
	mouseY = e.pageY;
	if (isDraggable) {
		isPressed = true;
	};
};

function mouseUp (e) {
	isPressed = false;
};

function mouseMove (e) {
	if (isPressed) {
		var x = e.pageX;
		var y = e.pageY;
		layerX += (x - mouseX);
		layerY += (y - mouseY);
		mouseX = x;
		mouseY = y;
		$("#popupLayer").attr("style", "position: fixed; left: " + layerX + "px; top: " + layerY + "px; font-size: 1.3em; padding: 10px; background-color: #fff; display: inline;");
	};
};

document.onkeydown = function (e) {
	if (e.which == closeKey && isShowPopup) {
		$("#cover").attr("style", "position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; display: none;");
		$("#popupLayer").attr("style", "position: fixed; left: 0px; top: 0px; font-size: 1.3em; padding: 10px; background-color: #fff; display: none;");
		isShowPopup = false;
	};
};

var Modal = $("#popupLayer");

Modal.init = function (arg) {
	if (typeof arg.content != "undefined") {
		this.innerHTML = arg.content;
	};
	if (typeof arg.draggable != "undefined") {
		isDraggable = arg.draggable;
	};
	if (typeof arg.closeKey != "undefined") {
		closeKey = arg.closeKey;
	};
};

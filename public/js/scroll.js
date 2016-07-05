var BackToTopImg = $("#BackToTop");

BackToTopImg.onclick = scrollUp;
document.onkeydown = function (e) {
	if (e.which == 13) {
		scrollUp();
	};
};

function scrollUp () {
	var timer = setInterval(function () {
		if (document.body.scrollTop == 0) {
			clearInterval(timer);
		} else {
			scrollBy(0, -30);
		};
	}, 10);
};

BackToTopImg.attr("style", "display:none;");
window.onscroll = function () {
	if (document.body.scrollTop == 0) {
		BackToTopImg.attr("style", "display:none;");
	} else {
		BackToTopImg.attr("style", "display:inline;");
	};
};

var BackToTop = $("#BackToTopWidget");

BackToTop.init = function(arg) {
	if (arg.LeftUp == true) {
		BackToTop.attr("style", "position: fixed; left: 0%; top: 0%;");
	} else if (arg.LeftDown == true) {
		BackToTop.attr("style", "position: fixed; left: 0%; bottom: 0%;");
	} else if (arg.RightUp == true) {
		BackToTop.attr("style", "position: fixed; right: 0%; top: 0%;");
	} else if (arg.RightDown == true) {
		BackToTop.attr("style", "position: fixed; right: 0%; bottom: 0%;");
	} else {
		BackToTop.attr("style", "position: fixed; left: " + arg.x + "px; top: " + arg.y + "px;");
	};
};

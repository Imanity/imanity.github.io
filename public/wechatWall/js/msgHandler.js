var MsgInStack = new Array();
var Msg = new Array();
var timerLock = true;
var adminTimer;

function handler () {
	if (timerLock) {
		if (MsgInStack.length) {
			handleMsgInStack(MsgInStack.pop());
		};
		if (MsgInStack.length >= 5) {
			MsgInStack.length = 0;
		};
	};
};
setInterval(handler, 1500);

function handleMsg (msg) {
	MsgInStack.push(msg);
}

function handleAdminMsg (msg) {
	$("#admin_text").html(twemoji.parse(msg.content));
	$("#admin_msg").css("display", "inline");
	var resetAdmin = function () {
		$("#admin_msg").css("display", "none");
	};
	var resetLock = function () {
		timerLock = true;
	};
	timerLock = false;
	clearTimeout(adminTimer);
	adminTimer = setTimeout(resetAdmin, 10000);
	setTimeout(resetLock, 2000);
};

function handleMsgInStack (msg) {
	var contentText = twemoji.parse(msg.content);
	if (contentText.length >= 50) {
		contentText = "<marquee>" + contentText + "</marquee>";
	};
	var content = "<div class=\"left\"><img class=\"icon\" src=\"" + msg.headimgurl + "\"></div><div class=\"right\"><div class=\"username\">" + msg.nickname + "</div><div>" + contentText + "</div></div>";
	var end = Msg.length < 4 ? Msg.length : 3;
	var tmp = -1;
	if (Msg.length == 4) {
		tmp = Msg[3];
	};
	for (var i = end; i > 0; i--) {
		$("#msg_" + Msg[i - 1]).animate({top: "" + (i * 22) + "%"}, "slow");
		Msg[i] = Msg[i - 1];
	};
	if (tmp == -1) {
		Msg[0] = Msg.length;
		if (Msg[0] == 0) {
			Msg[0] = 1;
		};
		$("#canvas_box").append("<div class=\"msg\" id=\"msg_" + Msg[0] + "\">" + content + "</div>");
		$("#msg_" + Msg[0]).css("top", "0%");
		$("#msg_" + Msg[0]).css("opacity", "0");
		$("#msg_" + Msg[0]).animate({opacity: "0.95"}, "slow");
	} else {
		Msg[0] = tmp;
		var waitAnime = function () {
			var start_pos = $("#canvas_box").html().indexOf("<div class=\"msg\" id=\"msg_" + Msg[0]);
			var end_pos = $("#canvas_box").html().indexOf("<div class=\"msg\" id=\"msg_", start_pos + 1);
			if (end_pos != -1) {
				var part1 = $("#canvas_box").html().substring(0, start_pos);
				var part2 = $("#canvas_box").html().substring(end_pos);
				$("#canvas_box").html(part1 + "<div class=\"msg\" id=\"msg_" + Msg[0] + "\">" + content + "</div>" + part2);
			} else {
				var part1 = $("#canvas_box").html().substring(0, start_pos);
				$("#canvas_box").html(part1 + "<div class=\"msg\" id=\"msg_" + Msg[0] + "\">" + content + "</div>");
			};
			$("#msg_" + Msg[0]).css("top", "0%");
			$("#msg_" + Msg[0]).css("opacity", "0");
			$("#msg_" + Msg[0]).animate({opacity: "0.95"}, "slow");
		};
		$("#msg_" + Msg[0]).animate({opacity: "0"}, "slow", waitAnime);
	};
};

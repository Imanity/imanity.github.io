var url = "https://wall.cgcgbcbc.com";

var socket = io.connect(url);

socket.on('connect', function () {
	console.log('connected');
});

socket.on('new message', function(message){
	//console.log(message);
	handleMsg(message);
});

socket.on('admin', function(message){
	//console.log(message);
	handleAdminMsg(message);
});

$(document).ready(function () {
	$.get("https://wall.cgcgbcbc.com/api/messages?num=3", function(data,status){
		for (var i = 0; i < data.length; i++) {
			handleMsg(data[i]);
		};
	});
});

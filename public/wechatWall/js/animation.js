function rollingText () {
	$(".movingText").css("margin-left", "100%");
	$(".movingText").animate({"margin-left":"-100%"}, 30000, "linear", rollingText);
}
rollingText();

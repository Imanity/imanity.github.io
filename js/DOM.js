function $ (e) {
	var firstChar = e.charAt(0);
	var result;
	if (firstChar == '#') {
		result = document.getElementById(e.substring(1));
	} else if (firstChar == '.') {
		result = document.getElementsByClassName(e.substring(1));
	} else {
		result = document.getElementsByTagName(e);
	};
	if (result.length == 1) {
		return result[0];
	};
	return result;
};

if(window.HTMLElement) {
	Element.prototype.attr = function() {
		if (arguments.length == 1) {
			return this.getAttribute(arguments[0]);
		} else {
			this.setAttribute(arguments[0], arguments[1]);
		};
		return;
	};
}

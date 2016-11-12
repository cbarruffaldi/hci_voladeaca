function otherArrow(arrow) {
	if (arrow == "up")
		return "down";
	else if (arrow == "down")
		return "up";
}

jQuery.fn.extend({
	glyphiconToggle: function() {
		var glyph = "glyphicon-circle-arrow-";
		var span = $(this).find('span');
		var currentArrow = span.hasClass(glyph + "up") ? "up" : "down";

		span.removeClass(glyph + currentArrow);
		span.addClass(glyph + otherArrow(currentArrow));
	}
});

$(document).ready(function() {
	$('.title-help').click(function() {
		$(this).next('.content-help').slideToggle();
		$(this).glyphiconToggle();
	});
});

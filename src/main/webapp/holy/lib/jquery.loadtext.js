(function($) {
	$.fn.loadText = function(url, data, complete) {
		if(typeof(data) == 'function') {
			complete = data;
			data = null;
		}
		var me = this;
		$.ajax({
			url: url,
			data: data,
			complete: complete,
			dataType: 'text',
			target: me,
			success: function(text) {
				$(this.target).text(text);
			}
		});
	}
})(jQuery);


/**
 * ioloader.js
 * JQuery plugin for lazy preloading of images.
 *
 * All images that are not already loaded (they have the 'lazy-loaded' class) or
 * are about to be loaded (they have the 'lazy-loading' class) will be preloaded
 * via a AJAX call. On successful loading the images are shown.
 *
 * All images subject to dynamic preloading should have the class 'lazy'.
 * In order for example to apply the 'focus point' hook into the 'onBeforeImageShow'
 * callback function.
 *
 * Options:
 *
 * attribute 			: 	name of the attribute that holds the source URL for the image, default is 'data-src'
 * onAfterImageShow		: 	callback handler executed direct after the image loaded and shown,
 * 							before the actual event lazyshow is triggered.
 * onBeforeImageShow	: 	callback handler executed after the image is loaded, but before
 * 							the image is shown.
 */

(function($) {
	'use strict';
	$.fn.ioloader = function(options) {
		var $w = $(window),
			elements = this,
			selector = this.selector,
			defaults = {
				attribute: 'data-src',
				onAfterImageShow: function(e) {},
				onBeforeImageShow: function(e) {}
			};

		var settings = $.extend(defaults, options);

		var onImageLoad = function(e, source) {

			e.removeClass('lazy-loading');
			e.attr('src', source);
			settings.onBeforeImageShow(e);
			e.addClass('lazy-loaded');
			settings.onAfterImageShow(e);
			e.trigger('lazyshow');
		};


		var loadImage = function(e, source) {
			e.addClass('lazy-loading');
			e.trigger('lazyload');
			$.ajax({
				method: 'GET',
				url: source,
				success: function(data, textStatus, jqXHR) {
					onImageLoad(e, source);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					e.trigger('lazyerror', {
						errorMessage: textStatus + ':' + errorThrown
					});
				}
			});
		};

		this.each(function() {
			var $e = $(this),
				source = $e.attr(settings.attribute);
			if ($e.hasClass('lazy-loaded') || $e.hasClass('lazy-loading')) {
				return;
			}
			loadImage($e, source);
		});

		return this;
	};

})(jQuery);

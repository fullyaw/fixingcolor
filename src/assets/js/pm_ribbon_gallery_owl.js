/*
 * Created by Pixel-Mafia
 * www.pixel-mafia.com
*/
"use strict";

var	aurel_ribbon_slider_wrapper = jQuery('.aurel_ribbon_slider_wrapper'),
	aurel_ribbon_slider = jQuery('.aurel_ribbon_slider'),
	aurel_ribbon_slide = jQuery('.aurel_ribbon_slider li');

jQuery(document).ready(function ($) {
	jQuery(".aurel_ribbon_slider_wrapper").each(function () {
		var autoplay = jQuery(this).attr('data-autoplay'),
			speed = parseInt(jQuery(this).attr('data-speed'),10),
			pause = jQuery(this).attr('data-pause'),
			set_pad = parseInt(jQuery(this).attr('data-pad'),10);
		if (autoplay == 'yes') {
			autoplay = true;
		} else {
			autoplay = false;
		}
		if (pause == 'yes') {
			pause = true;
		} else {
			pause = false;
		}
		
		jQuery(this).on("initialized.owl.carousel", function (e) {
			jQuery(this).css("opacity", "1");
		});
		jQuery(this).owlCarousel(
			{
				items: 3,
				center: true,
				lazyLoad: true,
				loop: true,
				autoplay: autoplay,
				autoplayTimeout: speed,
				autoplayHoverPause: pause,
				autoWidth: true,
				dots: false,
				margin: set_pad,
				nav: true,
                navText: ["", ""],
			}
		);
	});

});

jQuery(window).on('resize', function () {
	setup_aurel_ribbon();
});

jQuery(window).on('liad', function () {
	setup_aurel_ribbon();
	setTimeout("aurel_window.trigger('resize')",1000);
});

function setup_aurel_ribbon() {
	aurel_ribbon_slider_wrapper.each(function() {
		if (jQuery('.aurel_ribbon_slider_wrapper.auto_height').length > 0) {
			jQuery('.aurel_ribbon_slider_wrapper.auto_height').each(function() {
				var setHeight = parseInt(jQuery(this).parents('section.elementor-element').children('.elementor-container').css('min-height'),10) - parseInt(jQuery(this).parents('.elementor-column-wrap').css('padding-top'),10) - parseInt(jQuery(this).parents('.elementor-column-wrap').css('padding-bottom'),10);
				
				jQuery(this).height(setHeight);
				jQuery(this).find('.aurel_ribbon_slide').each(function(){
					var ratio = jQuery(this).attr('data-img-width') / jQuery(this).attr('data-img-height');
					
					jQuery(this).width(setHeight * ratio);
				});
			});
		}
		if (jQuery('.aurel_ribbon_slider_wrapper.screen_height').length > 0) {
			jQuery('.aurel_ribbon_slider_wrapper.screen_height').each(function() {
				var setHeight = aurel_window.height();
				
				if (jQuery('#wpadminbar').length > 0) {
					setHeight = setHeight - jQuery('#wpadminbar').height();
				}
				if (jQuery(this).attr('data-header') == 'yes') {
					setHeight = setHeight - jQuery('header.aurel_main_header').height();
				}
				if (jQuery(this).attr('data-footer') == 'yes') {
					setHeight = setHeight - jQuery('footer.aurel_footer').height();
				}
				setHeight = Math.ceil(setHeight);
				jQuery(this).height(setHeight);
				jQuery(this).find('.aurel_ribbon_slide').each(function() {
					var ratio = jQuery(this).attr('data-img-width') / jQuery(this).attr('data-img-height');
					var set_width = Math.ceil(setHeight * ratio);
					jQuery(this).width(set_width);
				});
				
				if (!jQuery('.aurel_footer').hasClass('aurel_template_footer_solid') && jQuery(this).attr('data-footer') !== 'yes') {
					jQuery(this).find('.aurel_ribbon_content').css('bottom', jQuery('.aurel_footer').height()).addClass('remove_gradient_overlay');
					jQuery(this).find('.aurel_slider_overlay_gradient').hide();
				}

			});
		}
		jQuery(this).trigger('refresh.owl.carousel');
	});		
}
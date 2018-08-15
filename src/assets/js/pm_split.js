/*
 * Split Slider
 * Created by Pixel-Mafia
 * www.pixel-mafia.com
*/
"use strict";

(function( $ ){
	var aurel_split_object = {},
		$aurel_split_wrapper = jQuery('.aurel_split_wrapper'),
		lastChange = +new Date();

	if ($aurel_split_wrapper.hasClass('aurel_media_slider_wrapper')) {
		aurel_split_object.type = 'media';
	} else {
		aurel_split_object.type = 'image';
	}
	aurel_split_object.id = $aurel_split_wrapper.attr('data-id');
	aurel_split_object.obj = $aurel_split_wrapper;
	aurel_split_object.slider = $aurel_split_wrapper.find('.aurel_split');
	aurel_split_object.active_left = 0;
	aurel_split_object.active_right = 0;
	aurel_split_object.max_left = $aurel_split_wrapper.find('.aurel_left_slide').length;
	aurel_split_object.max_right = $aurel_split_wrapper.find('.aurel_right_slide').length;
	aurel_split_object.state = 'loading';

	aurel_split_object.init = function() {
		var this_obj = this;
		this.setup(this,'');
		if (this.active_slide == 0) 
			this.change.call(this,1);
		
		this.left_slides = [];
		this.obj.find('.aurel_left_slide').each(function(){
			this_obj.left_slides[jQuery(this).attr('data-count')] = {};
			this_obj.left_slides[jQuery(this).attr('data-count')].src = jQuery(this).attr('data-src');
			this_obj.left_slides[jQuery(this).attr('data-count')].html = jQuery(this).html();
		});
		
		jQuery(this).remove();
		// alert(jQuery(this).attr('data-src'));
		
		this.right_slides = [];
		this.obj.find('.aurel_right_slide').each(function(){
			this_obj.right_slides[jQuery(this).attr('data-count')] = {};
			this_obj.right_slides[jQuery(this).attr('data-count')].src = jQuery(this).attr('data-src');
			this_obj.right_slides[jQuery(this).attr('data-count')].html = jQuery(this).html();
		});
		
		this.obj.find('.aurel_left_slide').remove();
		this.obj.find('.aurel_right_slide').remove();

		// Slides Init
		this.active_left = 1;
		this.active_right = 1;
		var $this_slider = this.slider;
		var before_slide_left, active_slide_left, after_slide_left, after_slide_left_count = 2;
		if (this.max_left < 2)
			after_slide_left_count = 1;
		before_slide_left = '\
		<div class="aurel_left_slide aurel_split_before aurel_split_slide" data-count="'+ this.max_left +'" style="background-image:url('+ this.left_slides[this.max_left].src +')">\
			'+ this.left_slides[this.max_left].html +'\
		</div>';
		active_slide_left = '\
		<div class="aurel_left_slide aurel_split_active aurel_split_slide" data-count="1" style="background-image:url('+ this.left_slides[1].src +')">\
			'+ this.left_slides[1].html +'\
		</div>';
		after_slide_left = '\
		<div class="aurel_left_slide aurel_split_after aurel_split_slide" data-count="'+ after_slide_left_count +'" style="background-image:url('+ this.left_slides[after_slide_left_count].src +')">\
			'+ this.left_slides[after_slide_left_count].html +'\
		</div>';
		$this_slider.append(before_slide_left).append(active_slide_left).append(after_slide_left);

		var before_slide_right, active_slide_right, after_slide_right, after_slide_right_count = 2;
		if (this.max_right < 2)
			after_slide_right_count = 1;
		before_slide_right = '\
		<div class="aurel_right_slide aurel_split_before aurel_split_slide" data-count="'+ this.max_right +'" style="background-image:url('+ this.right_slides[this.max_right].src +')">\
			'+ this.right_slides[this.max_right].html +'\
		</div>';
		active_slide_right = '\
		<div class="aurel_right_slide aurel_split_active aurel_split_slide" data-count="1" style="background-image:url('+ this.right_slides[1].src +')">\
			'+ this.right_slides[1].html +'\
		</div>';
		after_slide_right = '\
		<div class="aurel_right_slide aurel_split_after aurel_split_slide" data-count="'+ after_slide_right_count +'" style="background-image:url('+ this.right_slides[after_slide_right_count].src +')">\
			'+ this.right_slides[after_slide_right_count].html +'\
		</div>';
		$this_slider.append(before_slide_right).append(active_slide_right).append(after_slide_right);
		
		// Touch and Click Events
		this.obj.on("swipeleft", function () {
			aurel_split_object.change.call(aurel_split_object,1);
		});
		this.obj.on("swipeup", function () {
			aurel_split_object.change.call(aurel_split_object,1);
		});
		this.obj.on("swiperight", function () {
			aurel_split_object.change.call(aurel_split_object,-1);
		});
		this.obj.on("swipedown", function () {
			aurel_split_object.change.call(aurel_split_object,-1);
		});

		jQuery('.aurel_split_btn_prev').on('click', function(){
			aurel_split_object.change.call(aurel_split_object,-1);
		});
		jQuery('.aurel_split_btn_next').on('click', function(){
			aurel_split_object.change.call(aurel_split_object,1);
		});
		
		this.obj.on('mousewheel', function(event) {
			event.preventDefault();
			if(+new Date() - lastChange > 100){
				var half_screen = aurel_window.width()/2;
				if (event.deltaY < 0) {
					if (event.pageX <= half_screen) {
						aurel_split_object.change.call(aurel_split_object,1);
					} else {
						aurel_split_object.change.call(aurel_split_object,-1);
					}
				}
				if (event.deltaY > 0) {
					if (event.pageX <= half_screen) {
						aurel_split_object.change.call(aurel_split_object,-1);
					} else {
						aurel_split_object.change.call(aurel_split_object,1);
					}
				}
				lastChange = +new Date();
			} else {
				lastChange = +new Date();
			}
		});	
		
		// Window Events
		jQuery(window).on('load', function(){
			aurel_split_object.obj.removeClass('aurel_module_loading');
			aurel_split_object.setup.call(aurel_split_object,'');
		});
		jQuery(window).on('resize', function(){
			aurel_split_object.setup.call(aurel_split_object,'');
		});
	};
	
	aurel_split_object.setup = function(action) {
		switch (action) {
			default:
				if (aurel_window.height() > aurel_window.width()) {
					jQuery('.aurel_split_wrapper').addClass('aurel_horizontal_split');
				} else {
					jQuery('.aurel_split_wrapper').removeClass('aurel_horizontal_split');
				}
				
				if (this.obj.hasClass('aurel_single_gallery_split')) {
					var this_height = aurel_window.height();
					if (jQuery('#wpadminbar').length) {
						this_height = this_height - jQuery('#wpadminbar').height();
					}
					this.obj.height(this_height);
				} else if (this.obj.hasClass('auto_height')) {
					var $this_column_wrap = this.obj.parents('.elementor-column-wrap'),
						this_height = this.obj.parents('section.elementor-element').children('.elementor-container').height() - parseInt($this_column_wrap.css('padding-top'),10) - parseInt($this_column_wrap.css('padding-bottom'),10);
					this.obj.height(this_height);
				}
				if (this.obj.hasClass('screen_height')) {
					var this_height = aurel_window.height();
					if (jQuery('#wpadminbar').length > 0) {
						this_height = this_height - jQuery('#wpadminbar').height();
					}
					if (this.obj.attr('data-header') == 'yes') {
						this_height = this_height - jQuery('header.aurel_main_header').height();
					}
					if (this.obj.attr('data-footer') == 'yes') {
						this_height = this_height - jQuery('footer.aurel_footer').height();
					}
					this_height = Math.ceil(this_height);
					this.obj.height(this_height);
				}
		}
	};

	aurel_split_object.fix_item = function(check_item,side) {
		if(side == 'left') 
			var max_count = this.max_left;
		if(side == 'right') 
			var max_count = this.max_right;
		
		if (this.obj.hasClass('infinity_scroll')) {
			if (check_item < 1)
				check_item = max_count;
			if (check_item > max_count)
				check_item = 1;
		} else {
			if (check_item < 1)
				check_item = 1;
			if (check_item > max_count)
				check_item = max_count;
		}
		return check_item;
	};
	
	aurel_split_object.change = function(dir) {
		var this_obj = this;
		if (dir > 0) {
			this.obj.find('.aurel_split_before').remove();
			this.obj.find('.aurel_split_active').removeClass('aurel_split_active').addClass('aurel_split_before');
			this.obj.find('.aurel_split_after').removeClass('aurel_split_after').addClass('aurel_split_active');
			
			this.active_left++;
			this.active_right++;
			this.active_left = this.fix_item.call(this_obj, this_obj.active_left, 'left');
			this.active_right = this.fix_item.call(this_obj, this_obj.active_right, 'right');
			
			var left_after = this.active_left + 1,
				right_after = this.active_right + 1;
			left_after = this.fix_item.call(this_obj, left_after, 'left');
			right_after = this.fix_item.call(this_obj, right_after, 'right');
			
			var append_left = '\
				<div class="aurel_left_slide aurel_split_after aurel_split_slide" data-count="'+ left_after +'" style="background-image:url('+ this.left_slides[left_after].src +')">\
					'+ this.right_slides[left_after].html +'\
				</div>';
			var append_right = '\
				<div class="aurel_right_slide aurel_split_after aurel_split_slide" data-count="'+ right_after +'" style="background-image:url('+ this.right_slides[right_after].src +')">\
					'+ this.right_slides[right_after].html +'\
				</div>';
			
			this.slider.append(append_left).append(append_right);
		}
		if (dir < 0) {
			this.obj.find('.aurel_split_after').remove();
			this.obj.find('.aurel_split_active').removeClass('aurel_split_active').addClass('aurel_split_after');
			this.obj.find('.aurel_split_before').removeClass('aurel_split_before').addClass('aurel_split_active');
			
			this.active_left--;
			this.active_right--;
			this.active_left = this.fix_item.call(this, this.active_left, 'left');
			this.active_right = this.fix_item.call(this, this.active_right, 'right');
			
			var left_before = this.active_left - 1,
				right_before = this.active_right - 1;
			left_before = this.fix_item.call(this, left_before, 'left');
			right_before = this.fix_item.call(this, right_before, 'right');
			
			var append_left = '\
				<div class="aurel_left_slide aurel_split_before aurel_split_slide" data-count="'+ left_before +'" style="background-image:url('+ this.left_slides[left_before].src +')">\
					'+ this.right_slides[left_before].html +'\
				</div>';
			var append_right = '\
				<div class="aurel_right_slide aurel_split_before aurel_split_slide" data-count="'+ right_before +'" style="background-image:url('+ this.right_slides[right_before].src +')">\
					'+ this.right_slides[right_before].html +'\
				</div>';
			
			this.slider.append(append_left).append(append_right);
		}		
	};
	
	aurel_split_object.load = function() {
		if (jQuery('.aurel_split2preload:first').length) {
			(function (img, src) {
				img.src = src;
				img.onload = function () {
					jQuery('.aurel_split2preload:first').removeClass('aurel_split2preload').animate({
						'z-index': '3'
					}, 10, function() {
						aurel_split_object.load.call();
					});
				};
			}(new Image(), jQuery('.aurel_split2preload:first').attr('data-src')));
		} else {
			jQuery('.aurel_split_wrapper').removeClass('aurel_module_loading');
			aurel_split_object.init.apply(aurel_split_object);
		}
	};

	jQuery(document.documentElement).keyup(function (event) {
		if ((event.keyCode == 37 || event.keyCode == 38)) {
			event.preventDefault();
			aurel_split_object.change.call(aurel_split_object,-1);
		}
		if ((event.keyCode == 39 || event.keyCode == 40)) {
			event.preventDefault();
			aurel_split_object.change.call(aurel_split_object,1);
		}
	});

	jQuery(document).ready(function(){
		aurel_split_object.load.apply(aurel_split_object);
	});

})( jQuery );
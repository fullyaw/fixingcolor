/*
 * Packery Gallery
 * Created by Pixel-Mafia
 * www.pixel-mafia.com
*/
"use strict";
var $aurel_container = jQuery('.aurel_packery_inner'),
	aurel_packery_array = [],
	$aurel_packery_gallery_array = jQuery('.aurel_packery_gallery_array'),
	$aurel_packery_wrapper = jQuery('.aurel_packery_wrapper');

$aurel_packery_wrapper.each(function() {
	var $this_obj = jQuery(this);
	aurel_packery_array["aurel_packery_" + $this_obj.attr('data-uniqid')] = {};
	var this_array = aurel_packery_array["aurel_packery_" + $this_obj.attr('data-uniqid')];
	this_array.id = jQuery(this).attr('data-uniqid');
	this_array.showed = 0;
	this_array.items = [];
	
	var this_items_array = this_array.items;
	if ($this_obj.find('.aurel_packery_gallery_array').length) {
		$this_obj.find('.aurel_packery_gallery_array').each(function() {
			jQuery(this).find('.aurel_packery_array_item').each(function(){
				var $this = jQuery(this),
					aurel_packery_item = {};
				aurel_packery_item.slide_type = $this.attr('data-type');
				aurel_packery_item.img = $this.attr('data-img');
				aurel_packery_item.thmb = $this.attr('data-thmb');
				aurel_packery_item.title = $this.attr('data-title');
				aurel_packery_item.alt = $this.attr('data-alt');
				aurel_packery_item.overlay = $this.attr('data-overlay');
				aurel_packery_item.counter = $this.attr('data-counter');
				aurel_packery_item.size = $this.attr('data-size');
				this_items_array.push(aurel_packery_item);
			});
			jQuery(this).remove();
		});
	}

	this_array.obj = jQuery('.aurel_packery_'+this_array.id);
	
	this_array.init = function () {
		var this_obj = this;
		this.obj.find('.packery_load_more').on("click", function () {
			this_obj.loadmore.call(this_obj);
			setTimeout("aurel_isotop_el_loading()", 100);
		});
		this.setup.call(this);
		this.preloader.call(this);
	};
	
	this_array.preloader = function() {
		var this_obj = this,
			$this_dom = this.obj;
		if ($this_dom.find('.load_anim:first').length > 0) {
			(function (img, src) {
				img.src = src;
				img.onload = function () {
					$this_dom.find('.load_anim:first').removeClass('load_anim').removeClass('anim_el').animate({
						'z-index': '15'
					}, 200, function() {
						$this_dom.find('.aurel_packery_inner').isotope('layout');
						this_obj.setup.call(this_obj);
						this_obj.preloader.call(this_obj);
					});
				};
			}(new Image(), $this_dom.find('.load_anim:first').find('.packery-item-inner').attr('data-src')));
		} else {
			this_obj.setup.call(this_obj);
		}
	};
	
	this_array.setup = function() {
		var this_obj = this,
			$this_dom = this.obj,
            $aurel_dp = $this_dom.find('.aurel_dp');
        if (aurel_body.hasClass('aurel_drag_protection')) {
            $aurel_dp.on('mousedown',function(e){
                e.preventDefault();
            });
        }
		
		$this_dom.find('.aurel_packery_inner').each(function() {
			var side_padding = Math.floor(parseInt(jQuery(this).attr('data-pad'))/2);
			jQuery(this).parent('.aurel_packery_wrapper').css('padding', side_padding+'px');
			if (aurel_window.width() < 1200 && side_padding > 20) {
				side_padding = side_padding/2;
			}
			if (aurel_window.width() < 760 && side_padding > 10) {
				side_padding = 10;
			}
			if (aurel_window.width() > 760) {
					small_item = Math.floor((jQuery(this).width())/4);
					large_item = small_item*2;
			} else {
				var	small_item = Math.floor(jQuery(this).width()),
					large_item = small_item;
			}
			if (jQuery(this).hasClass('side_paddings_on')) {
				jQuery(this).css('margin-left', -1*side_padding+'px').css('margin-right', -1*side_padding+'px');
				jQuery(this).parent('.aurel_packery_wrapper').css('padding-left','0px').css('padding-right','0px');
			}
			jQuery(this).find('.packery-item').each(function(){
				if (jQuery(this).hasClass('anim_el2')) {
					jQuery(this).removeClass('anim_el2');
				}
				var set_item_width = small_item,
					set_item_height = small_item;					
				if (jQuery(this).hasClass('packery-item1') || jQuery(this).hasClass('packery-item7')) {
					set_item_width = large_item;
					set_item_height = large_item;
				}
				if (jQuery(this).hasClass('packery-item4') || jQuery(this).hasClass('packery-item8')) {
					set_item_width = large_item;
					set_item_height = small_item;
				}
				jQuery(this).find('.packery-item-inner').css({
					'margin-left' : side_padding+'px',
					'margin-top' : side_padding+'px',
					'margin-right' : side_padding+'px',
					'margin-bottom' : side_padding+'px',
					'width' : (set_item_width-side_padding*2)+'px',
					'height' : (set_item_height-side_padding*2)+'px'
				});
				jQuery(this).css({
					'width' : set_item_width+'px',
					'height' : set_item_height+'px'
				});
				if (jQuery(this).hasClass('anim_el2')) {
					jQuery(this).removeClass('anim_el2');
				}				
			});

			jQuery('.aurel_packery_inner').isotope('layout');
			setTimeout("jQuery('.aurel_packery_inner').isotope('layout')",1000);
		});
		
	};
							   
	this_array.loadmore = function() {
		var this_obj = this,
			$this_dom = this.obj,
			aurel_what_to_append = '',		
			aurel_packery_post_per_page = $this_dom.attr('data-perload'),
			aurel_uniqid = this.id,
			aurel_allposts = this.items.length,
			aurel_overlay = $this_dom.find('.aurel_packery_inner').attr('data-overlay'),
			aurel_count = $this_dom.find('.packery-item').length,
			aurel_ins_container = $this_dom.find('.aurel_packery_inner'),
			aurel_load_more_button = $this_dom.find('.packery_load_more');
		var current_count = parseInt($this_dom.find('.packery-item:last').attr('data-count'));
		
		if (this.showed >= aurel_allposts) {
			aurel_load_more_button.slideUp(300);
		} else {
			var aurel_now_step = this.showed + parseInt(aurel_packery_post_per_page) - 1;
			if ((aurel_now_step + 1) < aurel_allposts) {
				var aurel_limit = aurel_now_step;
			} else {
				var aurel_limit = aurel_allposts - 1;
				aurel_load_more_button.slideUp(300);
			}
			
			var aurel_swipebox_class = '';
			if (jQuery('.aurel_single_gallery_wrapper ').length > 0) {
				aurel_swipebox_class = 'swipebox';
			}
			for (var i = this_obj.showed; i <= aurel_limit; i++) {
				current_count ++;
				if (current_count > 8) {
					current_count = 1;
				}
				var aurel_thishref = this_obj.items[i].img,
				aurel_what_to_append = aurel_what_to_append +'\
				<div class="packery-item packery-item'+ current_count +' element anim_el anim_el2 load_anim packery_b2p aurel_isotop_el_loading" data-count="'+ current_count +'">\
					<div class="packery-item-inner" data-src="'+ this_obj.items[i].thmb +'" style="background-image: url('+ this_obj.items[i].thmb +');">\
						<a href="' + aurel_thishref +'" class="aurel_pswp_slide aurel_dp aurel_no_select" data-elementor-open-lightbox="no" data-size="'+ this_obj.items[i].size +'" data-count="'+ aurel_count +'">\
							<div class="packery-item-content">\
								<h4>'+ this_obj.items[i].title +'</h4>\
							</div>\
							<div class="packery-item-overlay aurel_js_bg_color" style="background-color: '+ this_obj.items[i].overlay +'"></div>\
						</a>\
						<div class="aurel-img-preloader"></div>\
					</div>\
				</div>';

				aurel_count++;
				var item_size = this_obj.items[i].size.split('x'),
					item_width = item_size[0],
					item_height = item_size[1],
					this_item = {
						src : aurel_thishref,
						w : item_width,
						h : item_height
					};
				$pswp_gallery_array['aurel_gallery_' + aurel_uniqid].slides.push(this_item);

				this_obj.showed++;
			}

			var $aurel_newItems = jQuery(aurel_what_to_append);

			if (aurel_ins_container.data('isotope')) {
				aurel_ins_container.isotope('insert', $aurel_newItems, function() {
					aurel_ins_container.find('.aurel_packery_inner').ready(function() {
						aurel_ins_container.isotope('layout');
						aurel_setup_packery();
					});
				});
			} else {
				reinsert_items_2_isotope(aurel_ins_container, $aurel_newItems, 'packery');
			}
			this_obj.setup.call(this_obj);
			this_obj.preloader.call(this_obj);
		}
		jQuery('.aurel_packery_inner').isotope("layout");
		setTimeout(function () {jQuery('.gallery_packery').isotope("layout");}, 1500);
	}
});

jQuery(document).ready(function(){
	$aurel_packery_wrapper.each(function() {
		var $this_obj = jQuery(this),
			this_obj = aurel_packery_array["aurel_packery_" + $this_obj.attr('data-uniqid')];
		this_obj.init.call(this_obj);
	});
});

jQuery(window).on('load', function () {
	$aurel_packery_wrapper.each(function() {
		var $this_obj = jQuery(this),
			this_obj = aurel_packery_array["aurel_packery_" + $this_obj.attr('data-uniqid')];
		this_obj.setup.call(this_obj);
	});
});

jQuery(window).on('resize', function () {
	$aurel_packery_wrapper.each(function() {
		var $this_obj = jQuery(this),
			this_obj = aurel_packery_array["aurel_packery_" + $this_obj.attr('data-uniqid')];
		this_obj.setup.call(this_obj);
	});
});

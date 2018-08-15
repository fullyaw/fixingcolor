/*
 * Grid Gallery
 * Created by Pixel-Mafia
 * www.pixel-mafia.com
*/
"use strict";
var $aurel_container = jQuery('.aurel_grid_inner'),
	aurel_grid_array = [],
	$aurel_grid_gallery_array = jQuery('.aurel_grid_gallery_array'),
	$aurel_grid_wrapper = jQuery('.aurel_grid_wrapper');

$aurel_grid_wrapper.each(function() {
	var $this_obj = jQuery(this);
	aurel_grid_array["aurel_grid_" + $this_obj.attr('data-uniqid')] = {};
	var this_array = aurel_grid_array["aurel_grid_" + $this_obj.attr('data-uniqid')];
	this_array.id = jQuery(this).attr('data-uniqid');
	this_array.showed = 0;
	this_array.items = [];
	
	var this_items_array = this_array.items;
	if ($this_obj.find('.aurel_grid_gallery_array').length) {
		$this_obj.find('.aurel_grid_gallery_array').each(function() {
			jQuery(this).find('.aurel_grid_array_item').each(function() {
				var $this = jQuery(this),
					aurel_grid_item = {};
				aurel_grid_item.slide_type = $this.attr('data-type');
				aurel_grid_item.img = $this.attr('data-img');
				aurel_grid_item.thmb = $this.attr('data-thmb');
				aurel_grid_item.title = $this.attr('data-title');
				aurel_grid_item.alt = $this.attr('data-alt');
				aurel_grid_item.overlay = $this.attr('data-overlay');
				aurel_grid_item.counter = $this.attr('data-counter');
				aurel_grid_item.size = $this.attr('data-size');
				this_items_array.push(aurel_grid_item);
			});
			jQuery(this).remove();
		});
	}
	
	this_array.obj = jQuery('.aurel_grid_'+this_array.id);
	
	this_array.init = function () {
		var this_obj = this;
		this.obj.find('.grid_load_more').on("click", function () {
			this_obj.loadmore.call(this_obj);
			setTimeout("aurel_isotop_el_loading()", 600);
		});
		this.setup.call(this);
		this.preloader.call(this);
	};
	
	this_array.preloader = function() {
		var this_obj = this,
			$this_dom = this.obj;
		if ($this_dom.find('.load_anim_grid:first').length > 0) {
			(function (img, src) {
				img.src = src;
				img.onload = function () {
					$this_dom.find('.load_anim_grid:first').removeClass('load_anim_grid').removeClass('anim_el').animate({
						'z-index': '15'
					}, 200, function() {
						$this_dom.find('.aurel_grid_inner').isotope('layout');
						this_obj.setup.call(this_obj);
						this_obj.preloader.call(this_obj);
					});
				};
			}(new Image(), $this_dom.find('.load_anim_grid:first').find('img').attr('src')));
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
		if ($this_dom.find('.aurel_js_bg_color').length) {
			$this_dom.find('.aurel_js_bg_color').each(function () {
				jQuery(this).css('background-color', jQuery(this).attr('data-bgcolor'));
			});
		}
		var side_padding = Math.floor(parseInt($this_dom.find('.aurel_grid_inner').attr('data-pad'))/2,10);
		if (aurel_window.width() < 1200 && side_padding > 20) {
			side_padding = side_padding/2;
		}
		if (aurel_window.width() < 760 && side_padding > 10) {
			side_padding = 10;
		}
		if (jQuery('.aurel_single_gallery_grid').length) {
			$this_dom.find('.aurel_grid_inner').css('margin', side_padding+'px').css('margin-bottom', '0px');
			jQuery('.aurel_single_gallery_grid').css('padding-bottom', side_padding+'px');
		} else {
			$this_dom.find('.aurel_grid_inner').css('margin', side_padding+'px').css('margin-top', -1*side_padding+'px');
		}
		if ($this_dom.find('.aurel_grid_inner').hasClass('side_paddings_on')) {
			$this_dom.find('.aurel_grid_inner').css('margin-left', -1*side_padding+'px').css('margin-right', -1*side_padding+'px');
		}
		$this_dom.find('.grid-item-inner').css({
			'margin-left' : side_padding+'px',
			'margin-top' : side_padding+'px',
			'margin-right' : side_padding+'px',
			'margin-bottom' : side_padding+'px'
		});
		$this_dom.find('.grid-item').each(function(){
			if (jQuery(this).hasClass('anim_el2')) {
				jQuery(this).removeClass('anim_el2');
			}
		});
		$this_dom.find('.aurel_grid_inner').isotope('layout');
		setTimeout("jQuery('.aurel_grid_inner').isotope('layout')",1000);
	};
							   
	this_array.loadmore = function() {
		var this_obj = this,
			$this_dom = this.obj,
			aurel_what_to_append = '',		
			aurel_grid_post_per_page = $this_dom.attr('data-perload'),
			aurel_uniqid = this.id,
			aurel_allposts = this.items.length,
			aurel_overlay = $this_dom.find('.aurel_grid_inner').attr('data-overlay'),
			aurel_count = $this_dom.find('.grid-item').length,
			aurel_ins_container = $this_dom.find('.aurel_grid_inner'),
			aurel_load_more_button = $this_dom.find('.grid_load_more');
	
		if (this.showed >= aurel_allposts) {
			aurel_load_more_button.slideUp(300);
		} else {
			var aurel_now_step = this.showed + parseInt(aurel_grid_post_per_page) - 1;
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
			for (var i = this.showed; i <= aurel_limit; i++) {
				var aurel_thishref = this.items[i].img,
				aurel_what_to_append = aurel_what_to_append +'\
				<div class="grid-item element anim_el anim_el2 load_anim_grid grid_b2p aurel_isotop_el_loading">\
					<div class="grid-item-inner">\
						<a href="' + aurel_thishref +'" class="aurel_pswp_slide aurel_dp aurel_no_select" data-elementor-open-lightbox="no" data-size="'+ this.items[i].size +'" data-count="'+ aurel_count +'">\
							<img src="'+ this.items[i].thmb +'" alt="' + this.items[i].alt + '" class="grid_thmb"/>\
							<div class="grid-item-content">\
								<h4>'+ this.items[i].title +'</h4>\
							</div>\
							<div class="grid-item-overlay aurel_js_bg_color" data-bgcolor="'+ this.items[i].overlay +'"></div>\
						</a>\
						<div class="aurel-img-preloader"></div>\
					</div>\
				</div>';
				aurel_count++;
				
				// PSWP React
				if (this.items[i].slide_type == 'video') {				
					if(aurel_thishref.indexOf('youtu') + 1) {
						//YT Video
						var videoid_split = aurel_thishref.split('='),
							videoid = videoid_split[1],
							aurel_pswp_html = '<div class="aurel_pswp_video_wrapper"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + videoid + '?controls=1&autoplay=0&showinfo=0&modestbranding=1&wmode=opaque&rel=0&hd=1&disablekb=1" frameborder="0" allowfullscreen></iframe></div>';
					}
					if(aurel_thishref.indexOf('vimeo') + 1) {
						//Vimeo Video
						var videoid_split = aurel_thishref.split('m/'),
							videoid = videoid_split[1],
							aurel_pswp_html = '<div class="aurel_pswp_video_wrapper"><iframe width="100%" height="100%" src="https://player.vimeo.com/video/' + videoid + '?api=1&amp;title=0&amp;byline=0&amp;portrait=0&autoplay=0&loop=0&controls=1" frameborder="0" webkitAllowFullScreen allowFullScreen></iframe></div>';
					}
					var this_item = {
						html : aurel_pswp_html
					};
					$pswp_gallery_array['aurel_gallery_' + aurel_uniqid].slides.push(this_item);
				} else {
					var item_size = this.items[i].size.split('x'),
						item_width = item_size[0],
						item_height = item_size[1],
						this_item = {
							src : aurel_thishref,
							w : item_width,
							h : item_height
						};
					$pswp_gallery_array['aurel_gallery_' + aurel_uniqid].slides.push(this_item);
				}

				this.showed++;
			}

			var $aurel_newItems = jQuery(aurel_what_to_append);

			if (aurel_ins_container.data('isotope')) {
				aurel_ins_container.isotope('insert', $aurel_newItems, function() {
					aurel_ins_container.find('.aurel_grid_inner').ready(function() {
						aurel_ins_container.isotope('layout');
						this_obj.setup.call(this_obj);
					});
				});
			}
			this_obj.setup.call(this_obj);
			this_obj.preloader.call(this_obj);
		}
		jQuery('.aurel_grid_inner').isotope("layout");
		setTimeout(function () {jQuery('.gallery_grid').isotope("layout");}, 1500);
	}
});

jQuery(document).ready(function(){
	$aurel_grid_wrapper.each(function() {
		var $this_obj = jQuery(this),
			this_obj = aurel_grid_array["aurel_grid_" + $this_obj.attr('data-uniqid')];
		this_obj.init.call(this_obj);
	});
});

jQuery(window).on('load', function () {
	$aurel_grid_wrapper.each(function() {
		var $this_obj = jQuery(this),
			this_obj = aurel_grid_array["aurel_grid_" + $this_obj.attr('data-uniqid')];
		this_obj.setup.call(this_obj);
	});
});

jQuery(window).on('resize', function () {
	$aurel_grid_wrapper.each(function() {
		var $this_obj = jQuery(this),
			this_obj = aurel_grid_array["aurel_grid_" + $this_obj.attr('data-uniqid')];
		this_obj.setup.call(this_obj);
	});
});

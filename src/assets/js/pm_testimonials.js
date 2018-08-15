/*
 * Testimonials Flow
 * Created by Pixel-Mafia
 * www.pixel-mafia.com
*/
"use strict";

var aurel_ft_array = [],
	$aurel_testimonials_flow = jQuery('.aurel_testimonials_flow');

$aurel_testimonials_flow.each(function() {
	var $this = jQuery(this);
	aurel_ft_array['aurel_ft_'+$this.attr('data-uniqid')] = {};
	var aurel_ft_object = aurel_ft_array['aurel_ft_'+$this.attr('data-uniqid')];
	
	aurel_ft_object.id = $this.attr('data-uniqid');
	aurel_ft_object.obj = $this;
	aurel_ft_object.size = $this.find('.aurel_testimonials_flow_item').length;
	aurel_ft_object.active_slide = 0;
	
	// Core Object Functions
	aurel_ft_object.init = function() {
		
		// Init Counter
		var counter = 1;
		this.obj.find('.aurel_testimonials_flow_item').each(function(){
			jQuery(this).attr('data-count', counter).addClass('aurel_testimonials_flow_slide' + counter);
			counter++;
		});
		this.obj.addClass('module_loaded');
		
		// Init Controls
		var this_object = this;
		this.obj.find('.aurel_testimonials_flow_prev').on('click', function(){		
			this_object.move.call(this_object, -1);
		});
		this.obj.find('.aurel_testimonials_flow_next').on('click', function(){		
			this_object.move.call(this_object, 1);
		});

		// Init Touch Events
		this.obj.on("swiperight", function () {
			this_object.move.call(this_object, -1);
		});
		this.obj.on("swipeleft", function () {
			this_object.move.call(this_object, 1);
		});
		
		this.move.call(this,1);
	}
	
	aurel_ft_object.update = function() {
		if (jQuery('.aurel_ts_flow_current').length) {
			jQuery('.aurel_ts_flow_current').each(function(){
				jQuery(this).parents('.aurel_testimonials_flow_inner').css('min-height', jQuery(this).height()+'px');
			});
		}
	}
	
	aurel_ft_object.move = function(dir) {
		dir = parseInt(dir,10);
		if (dir > 0)
			this.active_slide++;
		if (dir < 0)
			this.active_slide--;
		this.active_slide = this.check.call(this,this.active_slide);
		this.set.call(this,this.active_slide);
	}
	
	aurel_ft_object.check = function(this_val) {
		this_val = parseInt(this_val,10);
		if (this_val < 1) 
			this_val = this.size;
		if (this_val > this.size) 
			this_val = 1;
		return this_val;
	}
	
	aurel_ft_object.set = function(item_id) {
		
		item_id = parseInt(item_id,10);
		
		this.obj.find('.aurel_ts_flow_prev').removeClass('aurel_ts_flow_prev');
		this.obj.find('.aurel_ts_flow_current').removeClass('aurel_ts_flow_current');
		this.obj.find('.aurel_ts_flow_next').removeClass('aurel_ts_flow_next');
		
		var this_prev = item_id - 1,
			this_next = item_id + 1;
		
		this_prev = this.check.call(this,this_prev);
		this_next = this.check.call(this,this_next);
		
		this.obj.find('[data-count='+ this_prev +']').addClass('aurel_ts_flow_prev');
		this.obj.find('[data-count='+ item_id +']').addClass('aurel_ts_flow_current');
		this.obj.find('[data-count='+ this_next +']').addClass('aurel_ts_flow_next');
		
		this.update.call(this);
	}
});

jQuery(document).ready(function(){
	$aurel_testimonials_flow.each(function(){
		var $this = jQuery(this),
			this_object = aurel_ft_array['aurel_ft_'+$this.attr('data-uniqid')];

		this_object.init.call(this_object);
	});
});

jQuery(window).on('load', function () {
	$aurel_testimonials_flow.each(function(){
		var $this = jQuery(this),
			this_object = aurel_ft_array['aurel_ft_'+$this.attr('data-uniqid')];
		
		this_object.update.call(this_object);
	});
});

jQuery(window).on('resize', function () {
	$aurel_testimonials_flow.each(function(){
		var $this = jQuery(this),
			this_object = aurel_ft_array['aurel_ft_'+$this.attr('data-uniqid')];
		
		this_object.update.call(this_object);
	});
});


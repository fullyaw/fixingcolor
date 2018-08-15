import { 
	Component, 
	ChangeDetectorRef, 
	OnInit, 
	AfterViewChecked, 
	AfterViewInit,
  Query,
  QueryList, 
	ViewChild,  
  ContentChildren
} from '@angular/core';

import { SafeHtml } from '../tools/SafeHtml';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import '../../assets/js/pm_image_slider.js'

declare var aurel_slider_object: any;
declare var $aurel_slider_wrapper: any;
declare var jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('slideWrapper') slideWrapper;
  @ViewChild('preloader') preloader;  

  height: number = 0; 
  galleryItems: any = [];
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, protected _changeDetectorRef:ChangeDetectorRef) { }

  ngOnInit() {
    this.getSlideShowItems();    
  }

  ngAfterViewChecked() {
    this._changeDetectorRef.detectChanges();	
  }

  ngAfterViewInit() {
    this.sizeLayout();  
  }

  onResize($event) {
    aurel_slider_object.setup.call(aurel_slider_object,'');
    this.sizeLayout(); 
  }

  onPrev() {
    aurel_slider_object.move.call(aurel_slider_object,-1);
  }

  onNext() {
    aurel_slider_object.move.call(aurel_slider_object,1);
  }

  sizeLayout() {    
    if (this.galleryItems.length > 0) {
      $aurel_slider_wrapper = jQuery(this.slideWrapper.nativeElement);
      aurel_slider_object.obj = $aurel_slider_wrapper;
      aurel_slider_object.options = {
        autoplay: jQuery($aurel_slider_wrapper).attr('data-autoplay'),
        speed: jQuery($aurel_slider_wrapper).attr('data-interval'),
        thumbs: jQuery($aurel_slider_wrapper).attr('data-thumbs'),
        max: this.galleryItems.length,
      }    
      aurel_slider_object.init.apply(aurel_slider_object);
      aurel_slider_object.obj.removeClass('aurel_module_loading');
      aurel_slider_object.setup.call(aurel_slider_object,'');   
    }

	  this.height = window.innerHeight;    
  }

  itemLoaded($event, idx) {
    if (idx == 0) {
      jQuery($event.target).addClass('active');
    }
  }

  hidePreloader() {
    this.isLoading = false;
    if (jQuery(this.preloader).length > 0) {
      jQuery('.fadeOnLoad').removeClass('fadeOnLoad');
      jQuery(this.preloader).addClass('remove_preloader_step01');
      jQuery(this.preloader).addClass('remove_preloader_step02');
      jQuery(this.preloader).remove();
    }
  }

  getSlideShowItems() {
    console.log('getSlideShowItems start');
    this.api.getGalleryItemsForHero().subscribe(data => {
      console.log('getSlideShowItems api returned');
      for (let item of data) {
        console.log('getSlideShowItems looping');
        if (item._id) {
          this.galleryItems.push(item);          
        }
      }  
      this.sizeLayout();   
      console.log('getSlideShowItems sizeLayout');
      this.hidePreloader();
      console.log('getSlideShowItems hide preloader');
    });  
  }
}

import { 
  Component, 
  ChangeDetectorRef, 
  OnInit, 
  AfterViewChecked, 
  AfterViewInit, 
  QueryList, 
  ViewChild,  
  ContentChildren,
  HostListener
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { SafeHtmlOrg } from '../tools/SafeHtml';
import { PhotoSwipeComponent } from '../shared/photoswipe/photoswipe.component';
import { IImage } from '../../app/interface/image';
import { environment } from '../../environments/environment';

declare var aurel_isotope_trigger: any;
declare var jQuery: any;

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})

export class SlideshowComponent implements OnInit, AfterViewInit {

  @ViewChild('photoSwipeWrapper') photoSwipeWrapper;
  @ViewChild('photoSwipe') photoSwipe: PhotoSwipeComponent;
  @ViewChild('isotopeTrigger') isotopeTrigger;
  @ViewChild('pswp') pswp;
  @ContentChildren('beforeAfter') beforeAfters: QueryList<any>

  imageHeight:number = 0;
  height:number = 0;
  itemsLoading:boolean = false;
  gallery: any = {};
  galleryItems = [];
  galleryId: any;
  within: boolean = false;
  beforeAfter: any = null;

  apiUrl: string = environment.apiUrl;

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.itemsLoading = true;
    this.getGalleryItemsForHome(this.galleryId);
  }

  ngAfterViewInit() {
    this.sizeLayout();    
  }

  onResize($event) {
    this.sizeLayout();    
  }

  mouseEnter(event: MouseEvent) {
    this.beforeAfter = (<HTMLDivElement>event.target);;
    this.within = true;
  }

  mouseLeave(event: MouseEvent) {
    this.within = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    
    if (this.beforeAfter !== null) {
      if (this.within) {
        var this_offset = jQuery(this.beforeAfter).offset().left,
        mouse_pos = event.pageX - this_offset,
        current_pos = jQuery(this.beforeAfter).width();
        jQuery(this.beforeAfter).find('.aurel_after_image').width(mouse_pos);
        jQuery(this.beforeAfter).find('.aurel_before_after_divider').css('left', mouse_pos + 'px');      
      } else {
        current_pos = jQuery(this.beforeAfter).width();
        jQuery(this.beforeAfter).find('.aurel_after_image').width(current_pos/2);
        jQuery(this.beforeAfter).find('.aurel_before_after_divider').css('left', current_pos/2 + 'px');            
        this.beforeAfter = null;
      }
    }
  }

  sizeLayout() {
    var aurel_isotope_trigger = jQuery(this.isotopeTrigger.nativeElement);

    if (jQuery(aurel_isotope_trigger).hasClass('is_masonry')) {
      jQuery(aurel_isotope_trigger).isotope({
        layoutMode: 'masonry'
      });
    }
 
    jQuery(aurel_isotope_trigger).isotope("layout");

    if (this.beforeAfters) {
      this.beforeAfters.forEach(function (item, idx) {
        var ctl = jQuery(item).find('aurel_before_after');
        if (ctl) {
          jQuery(item).find('.aurel_after_image').css('width', '50%');
          jQuery(item).find('.aurel_before_after_divider').css('left', '50%');
        }
      });

      var divisor = (window.innerWidth <= 760) ? 1 : 4;
      this.height = this.imageHeight * (Math.ceil(this.galleryItems.length/divisor));      
    }
  }  

  onImageLoaded(e) {
    var divisor = (window.innerWidth <= 760) ? 1 : 4;
    this.imageHeight = e.target.height+65;      
    this.height = this.imageHeight * (Math.ceil(this.galleryItems.length/divisor));    
  }

  getGalleryItemsForHome(id) {
    this.api.getGalleryItemsForHome().subscribe(data => {
      for (let item of data) {
        if (item._id) {
          this.galleryItems.push(item);          
        }
      }     
      this.itemsLoading = false;
      this.sizeLayout();
    });
  }    

  itemClick(idx: number) {
    const images : IImage[] = [];
    for(let item of this.galleryItems) {
      if (item._id) {
        images.push({
          src: environment.apiUrl + '/gallery-item/' + item._id + '/corrected',
          src_original: environment.apiUrl + '/gallery-item/' + item._id + '/original', 
          //thumb: environment.apiUrl + '/gallery-item/' + item._id + '/corrected/m',
          w: 1920,
          h: 1080,
          description: item.description,
          title: item.title,
        })      
      }
    }

    this.photoSwipe.openGallery(images, idx);
  }
}


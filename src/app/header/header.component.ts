import { 
  Inject,
	Component, 
	ChangeDetectorRef, 
	OnInit, 
	AfterViewChecked, 
	AfterViewInit, 
	ViewChild,
  HostListener
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

declare var jQuery: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('mainHeader') mainEl;
  @ViewChild('socialHeader') socialEl;
  @ViewChild('logoHeader') logoEl;
  @ViewChild('menuHeader') menuEl;

  mainWidth: number = 0;
  menuWidth: number = 0;
  logoWidth: number = 0;
  socialWidth: number = 0;
  fragment: string;

  constructor(@Inject(DOCUMENT) private document: Document, protected _changeDetectorRef:ChangeDetectorRef, private route: ActivatedRoute ) { }

  ngOnInit() {
    this.sizeLayout();
    this.route.fragment.subscribe(fragment => { 
      this.fragment = fragment; 
    });
  }

  onResize() {
    this.sizeLayout();  
  }

  ngAfterViewChecked() {
    this._changeDetectorRef.detectChanges();	
    if(this.fragment) {
        document.querySelector('#' + this.fragment).scrollIntoView();
        this.fragment = null;
    }    
  }

  ngAfterViewInit() {
    this.sizeLayout();
  }

  sizeLayout() {
    var aurel_header = jQuery(this.mainEl.nativeElement);
    var aurel_window = window;
    var use_width = 0;
    
    // Sticky Menu
    if (aurel_window.screen.width > 960) {
      if (aurel_header.hasClass('aurel_sticky_menu_on')) {
        if (aurel_header.hasClass('aurel_header_solid_style')) {
          aurel_header.after('<div class="aurel_header_holder"></div>');
          jQuery('.aurel_header_holder').height(aurel_header.height());
        }
        
        if (window.pageYOffset > 0 && aurel_window.screen.width > 1024) {
          aurel_header.addClass('aurel_stick_me');
        } else {
          aurel_header.removeClass('aurel_stick_me');
        }
      }        
    }

    var main_header = jQuery(this.mainEl.nativeElement).width();
    var menu_width = jQuery(this.menuEl.nativeElement).width();
    var logo_width = jQuery(this.logoEl.nativeElement).width();
    var social_width = jQuery(this.socialEl.nativeElement).width();

    if (logo_width > social_width) {
      use_width = logo_width;
    } else {
      use_width = social_width;
    }
    
    var set_menu_width = main_header - use_width*2 - 2;
    this.menuWidth = set_menu_width;
    this.logoWidth = use_width;
    this.socialWidth = use_width;
  }

  @HostListener('window:scroll', ['$event']) 
  scrollHandler(event) {
    this.sizeLayout();
  }

}

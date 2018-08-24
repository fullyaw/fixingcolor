import { OnInit , Component, ViewChild, ElementRef, Input } from '@angular/core';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import { IImage } from '../../interface/image';

declare var jQuery: any;

@Component({
    selector   : 'app-photo-swipe',
    templateUrl: './photoswipe.component.html',
    styleUrls  : ['./photoswipe.component.css']
})
export class PhotoSwipeComponent 
{
    @ViewChild('photoSwipe') photoSwipe: ElementRef;

    @Input() images: IImage[] = [];

    gallery: PhotoSwipe;

    constructor() { }

    ngOnInit() {

    }

    openGallery(images?: IImage[], idx: number = 0)
    {
        images = images || this.images;

        const options = {
            index: idx
        };

        this.gallery = new PhotoSwipe(this.photoSwipe.nativeElement, PhotoSwipeUI_Default, images, options);

        this.gallery.listen('beforeChange', function() {
            console.log('beforeChange')
        });

        this.gallery.listen('afterChange', function() {
            console.log('afterChange')
        });        

        this.gallery.listen('imageLoadComplete', function(index, item) { 
            console.log('imageLoadComplete');

            var height = item.container.firstChild.offsetHeight;

            jQuery(item.container).find('.aurel_after_image').css('width', '50%');
            jQuery(item.container).find('.aurel_after_image').css('height', height + 'px');

            jQuery(item.container).find('.aurel_before_after_divider').css('left', '50%');
            jQuery(item.container).find('.aurel_before_after_divider').css('height', height + 'px');                      
        });

        this.gallery.init();
    }
}

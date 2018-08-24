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
            index: idx,
            allowUserZoom: false,
            maxSpreadZoom: 1,
            getDoubleTapZoom: function (isMouseClick, item) {
                return item.initialZoomLevel;
            },
            zoomEl: false            
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
        });

        this.gallery.init();
    }
}

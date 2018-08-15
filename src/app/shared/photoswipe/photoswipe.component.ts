import { OnInit , Component, ViewChild, ElementRef, Input } from '@angular/core';

import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

import { IImage } from '../../interface/image';

@Component({
    selector   : 'app-photo-swipe',
    templateUrl: './photoswipe.component.html',
    styleUrls  : ['./photoswipe.component.css']
})
export class PhotoSwipeComponent 
{
    @ViewChild('photoSwipe') photoSwipe: ElementRef;

    @Input() images: IImage[] = [];

    constructor() { }

    ngOnInit() {

    }

    openGallery(images?: IImage[], idx: number = 0)
    {
        images = images || this.images;

        const options = {
            index: idx
        };

        const gallery = new PhotoSwipe(this.photoSwipe.nativeElement, PhotoSwipeUI_Default, images, options);
        gallery.init();
    }
}

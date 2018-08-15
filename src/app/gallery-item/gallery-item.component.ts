import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { DataSource } from '@angular/cdk/collections';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-gallery-item',
  templateUrl: './gallery-item.component.html',
  styleUrls: ['./gallery-item.component.css']
})
export class GalleryItemComponent implements OnInit {

  galleryItems: any;
  galleryId:string;
  displayedColumns = ['title', 'description'];
  dataSource = new GalleryItemDataSource(this.api, this.galleryId);
  
  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
    this.galleryId = this.route.snapshot.params['id'];
    this.api.getGalleryItemsForGallery(this.galleryId)
      .subscribe(res => {
        console.log(res);
        this.galleryItems = res;
      }, err => {
        console.log(err);
    });	  
  }

}

export class GalleryItemDataSource extends DataSource<any> {
  
  galleryId:string;

  constructor(private api: ApiService, galleryId: string) {
    super()
  }

  connect() {
    return this.api.getGalleryItemsForGallery(this.galleryId)
  }

  disconnect() {

  }
}

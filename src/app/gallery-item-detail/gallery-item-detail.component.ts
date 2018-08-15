import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-gallery-item-detail',
  templateUrl: './gallery-item-detail.component.html',
  styleUrls: ['./gallery-item-detail.component.css']
})
export class GalleryItemDetailComponent implements OnInit {


  galleryItem: any = {};
  galleryItemForm: FormGroup;
  id:string = '';
  title:string = '';
  description:string = '';
  galleryId:string

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.galleryId = this.route.snapshot.params['galleryId']
    this.id = this.route.snapshot.params['id']
    this.getGalleryItem(this.id);
    this.galleryItemForm = this.formBuilder.group({
      'title' : [null, Validators.required],
      'description' : [null, Validators.required],
    });	    
  };

  getGalleryItem(id) {
    this.api.getGalleryItem(id).subscribe(data => {
      this.id = data._id;
      this.galleryItem = data;
      console.log(this.galleryItem);      
      this.galleryItemForm.setValue({
        title: data.title,
        description: data.description
      });      
    });
  }

  onFormSubmit(form:NgForm) {
    this.api.updateGalleryItem(this.id, form).subscribe(res => {
      this.router.navigate(['/gallery-item-details', this.galleryId, this.id]);
    }, (err) => {
      console.log(err);
    });
  }

  galleryItemDetails() {
    this.router.navigate(['/gallery-details', this.galleryId]);
  }

}

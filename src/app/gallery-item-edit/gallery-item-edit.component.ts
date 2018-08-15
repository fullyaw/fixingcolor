import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-gallery-item-edit',
  templateUrl: './gallery-item-edit.component.html',
  styleUrls: ['./gallery-item-edit.component.css']
})
export class GalleryItemEditComponent implements OnInit {

  galleryItemForm: FormGroup;
  id:string = '';
  title:string = '';
  description:string = '';
  galleryId:string = '';
  matcher: any;
  
  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.galleryId = this.route.snapshot.params['galleryId'];
    this.id = this.route.snapshot.params['id'];
    this.getGalleryItem(this.id);
    this.galleryItemForm = this.formBuilder.group({
      'title' : [null, Validators.required],
      'description' : [null, Validators.required],
      'filters' : [null],
      'sort_order' : [null, Validators.required],
      'on_homepage' : [null],
      'on_slider' : [null]                        
    });	    
  };

  getGalleryItem(id) {
    this.api.getGalleryItem(id).subscribe(data => {
      this.id = data._id;
      this.galleryItemForm.setValue({
        title: data.title,
        description: data.description,
        filters: data.filters,
        sort_order: data.sort_order,
        on_homepage: data.on_homepage,
        on_slider: data.on_slider,
      });      
    });
  }

  onFormSubmit(form:NgForm) {
    this.api.updateGalleryItem(this.id, form).subscribe(res => {
      this.router.navigate(['/gallery-details', this.galleryId]);
    }, (err) => {
      console.log(err);
    });
  }

  galleryItemDetails() {
    this.router.navigate(['/gallery-item-details', this.galleryId, this.id]);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-gallery-edit',
  templateUrl: './gallery-edit.component.html',
  styleUrls: ['./gallery-edit.component.css']
})

export class GalleryEditComponent implements OnInit {

  galleryForm: FormGroup;
  id:string = '';
  title:string = '';
  description:string = '';
  matcher:any;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getGallery(this.route.snapshot.params['id']);
    this.galleryForm = this.formBuilder.group({
      'title' : [null, Validators.required],
      'description' : [null, Validators.required],
    });	    
  };

  getGallery(id) {
    this.api.getGallery(id).subscribe(data => {
      this.id = data._id;
      this.galleryForm.setValue({
        title: data.title,
        description: data.description
      });      
    });
  }

  onFormSubmit(form:NgForm) {
    this.api.updateGallery(this.id, form).subscribe(res => {
      let id = res['_id'];
      this.router.navigate(['/gallery-details', id]);
    }, (err) => {
      console.log(err);
    });
  }

  galleryDetails() {
    this.router.navigate(['/gallery-details', this.id]);
  }

}

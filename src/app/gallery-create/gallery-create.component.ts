import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-gallery-create',
  templateUrl: './gallery-create.component.html',
  styleUrls: ['./gallery-create.component.css']
})
export class GalleryCreateComponent implements OnInit {

  galleryForm: FormGroup;
  title:string='';
  description:string='';
  matcher: any;
  
  constructor(private router: Router, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.galleryForm = this.formBuilder.group({
      'title' : [null, Validators.required],
      'description' : [null, Validators.required]
    });	    
  }

  onFormSubmit(form:NgForm) {
    this.api.postGallery(form).subscribe(res => {
      let id = res['_id'];
      this.router.navigate(['/gallery-details', id]);
    }, (err) => {
      console.log(err);
    });
  }  
}

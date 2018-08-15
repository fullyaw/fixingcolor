import { Component, OnInit, EventEmitter  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient, HttpResponse, HttpRequest, HttpHeaders,
         HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { catchError, last, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
//import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-gallery-item-create',
  templateUrl: './gallery-item-create.component.html',
  styleUrls: ['./gallery-item-create.component.css']
})

export class GalleryItemCreateComponent implements OnInit {

  isLoading: boolean = false;
  gallery: any;
  galleryItemForm: FormGroup;
  galleryId:string;  
  title:string='';
  description:string='';
  
  text = 'Upload';
  param = 'file';
  accept = 'image/*';

  formData: FormData = new FormData();

  constructor(private _http: HttpClient, private route: ActivatedRoute, private router: Router, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.isLoading = true;
    console.log('galleryId:' + this.route.snapshot.params['galleryId']);
    this.getGalleryDetails(this.route.snapshot.params['galleryId']);  
    this.galleryId = this.route.snapshot.params['galleryId'];
    this.galleryItemForm = this.formBuilder.group({
      'title' : [null, Validators.required],
      'description' : [null, Validators.required],
      'originalFile' : [null],      
      'correctedFile' : [null, Validators.required],
      'filters' : [null],
      'sort_order' : [null, Validators.required],
      'on_homepage' : [null],
      'on_slider' : [null],
      'galleryId': this.galleryId
    });	  
  }

  getGalleryDetails(id) {
    this.api.getGallery(id).subscribe(data => {
      console.log(data);
      this.gallery = data;
      this.isLoading = false;
    });
  }

  onOriginalFileClick() {
    this.onClick('originalFile');
  }

  onCorrectedFileClick() {
    this.onClick('correctedFile');  
  }

  onClick(fileElm:string) {
    const fileUpload = document.getElementById(fileElm) as HTMLInputElement;
    fileUpload.onchange = (event?: HTMLInputEvent) => {
      let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.galleryItemForm.get(fileElm).setValue({
            filename: file.name,
            filetype: file.type,
            value: reader.result.split(',')[1]
          })
        };
        
        this.formData.append(fileElm, file, file.name);
      }
    };
    fileUpload.click();
  }            

  onFormSubmit(form:NgForm) {
    this.isLoading = true;
    this.api.postGalleryItem(form).subscribe(res => {
      console.log(form);
      this.api.uploadFileToGallery(this.formData, this.galleryId, res._id).subscribe(res => {
        this.gallery.gallery_items.push(res);
        this.api.updateGallery(this.galleryId, this.gallery).subscribe(res3 => {
          this.isLoading = true;
          this.router.navigate(['/gallery-details', this.galleryId]);
        }, (err) => {
          console.log(err);
        });          
      }, (err) => {
        console.log(err);
      });          
    }, (err) => {
      console.log(err);
    });
  }  
}

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}
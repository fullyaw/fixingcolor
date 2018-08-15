import { Component, OnInit, ViewChild , AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs'
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

const success_msg = 'Message sent';
const error_msg = 'An error occured while sending your message';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, private formBuilder: FormBuilder) { }

  isLoading: boolean = false;
  contactForm: FormGroup;
  email:string = '';
  name:string = '';
  subject:string = '';
  message:string = '';
  responseMessage:string = '';

  successObservable: Subscription;

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      'name' : [null, Validators.required],
      'email' : [null, Validators.required],
      'subject' : [null],
	    'message' : [null, Validators.required]
    });	     
  }

  sendMail(form:NgForm) {  
    this.isLoading = true;
    this.successObservable = this.api.sendEmail(form).subscribe(res => {
      let success = res['success'];
      this.responseMessage = (success) ? success_msg : error_msg;
      this.isLoading = false;      
    }, (err) => {
      console.log(err);
    });
  }

}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Angular2PromiseButtonModule } from 'angular2-promise-buttons/dist';
import { SafeHtml } from './tools/SafeHtml';
import { SafeHtmlOrg } from './tools/SafeHtml';

import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatDialogModule,
  MatCheckboxModule  } from "@angular/material";
  
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryDetailComponent } from './gallery-detail/gallery-detail.component';
import { GalleryCreateComponent } from './gallery-create/gallery-create.component';
import { GalleryEditComponent } from './gallery-edit/gallery-edit.component';
import { GalleryItemComponent } from './gallery-item/gallery-item.component';
import { GalleryItemDetailComponent } from './gallery-item-detail/gallery-item-detail.component';
import { GalleryItemCreateComponent } from './gallery-item-create/gallery-item-create.component';
import { GalleryItemEditComponent } from './gallery-item-edit/gallery-item-edit.component';
import { DeleteConfirmDialogComponent } from './shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ServicesComponent } from './services/services.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { PhotoSwipeComponent } from './shared/photoswipe/photoswipe.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { title: 'Signup' }
  },  
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Color Ninja' }
  },  
  { 
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'gallery',
    component: GalleryComponent,
    data: { title: 'Gallery List' }
  },
  {
    path: 'gallery-details/:id',
    component: GalleryDetailComponent,
    data: { title: 'Gallery Details' }
  },
  {
    path: 'gallery-create',
    component: GalleryCreateComponent,
    data: { title: 'Create Gallery' }
  },
  {
    path: 'gallery-edit/:id',
    component: GalleryEditComponent,
    data: { title: 'Edit Gallery' }
  },
  {
    path: 'gallery-item',
    component: GalleryItemComponent,
    data: { title: 'GalleryItem List' }
  },
  {
    path: 'gallery-item-details/:galleryId/:id',
    component: GalleryItemDetailComponent,
    data: { title: 'GalleryItem Details' }
  },
  {
    path: 'gallery-item-create/:galleryId',
    component: GalleryItemCreateComponent,
    data: { title: 'Create GalleryItem' }
  },
  {
    path: 'gallery-item-edit/:galleryId/:id',
    component: GalleryItemEditComponent,
    data: { title: 'Edit GalleryItem' }
  }  
];

@NgModule({
  declarations: [
    AppComponent,
    GalleryComponent,
    GalleryDetailComponent,
    GalleryCreateComponent,
    GalleryEditComponent,
    GalleryItemComponent,
    GalleryItemDetailComponent,
    GalleryItemCreateComponent,
    GalleryItemEditComponent,
    DeleteConfirmDialogComponent,
    LoginComponent,
    SignupComponent,
    ContactComponent,
    HomeComponent,
    SlideshowComponent,
    HeaderComponent,
    FooterComponent,
    ServicesComponent,
    LayoutComponent,
    PhotoSwipeComponent,
    SafeHtml,
    SafeHtmlOrg
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    Angular2PromiseButtonModule.forRoot({
      disableBtn: true,
      btnLoadingClass: 'is-loading',
      handleCurrentBtnOnly: false,
    }),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatDialogModule,
    MatProgressBarModule,
    MatCheckboxModule
  ],
  exports: [SafeHtml],
  entryComponents: [DeleteConfirmDialogComponent],
  providers: [MatDialogModule],
  bootstrap: [AppComponent]
})
export class AppModule { }

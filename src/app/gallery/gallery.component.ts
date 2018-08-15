import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ApiService } from '../api.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmDialogComponent } from '../shared/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  galleries: any;
  displayedColumns = ['title', 'description', 'enabled', 'options'];
  dataSource = new GalleryDataSource(this.api);

  constructor(private api: ApiService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {

  }

  enableGallery(enabled: boolean, id: string) {
    this.api.getGallery(id).subscribe(res => {
      res.enabled = !enabled;
      this.api.updateGallery(id, res).subscribe(res => {
        console.log('updated')
      }, (err) => {
        console.log(err);
      });      
    }, (err) => {
      console.log(err);
    });      
  }

  viewGallery(id: string) {
    this.router.navigate(['/gallery-details', id]);
  }

  deleteGallery(id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      title: 'Confirm Deletion?'
    };
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog was closed' );
      if (result) {
        this.api.deleteGallery(id).subscribe(res => {
          this.dataSource = new GalleryDataSource(this.api);
        }, (err) => {
          console.log(err);
        });
      }
    });
  }

  editGallery(id: string) {
    this.router.navigate(['/gallery-details', id]);
  }    
}

export class GalleryDataSource extends DataSource<any> {
  constructor(private api: ApiService) {
    super()
  }

  connect() {
    return this.api.getGalleries();
  }

  disconnect() {

  }
}


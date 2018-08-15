import { Component, OnInit, ViewChild , AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { DeleteConfirmDialogComponent } from '../shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { of, merge } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material';


@Component({
  selector: 'app-gallery-detail',
  templateUrl: './gallery-detail.component.html',
  styleUrls: ['./gallery-detail.component.css']
})

export class GalleryDetailComponent implements OnInit {

  gallery: any = {};
  galleryItems = [];
  galleryId: any;
  displayedColumns = ['title', 'description', 'thumb', 'options'];
  dataSource = new GalleriesDataSource(this.api, this.route.snapshot.params['id']);
  itemsLoading = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.itemsLoading = true;
    this.galleryId = this.route.snapshot.params['id'];
    this.getGalleryDetails(this.galleryId);
    this.dataSource.loadGalleries(this.galleryId, '', 'asc', 0, 10);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    
    merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            tap(() => this.loadGalleriesPage())
        )
        .subscribe();
  }  

  loadGalleriesPage() {
    this.dataSource.loadGalleries(
      this.galleryId,  '',  this.sort.direction, 
      this.paginator.pageIndex, this.paginator.pageSize);
  }

  getGalleryDetails(id) {
    this.api.getGallery(id).subscribe(data => {
      this.gallery = data;
      for (let id of this.gallery['gallery_items']) {
        this.api.getGalleryItem(id).subscribe(item => {
          this.galleryItems.push(item);          
        });
      }     
      this.itemsLoading = false;
    });
  }
    
  deleteGallery(id) {
    this.api.deleteGallery(id).subscribe(res => {
      this.router.navigate(['/gallery']);
    }, (err) => {
      console.log(err);
    });
  }

  deleteGalleryItem(id: string) {
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
        this.api.deleteGalleryItem(id, this.galleryId).subscribe(res => {
          this.loadGalleriesPage();
        }, (err) => {
          console.log(err);
        });  
      }
    });  
  }  

  editGalleryItem(id: string) {
    this.router.navigate(['/gallery-item-edit', this.galleryId, id]);  
  }  

  viewPortfolio(id: string) {
    this.router.navigate(['/gallery-item-details', this.galleryId, id]);    
  }
}

export class GalleryItemDataSource extends DataSource<any> {
  constructor(private api: ApiService, private galleryId: string) {
    super()
  }

  connect() {
    //let res = this.api.getBooks();
    let res = this.api.getGalleryItemsForGallery(this.galleryId);
    console.log(res);
    return res;
  }

  disconnect() {

  }
}

export class GalleriesDataSource implements DataSource<any> {

    private gallerySubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private api: ApiService, private galleryId: string) {}

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.gallerySubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.gallerySubject.complete();
        this.loadingSubject.complete();
    }

    loadGalleries(galleryId: number, filter = 'y',
                sortDirection = 'asc', pageIndex = 0, pageSize = 3) {

        this.loadingSubject.next(true);

        filter  = "y";
        //var sortDirection  = "";
        //var pageIndex = 0;
        //var pageSize = 2;

        this.api.findGalleryItems(this.galleryId, filter, sortDirection,
            pageIndex, pageSize).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(gallery => this.gallerySubject.next(gallery));
    }    
}


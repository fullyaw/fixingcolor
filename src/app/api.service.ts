import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const apiUrl = environment.apiUrl;

console.log('Useing Service Url:' + apiUrl);

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) { }

  getApiUrl() {
    return apiUrl;
  }

  logout(): Observable<any> {
    return this.http.get(apiUrl + '/signout', this.getHttpOptions()).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  debugAuth(): Observable<any> {
    return this.http.get(apiUrl + '/secretDebug', this.getHttpOptions()).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getGalleries(): Observable<any> {
    return this.http.get(apiUrl + '/gallery', this.getHttpOptions()).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getGallery(id: string): Observable<any> {
    const url = `${apiUrl}/gallery/${id}`;
    return this.http.get(url, this.getHttpOptions()).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  postGallery(data): Observable<any> {
    return this.http.post(apiUrl + '/gallery', data, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  updateGallery(id:string, data): Observable<any> {
    return this.http.put(apiUrl + '/gallery/' + id, data, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  deleteGallery(id: string): Observable<{}> {
    const url = `${apiUrl}/gallery/${id}`;
    return this.http.delete(url, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  uploadFileToGallery(data, galleryId, id) { 
    const url = `${apiUrl}/gallery/${galleryId}/gallery-item/upload/${id}`;
    return this.http.post(url, data)
      .pipe(catchError(this.handleError));
  }

  getGalleryItemsForHero(): Observable<any> {
    const url = `${apiUrl}/home/hero/`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getGalleryItemsForHome(): Observable<any> {
    const url = `${apiUrl}/home/`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getGalleryItemsForGallery(id: string): Observable<any> {
    const url = `${apiUrl}/gallery/${id}/gallery-item`;
    return this.http.get(url, this.getHttpOptions()).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  findGalleryItems(galleryId, filter, sortDirection,
            pageIndex, pageSize): Observable<any> {
    const url = `${apiUrl}/gallery/${galleryId}/gallery-item/${sortDirection}/${pageIndex}/${pageSize}/${filter}`;
    return this.http.get(url, this.getHttpOptions()).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getGalleryItem(id: string): Observable<any> {
    const url = `${apiUrl}/gallery-item/${id}`;
    return this.http.get(url, this.getHttpOptions()).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  postGalleryItem(data): Observable<any> {
    const url = `${apiUrl}/gallery-item`;
    return this.http.post(url, data, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  updateGalleryItem(id:string, data): Observable<any> {
    const url = `${apiUrl}/gallery-item/${id}`;
    return this.http.put(url, data, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  deleteGalleryItem(id: string, galleryId: string): Observable<{}> {
    const url = `${apiUrl}/gallery/${galleryId}/gallery-item/${id}`;
    return this.http.delete(url, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  sendEmail(data): Observable<{}> {
    const url = `${apiUrl}/sendEmail`;
    return this.http.post(url, data, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('jwtToken')
      })
    };
  }
  
  private extractData(res: Response) {
    let body = res;
    return body || { };
  } 
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  };  
}

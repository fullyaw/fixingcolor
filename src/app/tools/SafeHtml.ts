import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Pipe({name: 'safeHtml'})
export class SafeHtml implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){}

  transform(id: string) : SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle('url(' + environment.apiUrl + '/gallery-item/' + id + '/corrected');
  }
}

@Pipe({name: 'safeHtmlOrg'})
export class SafeHtmlOrg implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){}

  transform(id: string) : SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle('url(' + environment.apiUrl + '/gallery-item/' + id + '/original');
  }
}
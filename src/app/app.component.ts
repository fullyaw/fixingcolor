import { 
	Component, 
	ChangeDetectorRef, 
	OnInit, 
	AfterViewChecked, 
	AfterViewInit, 
	ViewChild 
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {
  title = 'ColorNinja';

  @ViewChild('mainWrapper') mainWrapper;

  mainWrapperMinWidth: number = 0;

  constructor(protected _changeDetectorRef:ChangeDetectorRef) { }

  ngOnInit() {
    this.sizeLayout();
  }

  ngAfterViewChecked() {
    this._changeDetectorRef.detectChanges();	
  }

  ngAfterViewInit() {
    this.sizeLayout();
  }

  onResize() {
    this.sizeLayout() ; 
  }

  sizeLayout() {

  }
}


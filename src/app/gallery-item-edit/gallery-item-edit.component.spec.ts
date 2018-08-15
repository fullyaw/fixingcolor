import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryItemEditComponent } from './gallery-item-edit.component';

describe('GalleryItemEditComponent', () => {
  let component: GalleryItemEditComponent;
  let fixture: ComponentFixture<GalleryItemEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryItemEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryItemCreateComponent } from './gallery-item-create.component';

describe('GalleryItemCreateComponent', () => {
  let component: GalleryItemCreateComponent;
  let fixture: ComponentFixture<GalleryItemCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryItemCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryItemCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

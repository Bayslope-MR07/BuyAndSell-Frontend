import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdaUploadComponent } from './nda-upload.component';

describe('NdaUploadComponent', () => {
  let component: NdaUploadComponent;
  let fixture: ComponentFixture<NdaUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NdaUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdaUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

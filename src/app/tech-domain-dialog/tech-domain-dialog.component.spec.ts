import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechDomainDialogComponent } from './tech-domain-dialog.component';

describe('TechDomainDialogComponent', () => {
  let component: TechDomainDialogComponent;
  let fixture: ComponentFixture<TechDomainDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechDomainDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechDomainDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSellerDataComponent } from './user-seller-data.component';

describe('UserSellerDataComponent', () => {
  let component: UserSellerDataComponent;
  let fixture: ComponentFixture<UserSellerDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSellerDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSellerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

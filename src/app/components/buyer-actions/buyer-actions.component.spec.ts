import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerActionsComponent } from './buyer-actions.component';

describe('BuyerActionsComponent', () => {
  let component: BuyerActionsComponent;
  let fixture: ComponentFixture<BuyerActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyerActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

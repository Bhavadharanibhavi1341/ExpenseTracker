import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupExpenseComponent } from './popup-expense.component';

describe('PopupExpenseComponent', () => {
  let component: PopupExpenseComponent;
  let fixture: ComponentFixture<PopupExpenseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupExpenseComponent]
    });
    fixture = TestBed.createComponent(PopupExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

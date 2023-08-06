import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitPayComponent } from './split-pay.component';

describe('SplitPayComponent', () => {
  let component: SplitPayComponent;
  let fixture: ComponentFixture<SplitPayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SplitPayComponent]
    });
    fixture = TestBed.createComponent(SplitPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

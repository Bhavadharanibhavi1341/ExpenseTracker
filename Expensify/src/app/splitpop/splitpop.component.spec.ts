import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitpopComponent } from './splitpop.component';

describe('SplitpopComponent', () => {
  let component: SplitpopComponent;
  let fixture: ComponentFixture<SplitpopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SplitpopComponent]
    });
    fixture = TestBed.createComponent(SplitpopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

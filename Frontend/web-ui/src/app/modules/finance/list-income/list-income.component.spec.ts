import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIncomeComponent } from './list-income.component';

describe('ListIncomeComponent', () => {
  let component: ListIncomeComponent;
  let fixture: ComponentFixture<ListIncomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListIncomeComponent]
    });
    fixture = TestBed.createComponent(ListIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeMonitoringComponent } from './fee-monitoring.component';

describe('FeeMonitoringComponent', () => {
  let component: FeeMonitoringComponent;
  let fixture: ComponentFixture<FeeMonitoringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeeMonitoringComponent]
    });
    fixture = TestBed.createComponent(FeeMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

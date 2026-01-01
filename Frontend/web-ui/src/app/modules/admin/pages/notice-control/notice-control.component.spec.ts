import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeControlComponent } from './notice-control.component';

describe('NoticeControlComponent', () => {
  let component: NoticeControlComponent;
  let fixture: ComponentFixture<NoticeControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoticeControlComponent]
    });
    fixture = TestBed.createComponent(NoticeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

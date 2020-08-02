import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyTabComponent } from './hourly-tab.component';

describe('HourlyTabComponent', () => {
  let component: HourlyTabComponent;
  let fixture: ComponentFixture<HourlyTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourlyTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

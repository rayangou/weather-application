import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyTabComponent } from './weekly-tab.component';

describe('WeeklyTabComponent', () => {
  let component: WeeklyTabComponent;
  let fixture: ComponentFixture<WeeklyTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

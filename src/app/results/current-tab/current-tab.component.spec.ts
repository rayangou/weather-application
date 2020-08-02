import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTabComponent } from './current-tab.component';

describe('CurrentTabComponent', () => {
  let component: CurrentTabComponent;
  let fixture: ComponentFixture<CurrentTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

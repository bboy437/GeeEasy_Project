import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealersSaveComponent } from './dealers-save.component';

describe('DealersSaveComponent', () => {
  let component: DealersSaveComponent;
  let fixture: ComponentFixture<DealersSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealersSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealersSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

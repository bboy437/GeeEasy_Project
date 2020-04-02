import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AleartComponent } from './aleart.component';

describe('AleartComponent', () => {
  let component: AleartComponent;
  let fixture: ComponentFixture<AleartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AleartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AleartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

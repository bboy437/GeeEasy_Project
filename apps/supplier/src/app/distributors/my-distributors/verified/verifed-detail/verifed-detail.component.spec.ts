import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifedDetailComponent } from './verifed-detail.component';

describe('VerifedDetailComponent', () => {
  let component: VerifedDetailComponent;
  let fixture: ComponentFixture<VerifedDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifedDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

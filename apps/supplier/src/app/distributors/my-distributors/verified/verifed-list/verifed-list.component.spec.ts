import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifedListComponent } from './verifed-list.component';

describe('VerifedListComponent', () => {
  let component: VerifedListComponent;
  let fixture: ComponentFixture<VerifedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

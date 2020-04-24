import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MysupplierSaveComponent } from './my-supplier-save.component';

describe('MysupplierSaveComponent', () => {
  let component: MysupplierSaveComponent;
  let fixture: ComponentFixture<MysupplierSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MysupplierSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MysupplierSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

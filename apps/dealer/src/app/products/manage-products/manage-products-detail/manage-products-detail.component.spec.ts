import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageProductDetailComponent } from './manage-products-detail.component';


describe('ManageProductDetailComponent', () => {
  let component: ManageProductDetailComponent;
  let fixture: ComponentFixture<ManageProductDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageProductDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

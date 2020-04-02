import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersBillsListComponent } from './orders-bills-list.component';



describe('OrdersBillsListComponent', () => {
  let component: OrdersBillsListComponent;
  let fixture: ComponentFixture<OrdersBillsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersBillsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersBillsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

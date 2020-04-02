import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductTeamComponent } from './add-product-team.component';

describe('AddProductTeamComponent', () => {
  let component: AddProductTeamComponent;
  let fixture: ComponentFixture<AddProductTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

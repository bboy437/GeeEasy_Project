import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyteamCreateComponent } from './myteam-create.component';

describe('MyteamCreateComponent', () => {
  let component: MyteamCreateComponent;
  let fixture: ComponentFixture<MyteamCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyteamCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyteamCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

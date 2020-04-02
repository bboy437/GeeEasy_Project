import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyteamListComponent } from './myteam-list.component';

describe('MyteamListComponent', () => {
    let component: MyteamListComponent;
    let fixture: ComponentFixture<MyteamListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyteamListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MyteamListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

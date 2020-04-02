import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyteamDetailComponent } from './myteam-detail.component';

describe('MyteamDetailComponent', () => {
    let component: MyteamDetailComponent;
    let fixture: ComponentFixture<MyteamDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MyteamDetailComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MyteamDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerProductPushComponent } from './dealer-product-push.component';

describe('DealerProductPushComponent', () => {
    let component: DealerProductPushComponent;
    let fixture: ComponentFixture<DealerProductPushComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DealerProductPushComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DealerProductPushComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

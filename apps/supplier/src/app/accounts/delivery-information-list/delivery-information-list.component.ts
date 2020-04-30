import { Component, OnInit, ChangeDetectionStrategy, Injectable } from '@angular/core';
import { AccountAPIService } from '@project/services';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISetting } from '@project/interfaces';
import JSON_CURRENCY from "../../../../../../libs/shared/src/lib/json/currency.json";

import { NgbTimeStruct, NgbTimeAdapter, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';

const pad = (i: number): string => i < 10 ? `0${i}` : `${i}`;

/**
 * Example of a String Time adapter
 */
@Injectable()
export class NgbTimeStringAdapter extends NgbTimeAdapter<string> {

    fromModel(value: string | null): NgbTimeStruct | null {
        if (!value) {
            return null;
        }
        const split = value.split(':');
        return {
            hour: parseInt(split[0], 10),
            minute: parseInt(split[1], 10),
            second: parseInt(split[2], 10)
        };
    }

    toModel(time: NgbTimeStruct | null): string | null {
        return time != null ? `${pad(time.hour)}:${pad(time.minute)}:${pad(time.second)}` : null;
    }
}


@Component({
    selector: 'project-delivery-information-list',
    templateUrl: './delivery-information-list.component.html',
    styleUrls: ['./delivery-information-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter }]
})
export class DeliveryInformationListComponent implements OnInit {

    public payment: string[] = ['1', '3', '7', '15', '30', '60', '90'];
    arrRadius = [{ "id": "1", "name": "KM" }];
    dataDeliver: any = [];
    Form: FormGroup;
    loading = false;
    issaveloading = false;
    arrCurrency: any[] = JSON_CURRENCY;
    id_local: string;


    constructor(
        private accountAPIService: AccountAPIService,
        private formBuilder: FormBuilder,
        config: NgbTimepickerConfig
    ) {
        this.id_local = localStorage.getItem('id');
        this.loading = true;
    }


    ngOnInit() {
        this.Builder();
        this.getData();
    }

    getData() {
        this.accountAPIService.delivery$.subscribe(res => {
            this.dataDeliver = res[0];
            this.detailForm();

        })
    }

    Builder() {
        this.Form = this.formBuilder.group({
            minimum_order_currency_code: ['', Validators.required],
            delivery_days: ['', Validators.required],
            delivery_radius_distance_code: ['', Validators.required],
            minimum_free_delivery: ['', Validators.required],
            minimum_order_price: ['', Validators.required],
            order_cutoff_time: ['', Validators.required],
        });
    }

    detailForm() {
        this.Form.patchValue({
            minimum_order_currency_code: this.dataDeliver.setting_json.minimum_order_currency_code,
            delivery_days: this.dataDeliver.setting_json.delivery_days,
            delivery_radius_distance_code: this.dataDeliver.setting_json.delivery_radius_distance_code,
            minimum_free_delivery: this.dataDeliver.setting_json.minimum_free_delivery,
            minimum_order_price: this.dataDeliver.setting_json.minimum_order_price,
            order_cutoff_time: this.dataDeliver.setting_json.order_cutoff_time,
        });
        console.log(this.Form.value)
        this.loading = false;
    }

    clickPayment(event) {
        console.log(event);
        this.Form.get("delivery_days").patchValue(event);
    }

    btnSaveClick() {
        this.loading = true;
        const dataJson = {
            "supplier_id": this.id_local,
            "setting_json": this.Form.value

        }
        console.log(dataJson);
        this.save(dataJson)
    }

    save(dataJson) {
        this.accountAPIService.addDeliverInformation(JSON.stringify(dataJson)).subscribe(res => {
            console.log(res);
            this.Form.reset();
            this.getData();
        })
    }



}

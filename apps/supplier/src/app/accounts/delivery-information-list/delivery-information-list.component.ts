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

  fromModel(value: string| null): NgbTimeStruct | null {
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
    providers: [{provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter}]
})
export class DeliveryInformationListComponent implements OnInit {

    public payment: string[] = ['1', '3', '7', '15', '30', '60', '90'];
    arrRadius = [{ "id": "1", "name": "KM" }];

    dataDeliver: any = [];
    errorMassgess: string;
    form: FormGroup;
    arrDeliver$: Observable<ISetting[]>;
    loading = true;
    arrCurrency: any[] = JSON_CURRENCY;


    delivery$ = this.accountAPIService.arrdelivery$
        .pipe(
            tap(data => this.loading = false),
            catchError(err => {
                this.errorMassgess = err;
                return EMPTY;
            })
        )

    constructor(
        private accountAPIService: AccountAPIService,
        private formBuilder: FormBuilder,
        config: NgbTimepickerConfig
    ) {
        this.loading = true;
    }


    ngOnInit() {
        this.form = this.formBuilder.group({
            delivery_charge: ['', Validators.required],
            delivery_days: ['', Validators.required],
            delivery_radius: ['', Validators.required],
            minimum_free_delivery: ['', Validators.required],
            minimum_order_price: ['', Validators.required],
            order_cutoff_time: ['', Validators.required],
        });

        // this.arrDeliver$ = this.accountAPIService.arrdelivery$
        //     .pipe(
        //         tap(res => console.log('resres', res)
        //         ),
        //         catchError(err => {
        //             this.errorMassgess = err;
        //             return EMPTY;
        //         })
        //     )
        // this.loading = false;

    }



    clickPayment(event, data) {
        data.setting_json.delivery_days = event;
        console.log(event);

    }

    onAdd(data): void {
        console.log(data);
        this.loading = true;
        data.setting_json.delivery_days = +data.setting_json.delivery_days;
        this.accountAPIService.addProduct(data)
        this.loading = false;
    }

    // getDelivery() {
    //   const value = "13356";
    //   this.accountAPIService.getDeliverInformation(value).subscribe(data => {
    //     this.dataDeliver = data.response_data;
    //     console.log(this.dataDeliver);
    //     this.arrDeliver.delivery_charge = this.dataDeliver[0].setting_json.delivery_charge;
    //     this.arrDeliver.minimum_free_delivery = this.dataDeliver[0].setting_json.minimum_free_delivery;
    //     this.arrDeliver.minimum_order_price = this.dataDeliver[0].setting_json.minimum_order_price;
    //     this.arrDeliver.delivery_days = this.dataDeliver[0].setting_json.delivery_days;
    //     this.arrDeliver.order_cutoff_time = this.dataDeliver[0].setting_json.order_cutoff_time;
    //     this.arrDeliver.delivery_radius = this.dataDeliver[0].setting_json.delivery_radius;
    //     console.log(this.arrDeliver.delivery_charge);
    //   })

    // }


    // btnSaveClick() {
    //   const dataJson = {
    //     "supplier_id": 13356,
    //     "setting_json": this.arrDeliver

    //   }
    //   console.log(dataJson);
    //   this.save(dataJson)
    // }

    // save(dataJson) {
    //   this.accountAPIService.addDeliverInformation(JSON.stringify(dataJson)).subscribe(data => {
    //     console.log(data);
    //   })

    // }



}

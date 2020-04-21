import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductAPIService, WarehouseAPIService } from '@project/services';
import { DialogsCancelComponent } from '../../../dialogs/dialogs-cancel/dialogs-cancel.component';
import { NbDialogService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AleartComponent } from '../../../dialogs/aleart/aleart.component';
import { tap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'project-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss']
})
export class TransferListComponent implements OnInit {
  arrData: any = {};
  arrDataTo: any = {};
  arrWarehouse: any = [];
  product_warehouse_array: any = [];
  warehouse_name: string;
  warehouse_id: string;
  onhand_manual: number;
  distributor_product_id: string;
  loading = false;
  loadingSave = false;
  Form: FormGroup;

  private UrlRouter_ProductsStock = "products/stock/list";

  id_local: string;

  constructor(
    private router: Router,
    private productAPIService: ProductAPIService,
    private warehouseAPIService: WarehouseAPIService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
    this.productAPIService.dataTransfer$.subscribe(res => {
      console.log(res)
      if (res) {
        this.arrData = res;
      } else {
        this.router.navigate([this.UrlRouter_ProductsStock]);
      }

    })
  }




  ngOnInit() {
    this.buildForms();
    const params = this.route.snapshot.paramMap;


    if (params.has("data")) {
      // this.arrData = JSON.parse(params.get('data'));
      this.arrDataTo = this.arrData;
      this.product_warehouse_array = this.arrData.product_warehouse_array.length > 0 ? this.arrData.product_warehouse_array : [];
      console.log(this.arrData);
      if (this.arrData) {
        this.getWarehouse();
      }

    }

    if (params.has("distributor_product_id")) {
      this.arrData = [];
      this.distributor_product_id = JSON.parse(params.get('distributor_product_id'));
      const value = "distributor_product_id=" + this.distributor_product_id;

      this.productAPIService.getTransferID(value).subscribe(res => {
        this.arrData = res.response_data[0];
        this.arrDataTo = this.arrData;
        this.product_warehouse_array = this.arrData.product_warehouse_array.length > 0 ? this.arrData.product_warehouse_array : [];
        console.log(this.arrData);
        if (this.arrData) {
          this.getWarehouse();
        }
      })

    }
  }

  getWarehouse() {
    const value = "distributor_id=" + this.id_local + "&warehouse_type_id=" + 2;
    this.warehouseAPIService.getWarehouseList(value).subscribe(data => {
      this.arrWarehouse = data.response_data;
      for (let index = 0; index < this.arrWarehouse.length; index++) {
        // tslint:disable-next-line: triple-equals
        if (this.product_warehouse_array.length > 0) {
          if (this.arrWarehouse[index].warehouse_id == this.product_warehouse_array[0].warehouse_id) {
            this.warehouse_name = this.arrWarehouse[index].warehouse_name
            console.log(this.warehouse_name);
          }
        } else {
          this.warehouse_name = "";
        }
      }
      this.detailForm();
      console.log(this.warehouse_name);
      this.arrWarehouse = this.arrWarehouse.filter((x) => x.warehouse_id !== this.product_warehouse_array[0].warehouse_id)
      console.log(this.arrWarehouse);
    })
  }

  buildForms() {
    this.Form = this.formBuilder.group({
      warehouse_id: ["", Validators.required],
      // available_From: [{ value: "", disabled: true }],
      // onhand_From: [{ value: "", disabled: true }],
      // outgoing_From: [{ value: "", disabled: true }],
      // incoming_From: [{ value: "", disabled: true }],
      available_From: ["", Validators.required],
      onhand_From: ["", Validators.required],
      outgoing_From: ["", Validators.required],
      incoming_From: ["", Validators.required],
      available_To: ["", Validators.required],
      onhand_To: ["", Validators.required],
      outgoing_To: ["", Validators.required],
      incoming_To: ["", Validators.required],

    });
  }


  detailForm() {

    this.Form.patchValue({
      available_From: this.product_warehouse_array[0].onhand === undefined ? 0 :
        (this.product_warehouse_array[0].onhand - this.product_warehouse_array[0].outgoing) <= 0 ? 0 : (this.product_warehouse_array[0].onhand - this.product_warehouse_array[0].outgoing),
      onhand_From: this.product_warehouse_array[0].onhand === undefined ? 0 : this.product_warehouse_array[0].onhand,
      outgoing_From: this.product_warehouse_array[0].outgoing === undefined ? 0 : this.product_warehouse_array[0].outgoing,
      incoming_From: this.product_warehouse_array[0].incoming === undefined ? 0 : this.product_warehouse_array[0].incoming,
      available_To: 0,
      onhand_To: 1,
      outgoing_To: 0,
      incoming_To: 0,

    });
    console.log(this.Form.value);

    this.loading = false;
  }

  onKeyQTY(searchValue): void {
    console.log("searchValue", searchValue);
    console.log("this.Form.value", this.Form.value);
    const onhand = this.product_warehouse_array[0].onhand === undefined ? 0 : this.product_warehouse_array[0].onhand;
    console.log("onhand", onhand);
    if (this.Form.value.onhand_To <= 0 || this.Form.value.onhand_To === "" || this.Form.value.onhand_To > onhand) {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: "Quantity"
        }
      });
      dialogRef.onClose.subscribe(result => {
        if (result === "ok") {
          this.Form.get("onhand_To").patchValue(1);
        }
      });
    }
  }


  btnSaveClick() {
    this.loadingSave = true;

    const checkin_data_to = {
      "incoming": this.Form.value.incoming_To,
      "outgoing": this.Form.value.outgoing_To,
      "onhand": this.Form.value.onhand_To,
      "change": this.arrDataTo.checkin_data.change,
      "available": this.Form.value.available_To,
      "onhand_manual": 0
    }
    const checkin_data_form = {
      "incoming": this.product_warehouse_array[0].incoming,
      "outgoing": this.product_warehouse_array[0].outgoing,
      "onhand": (this.product_warehouse_array[0].onhand - this.Form.value.onhand_To),
      "change": this.product_warehouse_array[0].change,
      "available": this.product_warehouse_array[0].available,
      "onhand_manual": 0
    }

    const dataJson = [{
      "distributor_product_id": this.arrData.distributor_product_id,
      "distributor_product_create_time": this.arrData.create_time,
      "warehouse_id_from": this.arrData.product_warehouse_array.length > 0 ? this.arrData.product_warehouse_array[0].warehouse_id : this.arrData.warehouse_id,
      "checkin_data_from": checkin_data_form,
      "warehouse_id_to": this.Form.value.warehouse_id,
      "checkin_data_to": checkin_data_to
    }]


    const product_json = {
      "product_json": dataJson
    }
    console.log('product_json', product_json);
    this.save(product_json);

  }

  save(dataJson) {
    console.log(JSON.stringify(dataJson));
    this.productAPIService.addTransfer(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
      this.loadingSave = false;
      this.router.navigate([this.UrlRouter_ProductsStock]);
    })
  }

  btnCancelClick() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'cancel') {
      }
      if (result === 'ok') {
        this.router.navigate([this.UrlRouter_ProductsStock]);
      }
    });
  }

  keyDown(e) {
    console.log(e);
    // tslint:disable-next-line: triple-equals
    if (e.key == "-") {
      return false;
    }

  }

}

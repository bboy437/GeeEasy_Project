import { Component, OnInit } from '@angular/core';
import { TeamAPIService, ProductAPIService, UploadAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AleartComponent } from '../../../dialogs/aleart/aleart.component';
import { DialogsCancelComponent } from '../../../dialogs/dialogs-cancel/dialogs-cancel.component';
import { DialogsTeamComponent } from '../../../dialogs/dialogs-team/dialogs-team.component';
import { log } from 'util';
import { DeleteComponent } from '../../../dialogs/delete/delete.component';

@Component({
  selector: 'project-add-product-team',
  templateUrl: './add-product-team.component.html',
  styleUrls: ['./add-product-team.component.scss']
})
export class AddProductTeamComponent implements OnInit {
  private UrlRouter_Detail = "team/myteam/detail";
  FromProduct: FormGroup;
  arrobjRow: any = [];
  filter: any = [];
  arrUser: any = [];
  arrProducts: any = [];
  products: any = [];
  RowID: string;
  group_name: string;
  RowStatus: string;
  loading = false;
  warehouse: any = [];
  checkedAll: boolean;

  id_local: string;

  image = {
    update: false,
    main_image: {
        get: [],
        port: []
    }
}

  constructor(
    private teamAPIService: TeamAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    private productAPIService: ProductAPIService,
    private uploadAPIService: UploadAPIService
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {
    this.buildFormProduct();
    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");
    this.group_name = params.get("group_name");
    this.RowStatus = params.get("status");
    console.log(this.RowID, this.group_name);
    this.getData();
    this.getProduct();
  }

  buildFormProduct() {
    this.FromProduct = this.formBuilder.group({
      product_id: [],
      product_title: [],
      product_sku: [],
      product_price: [],
    });
  }

  getData() {
    this.teamAPIService.getTeamDetail(this.RowID).subscribe(res => {
      this.arrobjRow = res.response_data[0];
      this.arrUser = res.response_data[0].group_user_array;
      this.products = res.response_data[0].group_product_array;
      this.loading = false;
      console.log('arrobjRow', this.arrobjRow);
    })
  }

  getProduct() {
    const value = "cur_page=" + 1 + "&per_page=" + 100 + "&dealer_id=" + this.id_local;
    this.productAPIService.getProductDealer(value).subscribe(data => {
      this.arrProducts = data.response_data;
      this.arrProducts.forEach(element => {
        element.product_name = element.product_title.concat(" (", element.product_sku, ")")

      });
      this.loading = false;
    })
  }

  //product warehouse
  productChange(event) {

    this.warehouse = [];
    if (event.length > 0) {
      const dataProduct = event[0].data;
      const dataWarehouse = event[0].data.product_row_display_array;
      let onhand = 0, available = 0, change = 0, outgoing = 0, incoming = 0;

      //Check Warehouse
      const data1 = dataWarehouse.filter((x) => x.warehouse_id === 0);
      const data2 = dataWarehouse.filter((x) => x.warehouse_id !== 0);
      const data3 = [];

      if (data1.length > 0) {
        for (let index = 0; index < data1.length; index++) {
          if (isNaN(data1[index].checkin_data.onhand)) {
            continue;
          }
          onhand += Number(data1[index].checkin_data.onhand);
          available += Number(data1[index].checkin_data.available);
          change += Number(data1[index].checkin_data.change)
          incoming += Number(data1[index].checkin_data.incoming);
          outgoing += Number(data1[index].checkin_data.outgoing);


        }
        console.log(onhand);

        //push ค่า ที่ซ้ำ warehouse = 0
        data3.push({
          purchase_data: data1[0].purchase_data,
          warehouse_id: data1[0].warehouse_id,
          warehouse_data: data1[0].warehouse_data,
          product_price: dataProduct.product_price,
          product_qty: 0,
          product_is_active: false,
          checkin_data: {
            available: available,
            onhand: onhand,
            qty: onhand,
            change: change,
            incoming: incoming,
            outgoing: outgoing,
          },
        })
      }

      //เพิ่มฟิล ค่า ที่ไม่ซ้ำ 
      data2.forEach(element => {
        element.product_price = dataProduct.product_price;
        element.product_qty = 0;
        element.product_is_active = false;
        element.checkin_data.qty = element.checkin_data.onhand
        element.checkin_data.onhand = element.checkin_data.onhand
      });

      console.log('data1', data1);
      console.log('data2', data2);
      console.log('data3', data3);

      //All Warehouse
      const warehouse = data3.concat(data2);

      //push Warehoush
      this.warehouse.push({
        dealer_id: dataProduct.dealer_id,
        distributor_id: dataProduct.distributor_id,
        product_id: dataProduct.product_id,
        product_sku: dataProduct.product_sku,
        product_title: dataProduct.product_title,
        product_price: dataProduct.product_price,
        product_image_url: dataProduct.product_image_url,
        warehouse: warehouse
      })
      console.log('warehouse', this.warehouse);

      if (
        this.warehouse[0].product_image_url !== undefined &&
        this.warehouse[0].product_image_url !== "-" &&
        this.warehouse[0].product_image_url !== ""
    )
        this.uploadAPIService
            .uploadImage()
            .getUrl(this.warehouse[0].product_image_url, red_image => {
                this.image.main_image.get.push(red_image);
            });

      this.FromProduct.get('product_title').patchValue(this.warehouse[0].product_title);
      this.FromProduct.get('product_sku').patchValue(this.warehouse[0].product_sku);
      this.FromProduct.get('product_price').patchValue(this.warehouse[0].product_price);
    }
  }

  //Checkbox Status true false
  allWarehouseActive(product, callbacl) {
    let status = true;
    product.forEach(item => {
      if (item.product_is_active === false)
        status = false;
    });
    callbacl(status);
  }

  //Checkbox by 1
  updateStatus(checked: boolean, data) {
    console.log('checked', checked, data);
    if (checked) {
      data.product_is_active = true;
      this.warehouse[0].warehouse.forEach(element => {
        if (element.warehouse_id !== data.warehouse_id)
          element.product_is_active = false;
      });
    } else {
      data.product_is_active = false;
      this.warehouse[0].warehouse.forEach(element => {
        if (element.warehouse_id !== data.warehouse_id)
          element.product_is_active = false;
      });
    }

    // data.product_is_active = (checked) ? true : false;
    // this.allWarehouseActive(this.warehouse[0].warehouse, res => {
    //   this.checkedAll = res;
    // });
    console.log('warehouse', this.warehouse);
  }

  //Checkbox All
  updateStatusAll(checked: boolean) {
    console.log('checked', checked);
    this.warehouse.forEach(element => {
      element.warehouse.forEach(element1 => {
        element1.product_is_active = (checked) ? true : false;
      });
    });
    console.log('warehouse', this.warehouse);
  }

  onKeyQuantity(searchValue, data: any): void {
    console.log(data);
    // const resultArray = data.product_qty.split(',')
    // let number = 0;
    // if (resultArray.length === 1) {
    //   number = resultArray[0];
    // }
    // if (resultArray.length === 2) {
    //   number = resultArray[0] + resultArray[1];
    // }
    // if (resultArray.length === 3) {
    //   number = resultArray[0] + resultArray[1] + resultArray[2];
    // }
    // console.log(data.product_qty, number);

    if (data.product_qty < 0 || data.product_qty > data.checkin_data.onhand || data.product_qty === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.product_qty = 0;
          data.checkin_data.onhand = (data.checkin_data.qty - Number(data.product_qty));
        }
      });
    } else {
      data.checkin_data.onhand = (data.checkin_data.qty - Number(data.product_qty));
    }
  }

  transferChange(data: any) {
    console.log(data);

    const dialogRef = this.dialogService.open(DialogsTeamComponent, {
      context: {
        status: 'confirmProductTeam',
      }
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'cancel') {
      }
      if (result === 'ok') {
        const checkin_data = {
          available: data.checkin_data.available,
          onhand: Number(data.product_qty),
          change: data.checkin_data.change,
          incoming: data.checkin_data.incoming,
          outgoing: data.checkin_data.outgoing,
        }
        const products = []
        products.push({
          product_id: this.warehouse[0].product_id,
          product_title: this.warehouse[0].product_title,
          product_sku: this.warehouse[0].product_sku,
          product_price: this.warehouse[0].product_price,
          product_image_url: this.warehouse[0].product_image_url,
          checkin_data: checkin_data,
          create_time: new Date().getTime() / 1000,
          warehouse_id: data.warehouse_id
        })
        this.checkTransfer(data, products);
        this.saveTransfer(data, products);
      }
    });
  }

  //Check transfer ซ้ำกับสินค้าที่มีอยู่หรือไม่
  checkTransfer(data, transfer: any) {
    // tslint:disable-next-line: prefer-const
    // let result = [];
    // for (let index = 0; index < this.products.length; index++) {
    //   if (this.products[index].product_id === transfer[0].product_id) {
    //     result.push(this.products[index])
    //   }
    // }

    // if (result.length > 0) {
    //   if (result[0].product_id === transfer[0].product_id) {
    //     const onhand = (result[0].checkin_data.onhand + transfer[0].checkin_data.onhand);
    //     result[0].checkin_data.onhand = onhand;
    //   }
    // } else {
    //   this.products.push({
    //     product_id: transfer[0].product_id,
    //     product_title: transfer[0].product_title,
    //     product_sku: transfer[0].product_sku,
    //     product_price: this.warehouse[0].product_price,
    //     product_image_url: transfer[0].product_image_url,
    //     checkin_data: transfer[0].checkin_data
    //   })
    // }

    this.products.push({
      product_id: transfer[0].product_id,
      product_title: transfer[0].product_title,
      product_sku: transfer[0].product_sku,
      product_price: this.warehouse[0].product_price,
      product_image_url: transfer[0].product_image_url,
      create_time: new Date().getTime() / 1000,
      checkin_data: transfer[0].checkin_data
    })

    this.save();
    console.log('products', this.products);

    // this.btnClearClick();

  }

  saveTransfer(data, transfer: any) {

    const dataJson = {
      group_id: this.RowID,
      group_name: this.group_name,
      dealer_id: this.id_local,
      group_product_array: transfer,
    }
    console.log('saveTransfer', dataJson);
    this.teamAPIService.tranferProduct(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
    })

    data.product_is_active = false;
    data.product_qty = 0;

  }

  btnDeleteProduct(i) {
    const dialogRef = this.dialogService.open(DeleteComponent, {
      context: {
        icon: 'people-outline',
        title: 'Confirm Delete ?',
      }
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'ok') {
        this.products.splice(i, 1);
        this.save();
      }
    });
  }

  btnClearClick() {
    this.warehouse = [];
    this.FromProduct.get('product_id').patchValue("");
  }

  btnSaveClick() {
    this.save();
  }

  save() {

    const dataJson = {
      group_id: this.RowID,
      group_name: this.group_name,
      dealer_id: this.id_local,
      group_product_array: this.products,

    }
    console.log('save', dataJson);
    this.teamAPIService.updateTeam(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
    })
  }

  btnCancelClick() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'cancel') {
      }
      if (result === 'ok') {
        this.router.navigate([this.UrlRouter_Detail, this.RowID, this.RowStatus]);
      }
    });
  }

  btnBackClick() {
    this.router.navigate([this.UrlRouter_Detail, this.RowID, this.RowStatus]);
  }

}

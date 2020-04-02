import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerService, TeamAPIService, ProductAPIService } from '@project/services';
import { AleartComponent } from '../aleart/aleart.component';
import { ColumnMode } from '@swimlane/ngx-datatable';


@Component({
  selector: 'project-dialogs-team',
  templateUrl: './dialogs-team.component.html',
  styleUrls: ['./dialogs-team.component.scss']
})
export class DialogsTeamComponent implements OnInit {
  @Input() id: string;
  @Input() data: any;
  @Input() dataUser: any;
  @Input() status: string;
  From: FormGroup;
  FromProduct: FormGroup;
  submitted = false;
  arrobjRow: any = {};
  arrobjSeller: any = [];
  filter: any = [];
  arrUser: any = [];
  arrProducts: any = [];
  products: any = [];
  arrWholesale = [];
  checkin_data: any = {};
  loading = false;
  sum = 0;
  checkedAll: boolean;

  ColumnMode = ColumnMode;
  messages = {
    emptyMessage: `
        <div class="imglist">
            <img src="assets/images/loading.png" width="300" >
        </div>
        <div class="labelList">
            <label >No data. Please select information in the list</label>
        </div>
    `
  };
  id_local: string;


  constructor(
    protected ref: NbDialogRef<DialogsTeamComponent>,
    private formBuilder: FormBuilder,
    private teamAPIService: TeamAPIService,
    private sellerService: SellerService,
    private productAPIService: ProductAPIService,
    private dialogService: NbDialogService,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  private data_api = {
    search: "",
    data_send: {
      dealer_id: this.id_local,
      cur_page: 1,
      per_page: 100
    }
  };

  ngOnInit() {

    if (this.status === 'addSeallertoTeam') {
      this.buildForm();
      this.getData()
    }

    if (this.status === 'addProducttoSeller') {
      this.buildFormProduct();
      this.getDataSeller();
      this.getData();
    }

    if (this.status === 'confirmProductTeam') {
    }


  }


  getDataSeller() {
    this.sellerService.getSellerProduct(this.dataUser.user_id).subscribe(res => {
      console.log('getDataSeller', res);
      this.products = res.response_data;
      if (this.products.length > 0) {
        this.products.forEach(element => {
          element.product_qty = element.checkin_data.onhand;
          element.product_price = element.product_wholesale_array[0].product_price;
        });
      }

      console.log('products', this.products);
      this.loading = false;
    })
  }

  getData() {
    this.teamAPIService.getTeamDetail(this.id).subscribe(res => {
      this.arrobjRow = res.response_data[0];

      if (this.status === 'addSeallertoTeam') {
        this.arrUser = res.response_data[0].group_user_array;
        this.getSeller();

      } else {
        this.arrProducts = res.response_data[0].group_product_array;
        this.arrProducts.forEach(element => {
          element.product_name = element.product_title.concat(" (", element.product_sku, ")")
        });
        this.loading = false;
      }
      console.log('arrProducts', this.arrProducts);
      console.log('arrobjRow', this.arrobjRow);

    })
  }

  getSeller() {
    this.sellerService.getSellerLists(this.data_api.data_send).subscribe(res => {
      const seller = res.response_data;
      this.arrobjSeller = seller.filter(x => x.group_id === 0 || x.group_id === this.arrobjRow.group_id);
      this.filter = this.arrobjSeller;
      console.log('seller', seller);
      console.log('arrobjSeller', this.arrobjSeller);
      console.log('filter', this.filter);

      //For Check true 
      this.arrobjSeller.forEach(x => {
        this.arrUser.forEach(y => {
          if (x.user_id === y.user_id) {
            x.user_is_active = true;
          }
        })
      })

      //Checkbox All 
      this.allIsActive(this.arrobjSeller, res => {
        this.checkedAll = res;
      });

      this.loading = false;
    })
  }

  // getProduct() {
  //   const value = "cur_page=" + 1 + "&per_page=" + 10 + "&dealer_id=" + this.id_local;
  //   this.productAPIService.getProductDealer(value).subscribe(data => {
  //     this.arrProducts = data.response_data;
  //     this.arrProducts.forEach(element => {
  //       element.product_name = element.product_title.concat(" (", element.product_sku, ")")

  //     });
  //     this.loading = false;
  //   })
  // }

  buildForm() {
    this.From = this.formBuilder.group({
      seller_id: []
    });
  }

  buildFormProduct() {
    this.FromProduct = this.formBuilder.group({
      seller_id: []
    });
  }

  get f() { return this.From.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.From.invalid) {
      return;
    }
  }

  //Checkbox All Return
  allIsActive(data, callbacl) {
    let status = true;
    data.forEach(item => {
      if (!item.user_is_active)
        status = false;
    });
    callbacl(status);
  }


  //Checkbox by 1
  updateStatus(checked: boolean, data) {
    console.log('checked', checked, data);
    if (checked) {
      data.user_is_active = true;
      this.arrUser.push({
        user_image_url: data.user_image_url,
        user_id: data.user_id,
        user_name: data.user_name,
        user_mobile: data.user_mobile,
        user_email: data.user_email,
        group_id: this.arrobjRow.group_id,
        group_parent_id: this.arrobjRow.group_parent_id,
      })
    } else {
      data.user_is_active = false;
      this.arrUser.forEach((item, index) => {
        if (item.user_id === data.user_id) {
          this.arrUser.splice(index, 1);
        }
      });
    }

    this.allIsActive(this.filter, res => {
      this.checkedAll = res;
    });

    console.log('arrUser', this.arrUser);

  }

  //Checkbox by All
  updateStatusAll(checked: boolean) {
    console.log('checked', checked);
    if (checked) {
      this.arrobjSeller.forEach(element => {
        element.user_is_active = true;
        this.arrUser.push({
          user_image_url: element.user_image_url,
          user_id: element.user_id,
          user_name: element.user_name,
          user_mobile: element.user_mobile,
          user_email: element.user_email,
          group_id: this.arrobjRow.group_id,
          group_parent_id: this.arrobjRow.group_parent_id,
        })
        const array = this.arrUser;
        const arrayNew = new Map(array.map(obj => [obj.user_id, obj]));
        const arrayNews = Array.from(arrayNew.values());
        this.arrUser = arrayNews;
      });
    } else {
      this.arrobjSeller.forEach(element => {
        element.user_is_active = false;
      });
      this.arrUser = [];
    }
    console.log('arrUser', this.arrUser);

    this.allIsActive(this.filter, res => {
      this.checkedAll = res;
    });

  }

  sellerChange(event) {
    console.log('event', event);
    if (event.length > 0) {
      this.arrUser.push({
        user_image_url: event[0].data.user_image_url,
        user_id: event[0].data.user_id,
        user_name: event[0].data.user_name,
        user_mobile: event[0].data.user_mobile,
        user_email: event[0].data.user_email,
      })
      const array = this.arrUser;
      const arrayNew = new Map(array.map(obj => [obj.user_id, obj]));
      const arrayNews = Array.from(arrayNew.values());
      this.arrUser = arrayNews;
      console.log('this.arrUser', this.arrUser);


    }
  }

  // productChange(event) {
  //   this.checkin_data = [];
  //   this.arrWholesale = [];

  //   if (event.length > 0) {
  //     const dataProduct = event[0].data;
  //     let onhand = 0, available = 0, change = 0, outgoing = 0, incoming = 0;
  //     for (let i = 0; i < dataProduct.product_row_display_array.length; i++) {
  //       if (isNaN(dataProduct.product_row_display_array[i].checkin_data.onhand)) {
  //         continue;
  //       }
  //       onhand += Number(dataProduct.product_row_display_array[i].checkin_data.onhand);
  //       available += Number(dataProduct.product_row_display_array[i].checkin_data.available);
  //       change += Number(dataProduct.product_row_display_array[i].checkin_data.change)
  //       incoming += Number(dataProduct.product_row_display_array[i].checkin_data.incoming);
  //       outgoing += Number(dataProduct.product_row_display_array[i].checkin_data.outgoing);

  //     }
  //     this.checkin_data = {
  //       available: available,
  //       onhand: 1,
  //       change: change,
  //       incoming: incoming,
  //       outgoing: outgoing,
  //     }
  //     console.log('checkin_data', this.checkin_data);
  //     console.log('dataProduct', dataProduct);
  //     this.products.push({
  //       product_id: dataProduct.product_id,
  //       product_title: dataProduct.product_title,
  //       product_sku: dataProduct.product_sku,
  //       product_price: dataProduct.product_price,
  //       product_totalplice: dataProduct.product_price,
  //       product_qty: 1,
  //       product_image_url: dataProduct.product_image_url,
  //       onhand: onhand,
  //       checkin_data: this.checkin_data
  //     })

  //     const array = this.products;
  //     const arrayNew = new Map(array.map(obj => [obj.product_id, obj]));
  //     const arrayNews = Array.from(arrayNew.values());
  //     this.products = arrayNews;

  //     this.sumTotal();
  //     console.log('this.products', this.products);


  //   }
  // }


  onKeyQTY(searchValue, data: any): void {
    console.log(data);
    if (data.product_qty <= 0 || data.product_qty > data.onhand || data.product_qty === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.product_qty = 1;
          data.checkin_data.onhand = data.product_qty;
          this.sumTotal();
        }
      });

    } else {
      data.checkin_data.onhand = data.product_qty;
      this.sumTotal();
    }
  }

  sumTotal() {
    this.sum = 0;
    this.products.forEach(x => this.sum += x.product_totalplice);
    console.log(' this.products,', this.products);

  }

  btnDeleteSeller(i) {
    this.arrUser.splice(i, 1);

  }

  btnDeleteProduct(i) {
    this.products.splice(i, 1);

  }


  productSellerChange(event) {
    this.checkin_data = [];
    this.arrWholesale = [];

    if (event.length > 0) {
      const dataProduct = event[0].data;
      // let onhand = 0, available = 0, change = 0, outgoing = 0, incoming = 0;
      // for (let i = 0; i < dataProduct.product_row_display_array.length; i++) {
      //   if (isNaN(dataProduct.product_row_display_array[i].checkin_data.onhand)) {
      //     continue;
      //   }
      //   onhand += Number(dataProduct.product_row_display_array[i].checkin_data.onhand);
      //   available += Number(dataProduct.product_row_display_array[i].checkin_data.available);
      //   change += Number(dataProduct.product_row_display_array[i].checkin_data.change)
      //   incoming += Number(dataProduct.product_row_display_array[i].checkin_data.incoming);
      //   outgoing += Number(dataProduct.product_row_display_array[i].checkin_data.outgoing);

      // }
      // this.checkin_data = {
      //   available: available,
      //   onhand: 1,
      //   change: change,
      //   incoming: incoming,
      //   outgoing: outgoing,
      // }

      this.arrWholesale.push({
        qty_minimum: 1,
        product_price: dataProduct.product_price,
        discount_thb: 0,
        discount_percent: 0,
        thb: true,
        percent: false,
      });

      const product_data_ref = {
        ref_1: '0',
        ref_2: '0',
        ref_3: '0',
      }

      console.log('checkin_data', this.checkin_data);
      console.log('dataProduct', dataProduct);
      this.products.push({
        product_id: dataProduct.product_id,
        product_title: dataProduct.product_title,
        product_sku: dataProduct.product_sku,
        product_price: dataProduct.product_price,
        product_qty: 1,
        product_image_url: dataProduct.product_image_url,
        onhand: dataProduct.checkin_data.onhand,
        checkin_data: dataProduct.checkin_data,
        product_wholesale_array: this.arrWholesale,
        product_data_ref: product_data_ref
      })

      // const array = this.products;
      // const arrayNew = new Map(array.map(obj => [obj.product_id, obj]));
      // const arrayNews = Array.from(arrayNew.values());
      // this.products = arrayNews;


      this.sumTotal();
      console.log('this.products', this.products);

    }
  }



  addWholesale(product) {

    const data: any = {};
    data.qty_minimum = 1;
    data.product_price = product.product_price;
    data.discount_thb = 0;
    data.discount_percent = 0;
    data.thb = true;
    data.percent = false;

    product.product_wholesale_array.push(data);
    console.log(product);
  }


  toggle(checked: boolean, data: any, status) {
    console.log(checked, data, status);
    if (status === 'THB') {
      data.percent = false;
      data.discount_thb = data.discount_percent;
      if (data.discount_thb !== 0) {
        data.discount_percent = 0;
      }
    } else {
      data.thb = false;
      data.discount_percent = data.discount_thb;
      if (data.discount_percent !== 0) {
        data.discount_thb = 0;
      }
    }
  }


  onKeyMinimum(searchValue, data: any): void {
    console.log(data);
    if (data.qty_minimum <= 0 || data.qty_minimum === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.qty_minimum = 1;
        }
      });

    }
  }

  onKeyDiscountTHB(searchValue, data: any): void {
    console.log(data);
    data.discount_percent = 0;
    if (data.discount_thb < 0 || data.discount_thb === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.discount_thb = 1;
        }
      });

    }
  }

  onKeyDiscountPercent(searchValue, data: any): void {
    console.log(data);
    data.discount_thb = 0;
    if (data.discount_percent < 0 || data.discount_percent === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          data.discount_percent = 1;
        }
      });

    }
  }

  deleteWholesale(data, i) {
    data.splice(i, 1);
    console.log(data);


  }


  btnAddSealerClick() {

    this.submitted = true;
    if (this.From.invalid) {
      return;
    }
    this.addSeller();

  }

  addSeller() {
    const dataJson = {
      group_id: this.id,
      group_name: this.data.group_name,
      dealer_id: this.id_local,
      group_user_array: this.arrUser,

    }
    console.log(dataJson);
    console.log(JSON.stringify(dataJson));
    this.teamAPIService.updateTeam(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
      this.ref.close('ok');
    })

  }

  addProduct() {
    for (let i = 0; i < this.products.length; i++) {
      delete this.products[i].product_totalplice;
      delete this.products[i].product_qty;
      delete this.products[i].onhand;
    }
    const dataJson = {
      group_id: this.id,
      group_name: this.data.group_name,
      dealer_id: this.id_local,
      group_product_array: this.products,

    }

    console.log(dataJson);

    this.teamAPIService.updateTeam(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
      this.ref.close('ok');
    })
  }

  addProductSeller() {
    for (let i = 0; i < this.products.length; i++) {
      for (let iw = 0; iw < this.products[i].product_wholesale_array.length; iw++) {
        delete this.products[i].product_totalplice;
        delete this.products[i].product_qty;
        delete this.products[i].onhand;
        this.products[i].product_wholesale_array[iw].product_price = Number(this.products[i].product_wholesale_array[iw].product_price);
      }
      // delete this.products[i].product_totalplice;
      // delete this.products[i].product_qty;
      // delete this.products[i].onhand;

    }
    const dataJson = {
      group_id: this.id,
      user_id: this.dataUser.user_id,
      dealer_id: this.id_local,
      product_json: this.products,

    }

    console.log(dataJson);

    this.sellerService.postProductCreate(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
      this.ref.close('ok');
    })

  }

  filterName(value: any) {

    this.arrobjSeller = this.filter.filter(option =>
      option.user_name.toLowerCase().indexOf(value.toLowerCase()) > -1);
      console.log('this.arrobjSeller',this.arrobjSeller);
      console.log('this.filter',this.filter);

    this.allIsActive(this.arrobjSeller, res => {
      this.checkedAll = res;
      console.log('checkedAll',this.checkedAll);
    });


    // return this.arrobjSeller.filter(option =>
    //   option.user_name.toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10);

  }

  btnRefresh() {
    this.filterName('');
    this.From.get('seller_id').patchValue('');
  }

  btnCancelClick() {
    this.ref.close('cancel');
  }

  btnOkClick() {
    this.ref.close('ok');
  }

}

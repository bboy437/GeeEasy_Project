import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductAPIService, UploadAPIService, BrowseSupplierAPIService } from '@project/services';
import { DialogsCancelComponent } from '../../../dialogs/dialogs-cancel/dialogs-cancel.component';
import { NbDialogService } from '@nebular/theme';
import { WarehouseAPIService } from '@project/services';
import { INgxSelectOption } from 'ngx-select-ex';

@Component({
  selector: 'project-products-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductsCreateComponent implements OnInit {
  private URLRputer_ProductList = "products/manager-products/order"
  private URLRputer_ProductDetail = "products/products/detail"
  arrobjRow: any = [];
  arrobjCategory: any = [];
  Form: FormGroup;
  submitted = false;
  imagePath: any = [];
  uploadData: any = [];
  imgURL: any;
  public message = "No File chosen";
  arrWholesale: any = [];
  RowID: string;
  files: any = [];
  strCateName: string;
  strUpdateName: string;
  arrWarehouse: any = [];
  active = 0;

  id_local: string;

  image = {
    update: false,
    main_image: {
      get: [],
      port: []
    }
  }

  constructor(
    private warehouseAPIService: WarehouseAPIService,
    private formBuilder: FormBuilder,
    private router: Router,
    private productAPIService: ProductAPIService,
    private route: ActivatedRoute,
    private uploadAPIService: UploadAPIService,
    private browseSupplierAPIService: BrowseSupplierAPIService,
    private dialogService: NbDialogService,

  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
  }



  ngOnInit() {
    this.buildForm();
    const params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      this.RowID = params.get("id");
      if (this.RowID === "new") {
        this.getWarehouse();
      } else {

        this.productAPIService.productDetailDealer$.subscribe(res => {
          res ? this.getData(res) : this.router.navigate([this.URLRputer_ProductList]);

        })
      }
    }

  }

  getData(data) {
    this.arrobjRow = data.response_data[0];
    this.imgURL = this.arrobjRow.product_image_url;

    if (this.arrobjRow.product_image_url !== undefined && this.arrobjRow.product_image_url !== "-" && this.arrobjRow.product_image_url !== "")
      this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.product_image_url, red_image => {
        this.image.main_image.get.push(red_image);
      });


    this.arrWholesale = this.arrobjRow.product_wholesale_array;
    console.log(this.arrobjRow);
    this.getWarehouse();
  }

  buildForm() {
    this.Form = this.formBuilder.group({
      WarehouseName: ['', Validators.required],
      catalogKeyword: ['', Validators.required],
      Quantity: ['', Validators.required],
      productName: ['', Validators.required],
      productPrice: ['', Validators.required],
      productSKU: ['', Validators.required],
      productUnit: ['', Validators.required],
      productNote: ['', Validators.required],
    })
  }

  editForm() {
    console.log("editForm : arrobjRow : ", this.arrobjRow);
    this.strUpdateName = this.arrobjRow.product_title;
    try {
      this.active = this.arrobjRow.product_is_active;
      this.Form.patchValue({
        WarehouseName: this.arrobjRow.warehouse_id,
        catalogKeyword: this.arrobjRow.product_catalog_keyword,
        Quantity: this.arrobjRow.checkin_data.onhand,
        productName: this.arrobjRow.product_title,
        productPrice: this.arrobjRow.product_price,
        productSKU: this.arrobjRow.product_sku,
        productUnit: this.arrobjRow.product_unit,
        productNote: this.arrobjRow.note,
      });
    } catch (e) { }
  }

  getWarehouse() {
    this.warehouseAPIService.warehouseDealerList$.subscribe(data => {
      this.arrWarehouse = data;
      this.editForm();
    })
  }

  addWholesale() {
    const data: any = {};
    if (this.arrWholesale.length > 0) {
      data.qty_minimum = 1;
      data.product_price = this.Form.value.productPrice;
      this.arrWholesale.push(data);
    } else {
      data.qty_minimum = 1;
      data.product_price = this.Form.value.productPrice;
      this.arrWholesale.push(data);
    }
  }

  deleteWholesale(i) {
    this.arrWholesale.splice(i, 1);

  }

  get f() { return this.Form.controls; }
  btnSaveClick() {
    this.submitted = true;
    if (this.Form.invalid || this.image.update) {
      return;
    }

    this.image.update = true;
    const dataSend = {
      type_id: 620,
      file_name: "",
      file_type: "",
      dealer_id: this.id_local
    };
    this.uploadAPIService.uploadImage().getImageArray(dataSend, this.image.main_image.get, red_image_array => {
      console.log('btnSaveClick : red_image_array : ', red_image_array);
      this.image.main_image.port = red_image_array;
      this.save();
    });

  }

  save() {

    if (this.RowID === "new") {
      const dataJson = {
        product_image_url: (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
        product_title: this.Form.value.productName,
        product_catalog_keyword: this.Form.value.catalogKeyword,
        product_price: Number(this.Form.value.productPrice),
        product_sku: this.Form.value.productSKU,
        product_unit: this.Form.value.productUnit,
        dealer_id: this.id_local,
        warehouse_id: this.Form.value.WarehouseName,
        product_note: this.Form.value.productNote,
        onhand: this.Form.value.Quantity,
        product_is_active: this.active
      }
      console.log("seve : dataJson : in : ", dataJson);
      this.productAPIService.addProductsDealer(JSON.stringify(dataJson)).subscribe(data => {
        this.Form.reset();
        this.router.navigate([this.URLRputer_ProductList])
      })
    } else {
      const dataJson = {
        dealer_product_id: this.arrobjRow.dealer_product_id,
        product_image_url: (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
        product_title: this.Form.value.productName,
        product_catalog_keyword: this.Form.value.catalogKeyword,
        product_price: Number(this.Form.value.productPrice),
        product_sku: this.Form.value.productSKU,
        product_unit: this.Form.value.productUnit,
        warehouse_id: this.Form.value.WarehouseName,
        product_note: this.Form.value.productNote,
        onhand: this.Form.value.Quantity,
        product_is_active: this.active
      }
      console.log(dataJson);
      this.productAPIService.updateProductsDealer(JSON.stringify(dataJson)).subscribe(data => {
        this.Form.reset();
        this.router.navigate([this.URLRputer_ProductList])
      })


      // this.productAPIService.updateProducts(JSON.stringify(dataJson)).subscribe(data => {
      //   console.log(data);
      //   this.router.navigate([this.URLRputer_ProductList])
      // })
    }




  }

  btnCancelClick() {
    this.router.navigate([this.URLRputer_ProductList])
  }

  toggle(_event_) {
    console.log("toggle : _event_ : ", _event_);
    if (_event_) {
      this.active = 1;
    } else {
      this.active = 0;
    }
  }

  btnBackClick() {
    this.router.navigate([this.URLRputer_ProductDetail, this.RowID])
  }

}

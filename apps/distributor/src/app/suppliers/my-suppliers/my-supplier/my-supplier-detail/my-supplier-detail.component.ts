import { Component, OnInit } from '@angular/core';
import { SupplierAPIService, ProductAPIService, UploadAPIService, BrowseSupplierAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogsImageComponent } from '../../../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'project-my-supplier-detail',
  templateUrl: './my-supplier-detail.component.html',
  styleUrls: ['./my-supplier-detail.component.scss']
})
export class MysupplierDetailComponent implements OnInit {

  private UrlRouter_Supplier = "suppliers/my-suppliers/list";
  private UrlRouter_SupplierDetail = "suppliers/save";
  arrSupplier: any = [];
  arrSupplierProduct: any = [];
  RowID: string;

  isAdd = true;
  isSave = false;
  isCancel = false;
  isProduct = false;
  arrProducts: any = [];
  arrWholesale: any = [];
  arrWholesaleDetail: any = [];
  arrCategory: any = [];
  productsForm: FormGroup;
  submitted = false;
  loading = false;
  imagePath: any = [];
  uploadData: any = [];
  imgURL: any;
  public message = "No File chosen";
  Form: FormGroup;

  image = {
    update: false,
    main_image: {
      get: [],
      port: []
    }
  }


  constructor(
    private router: Router,
    private supplierAPIService: SupplierAPIService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private productAPIService: ProductAPIService,
    private formBuilder: FormBuilder,
    private uploadAPIService: UploadAPIService,
    private browseSupplierAPIService: BrowseSupplierAPIService,
  ) {
    this.loading = true;
  }

  ngOnInit() {
    this.buildForms();

    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");
    if (this.RowID) {
      this.getData();
    }
  }

  getData() {
    this.supplierAPIService.getSupID(this.RowID).subscribe(data => {
      this.supplierAPIService.dataSupplierDetail(data);
      this.arrSupplier = data.response_data[0];
      console.log(this.arrSupplier);
      this.dataProduct(this.arrSupplier.supplier_product_array);
      this.getCategory(this.arrSupplier.product_category_id);
      this.detailForm();


      if (
        this.arrSupplier.supplier_image_url !== undefined &&
        this.arrSupplier.supplier_image_url !== "-" &&
        this.arrSupplier.supplier_image_url !== ""
      )
        this.uploadAPIService
          .uploadImage()
          .getUrl(this.arrSupplier.supplier_image_url, red_image => {
            this.image.main_image.get.push(red_image);
          });

    })
  }

  getCategory(id) {

    this.browseSupplierAPIService.getCategoryDetail(id).subscribe(data => {
      this.arrCategory = data.response_data;
      console.log('Category : Detail', this.arrCategory);
      this.buildForm();
    })
  }

  buildForm() {
    this.productsForm = this.formBuilder.group({
      product_category: ['', Validators.required],
      product_name: ['', Validators.required],
      product_price: ['', Validators.required],
      product_sku: ['', Validators.required],
      product_unit: ['', Validators.required],
    });
  }

  buildForms() {
    this.Form = this.formBuilder.group({
      suppliername: [{ value: '', disabled: true }, Validators.required],
      productcategory: [{ value: '', disabled: true }, Validators.required],
      catalogkeyword: [{ value: '', disabled: true }, Validators.required],
      category_custom_keyword: [{ value: '', disabled: true }, Validators.required],
      supplierkeyword: [{ value: '', disabled: true }, Validators.required],
      firstName: [{ value: '', disabled: true }, Validators.required],
      lastName: [{ value: '', disabled: true }, Validators.required],
      companyName: [{ value: '', disabled: true }, Validators.required],
      emailAddress: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneNo: [{ value: '', disabled: true }, Validators.required],
      mobileNo: [{ value: '', disabled: true }, Validators.required],
      AddressFull: [{ value: '', disabled: true }, Validators.required],
      AddressNo: [{ value: '', disabled: true }, Validators.required],
      province: [{ value: '', disabled: true }, Validators.required],
      amphoe: [{ value: '', disabled: true }, Validators.required],
      tambon: [{ value: '', disabled: true }, Validators.required],
      zipcode: [{ value: '', disabled: true }, Validators.required],
      latlong: [{ value: '', disabled: true }, Validators.required],
    });
  }

  detailForm() {
    this.Form.patchValue({
      suppliername: this.arrSupplier.supplier_name,
      productcategory: this.arrSupplier.product_category_array[0].product_category_name,
      catalogkeyword: this.arrSupplier.supplier_catalog_keyword,
      category_custom_keyword: this.arrSupplier.category_custom_keyword,
      supplierkeyword: this.arrSupplier.supplier_keyword,
      firstName: this.arrSupplier.supplier_name_first,
      lastName: this.arrSupplier.supplier_name_last,
      companyName: this.arrSupplier.supplier_company_name,
      emailAddress: this.arrSupplier.supplier_company_contact,
      phoneNo: this.arrSupplier.supplier_addr_phone,
      mobileNo: this.arrSupplier.supplier_addr_phone,
      AddressFull: this.arrSupplier.supplier_addr_full,
      AddressNo: this.arrSupplier.supplier_addr_number,
      province: this.arrSupplier.supplier_addr_province,
      amphoe: this.arrSupplier.supplier_addr_amphoe,
      tambon: this.arrSupplier.supplier_addr_tambon,
      zipcode: this.arrSupplier.supplier_addr_postcode,
      latlong: this.arrSupplier.supplier_addr_location_lat  + ',' + this.arrSupplier.supplier_addr_location_lng,
    });
    this.loading = false;
  }


  get f() { return this.productsForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.productsForm.invalid) {
      return;
    }
  }

  dataProduct(data) {
    this.arrSupplierProduct = data;
    console.log(this.arrSupplierProduct);

  }

  btnEditClick() {
    this.router.navigate([this.UrlRouter_SupplierDetail, this.arrSupplier.supplier_id]);
  }

  btnCancelClick() {
    this.router.navigate([this.UrlRouter_Supplier]);
  }

  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img,
      },
    });
  }

  addProducts() {
    this.isAdd = false;
    this.isProduct = true;

  }


  okClick(event) {
    this.getData();
    this.isAdd = true;
    this.isProduct = false;
  }


}

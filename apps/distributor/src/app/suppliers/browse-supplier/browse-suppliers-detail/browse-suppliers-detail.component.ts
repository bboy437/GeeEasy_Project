import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SupplierAPIService, UploadAPIService } from '@project/services';
import { DialogsImageComponent } from '../../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'project-browse-suppliers-detail',
  templateUrl: './browse-suppliers-detail.component.html',
  styleUrls: ['./browse-suppliers-detail.component.scss']
})
export class BrowseSuppliersDetailComponent implements OnInit {

  private UrlRouter_Supplier = "suppliers/browse-suppliers";
  arrSupplier: any = [];
  arrSupplierProduct: any = [];
  RowID: string;
  RowStatus: string;
  filterByProduct: string;
  filterByName: string;
  filterByCategory: string;
  filterByMap: string;
  product_category_name: string;
  loading = false;
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
    private formBuilder: FormBuilder,
    private uploadAPIService: UploadAPIService,

  ) {
    this.loading = true;
  }

  ngOnInit() {

    this.buildForm();
    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");
    this.RowStatus = params.get("status");
    if (this.RowStatus === "product") {
      this.filterByProduct = this.route.snapshot.queryParamMap.get('filterBy')
      this.supplierAPIService.getSupID(this.RowID).subscribe(data => {
        this.arrSupplier = data.response_data[0];
        console.log(this.arrSupplier);
        this.dataProduct(this.arrSupplier.supplier_product_array);
        this.detailForm();
      })
    }
    if (this.RowStatus === "name") {
      this.filterByName = this.route.snapshot.queryParamMap.get('filterBy')
      this.supplierAPIService.getSupID(this.RowID).subscribe(data => {
        this.arrSupplier = data.response_data[0];
        this.dataProduct(this.arrSupplier.supplier_product_array);
        this.detailForm();

      })
    }

    if (this.RowStatus === "category") {
      this.filterByCategory = this.route.snapshot.queryParamMap.get('filterBy')
      console.log(this.RowID);
      this.supplierAPIService.getSupID(this.RowID).subscribe(data => {
        console.log(data);
        this.arrSupplier = data.response_data[0];
        this.dataProduct(this.arrSupplier.supplier_product_array);
        this.detailForm();
      })
    }
    if (this.RowStatus === "map") {
      this.filterByMap = this.route.snapshot.queryParamMap.get('filterBy')
      console.log(this.RowID);
      this.supplierAPIService.getSupID(this.RowID).subscribe(data => {
        console.log(data);
        this.arrSupplier = data.response_data[0];
        this.dataProduct(this.arrSupplier.supplier_product_array);
        this.detailForm();
      })
    }

  }

  dataProduct(data) {
    this.arrSupplierProduct = data;
    console.log(this.arrSupplierProduct);

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
  }

  buildForm() {
    this.Form = this.formBuilder.group({
      suppliername: [{ value: '', disabled: true }, Validators.required],
      productcategory: [{ value: '', disabled: true }, Validators.required],
      catalogkeyword: [{ value: '', disabled: true }, Validators.required],
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
      catalogkeyword: this.arrSupplier.product_category_keyword,
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

  btnCancelClick() {
    if (this.RowStatus === "product") {
      this.router.navigate([this.UrlRouter_Supplier], { queryParams: { filterByProduct: this.filterByProduct, status: this.RowStatus } });
    }
    if (this.RowStatus === "name") {
      this.router.navigate([this.UrlRouter_Supplier], { queryParams: { filterByName: this.filterByName, status: this.RowStatus } });
    }
    if (this.RowStatus === "category") {
      this.router.navigate([this.UrlRouter_Supplier], { queryParams: { filterByCategory: this.filterByCategory, status: this.RowStatus } });
    }
    if (this.RowStatus === "map") {
      this.router.navigate([this.UrlRouter_Supplier], { queryParams: { filterByMap: this.filterByMap, status: this.RowStatus } });
    }

  }

  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img,
      },
    });
  }

}

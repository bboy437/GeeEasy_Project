import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DistributorAPIService, BrowseSupplierAPIService } from '@project/services';
import { DialogsImageComponent } from '../../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'project-browse-distributors-detail',
  templateUrl: './browse-distributors-detail.component.html',
  styleUrls: ['./browse-distributors-detail.component.scss']
})
export class BrowseDistributorsDetailComponent implements OnInit {

  private UrlRouter_Supplier = "distributors/browse-distributor/list";
  arrDistributor: any = [];
  arrDistributorProduct: any = [];
  RowID: string;
  RowStatus: string;
  filterByProduct: string;
  filterByName: string;
  filterByCategory: string;
  filterByMap: string;
  loading = false;
  isReload = false;
  Form: FormGroup;

  id_local: string;


  constructor(
    private router: Router,
    private browseSupplierAPIService: BrowseSupplierAPIService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,

  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {
    this.buildForm();

    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");
    this.RowStatus = params.get("status");
    if (this.RowStatus === "product") {
      this.filterByProduct = this.route.snapshot.queryParamMap.get('filterBy')
      this.getData();
    }
    if (this.RowStatus === "name") {
      this.filterByName = this.route.snapshot.queryParamMap.get('filterBy')
      this.getData();
    }

    if (this.RowStatus === "category") {
      this.filterByCategory = this.route.snapshot.queryParamMap.get('filterBy')
      this.getData();
    }
    if (this.RowStatus === "map") {
      this.filterByMap = this.route.snapshot.queryParamMap.get('filterBy')
      this.getData();
    }

  }

  getData() {
    const value = this.RowID + "?dealer_id=" + this.id_local
    this.browseSupplierAPIService.getDistDetail(value).subscribe(data => {
      console.log("getData : data : ", data);
      this.arrDistributor = data.response_data[0];
      this.getDataProduct(this.arrDistributor.purchase_order_array, data.response_data);
    })
  }

  getDataProduct(data, response_data) {
    // this.arrDistributorProduct = data;
    console.log(" data : ", data);
    console.log("response_data : ", response_data);
    // if (data.length > 0) {
    this.getProductShort(response_data, res => {
      console.log("getDataProduct : getProductShort : res : ", res);
      if (res.response_data !== undefined) {
        this.arrDistributorProduct = res.response_data;
      }
    });
    // }

    console.log("arrDistributorProduct", this.arrDistributorProduct);
    this.detailForm();
  }

  buildUrlRequest(params, callback: (res) => any) {
    let isArray = params instanceof Array;
    let res = "";
    if (!isArray && typeof params === 'object') {
      let r = '', i = 0;
      // tslint:disable-next-line: forin
      for (let key in params) {
        if (res.indexOf('?') == -1 && i <= 0) {
          r += "?" + key + "=" + params[key];
        } else {
          r += "&" + key + "=" + params[key];
        }
        i++;
      }
      res = res + r;
      callback(res);
    } else if (isArray) {
      let r = "";
      for (let i = 0; i < params.length; i++) {
        if (res.indexOf('?') == -1 && i <= 0) {
          r += "?" + params[i].key + "=" + params[i].value;
        } else if (i <= 0) {
          r += "&" + params[i].key + "=" + params[i].value;
        }
      }
      res = res + r;
      callback(res);
    }
  };

  getProductShort(response_data, callback: (res) => any) {
    console.log("getProductShort : response_data : ", response_data);
    let search = {
      cur_page: 1,
      per_page: 100,
      distributor_id: 0
    };
    response_data.forEach(item => {
      search.distributor_id = item.distributor_id;
      this.buildUrlRequest(search, res => {
        console.log("getProductShort : buildUrlRequest : res : ", res);
        this.browseSupplierAPIService.getDistributorsProductsShortDetail(res).subscribe(res => {
          console.log("getProductShort : res : ", res);
          callback(res);
        });
      });
    });

  };

  buildForm() {
    this.Form = this.formBuilder.group({
      distributor_name: [{ value: '', disabled: true }, Validators.required],
      product_category_name: [{ value: '', disabled: true }, Validators.required],
      distributor_catalog_keyword: [{ value: '', disabled: true }, Validators.required],
      distributor_firstname: [{ value: '', disabled: true }, Validators.required],
      distributor_lastname: [{ value: '', disabled: true }, Validators.required],
      distributor_email: [{ value: '', disabled: true }, Validators.required],
      distributor_tel: [{ value: '', disabled: true }, Validators.required],
      distributor_mobile: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      distributor_addr_lat: [{ value: '', disabled: true }, Validators.required],
      distributor_addr_lng: [{ value: '', disabled: true }, Validators.required],
      distributor_addr_full: [{ value: '', disabled: true }, Validators.required],
      distributor_addr_number: [{ value: '', disabled: true }, Validators.required],
      distributor_addr_province: [{ value: '', disabled: true }, Validators.required],
      distributor_addr_amphoe: [{ value: '', disabled: true }, Validators.required],
      distributor_addr_tambon: [{ value: '', disabled: true }, Validators.required],
      distributor_addr_post: [{ value: '', disabled: true }, Validators.required],
    });
  }

  detailForm() {
    this.Form.patchValue({
      distributor_name: this.arrDistributor.distributor_name,
      product_category_name: this.arrDistributor.product_category_array.length === 0 ? '-' : this.arrDistributor.product_category_array[0].product_category_name,
      distributor_catalog_keyword: this.arrDistributor.distributor_catalog_keyword,
      distributor_firstname: this.arrDistributor.distributor_firstname,
      distributor_lastname: this.arrDistributor.distributor_lastname,
      distributor_email: this.arrDistributor.distributor_email,
      distributor_tel: this.arrDistributor.distributor_tel,
      distributor_mobile: this.arrDistributor.distributor_mobile,
      distributor_addr_lat: this.arrDistributor.distributor_addr_lat,
      distributor_addr_lng: this.arrDistributor.distributor_addr_lng,
      distributor_addr_full: this.arrDistributor.distributor_addr_full,
      distributor_addr_number: this.arrDistributor.distributor_addr_number,
      distributor_addr_province: this.arrDistributor.distributor_addr_province,
      distributor_addr_amphoe: this.arrDistributor.distributor_addr_amphoe,
      distributor_addr_tambon: this.arrDistributor.distributor_addr_tambon,
      distributor_addr_post: this.arrDistributor.distributor_addr_post,
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

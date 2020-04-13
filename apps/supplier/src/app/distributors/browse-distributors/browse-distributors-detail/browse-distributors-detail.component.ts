import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DistributorAPIService, BrowseSupplierAPIService, MessagesAPIService, UploadAPIService } from '@project/services';
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
  private UrlRouter_Message = "messages/chat";
  arrDistributor: any = [];
  arrDistributorProduct: any = [];
  RowID: string;
  RowStatus: string;
  filterByProduct: string;
  filterByName: string;
  filterByCategory: string;
  filterByMap: string;
  loading: boolean;
  isReload = false;
  lat: number;
  lng: number;
  id_local: string;
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
    private browseSupplierAPIService: BrowseSupplierAPIService,
    private messagesAPIService: MessagesAPIService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    private uploadAPIService: UploadAPIService

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
      const value = this.RowID + "?supplier_id=" + this.id_local
      this.browseSupplierAPIService.getDistDetail(value).subscribe(data => {
        this.arrDistributor = data.response_data[0];
        if (data.response_data.length > 0)
          this.dataProduct(this.arrDistributor.purchase_order_array);
        this.detailForm();
      })
    }
    if (this.RowStatus === "name") {
      this.filterByName = this.route.snapshot.queryParamMap.get('filterBy')
      const value = this.RowID + "?supplier_id=" + this.id_local
      this.browseSupplierAPIService.getDistDetail(value).subscribe(data => {
        this.arrDistributor = data.response_data[0];
        if (data.response_data.length > 0)
          this.dataProduct(this.arrDistributor.purchase_order_array);
        this.detailForm();
      })
    }

    if (this.RowStatus === "category") {
      this.filterByCategory = this.route.snapshot.queryParamMap.get('filterBy')
      const value = this.RowID + "?supplier_id=" + this.id_local
      this.browseSupplierAPIService.getDistDetail(value).subscribe(data => {
        this.arrDistributor = data.response_data[0];
        if (data.response_data.length > 0)
          this.dataProduct(this.arrDistributor.purchase_order_array);
        this.detailForm();
      })
    }
    if (this.RowStatus === "map") {
      this.filterByMap = this.route.snapshot.queryParamMap.get('filterBy')
      const value = this.RowID + "?supplier_id=" + this.id_local
      this.browseSupplierAPIService.getDistDetail(value).subscribe(data => {
        this.arrDistributor = data.response_data[0];
        if (data.response_data.length > 0)
          this.dataProduct(this.arrDistributor.purchase_order_array);
        this.detailForm();
      })
    }


  }

  dataProduct(data) {
    this.arrDistributorProduct = data;
  }

  buildForm() {
    this.Form = this.formBuilder.group({
      distributor_name: [{ value: '', disabled: true }, Validators.required],
      product_category_name: [{ value: '', disabled: true }, Validators.required],
      distributor_catalog_keyword: [{ value: '', disabled: true }, Validators.required],
      distributor_firstname: [{ value: '', disabled: true }, Validators.required],
      distributor_lastname: [{ value: '', disabled: true }, Validators.required],
      distributor_email: [{ value: '', disabled: true }, Validators.required],
      distributor_tel: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      distributor_mobile: [{ value: '', disabled: true }, Validators.required],
      distributor_addr_full: [{ value: '', disabled: true }, Validators.required],
      distributor_addr_number: [{ value: '', disabled: true }, Validators.required],
      distributor_addr_province: [{ value: '', disabled: true }, Validators.required],
      distributor_addr_amphoe: [{ value: '', disabled: true }, Validators.required],
      distributor_addr_tambon: [{ value: '', disabled: true }, Validators.required],
      distributor_addr_post: [{ value: '', disabled: true }, Validators.required],
      lat_long: [{ value: '', disabled: true }, Validators.required],
    });
  }

  detailForm() {
    
    if (
      this.arrDistributor.distributor_image_url !== undefined &&
      this.arrDistributor.distributor_image_url !== "-" &&
      this.arrDistributor.distributor_image_url !== ""
    )
      this.uploadAPIService
        .uploadImage()
        .getUrl(this.arrDistributor.distributor_image_url, red_image => {
          this.image.main_image.get.push(red_image);
        });

    this.Form.patchValue({
      distributor_name: this.arrDistributor.distributor_name,
      product_category_name: this.arrDistributor.product_category_array[0].product_category_name,
      distributor_catalog_keyword: this.arrDistributor.distributor_catalog_keyword,
      distributor_firstname: this.arrDistributor.distributor_firstname,
      distributor_lastname: this.arrDistributor.distributor_lastname,
      distributor_email: this.arrDistributor.distributor_email,
      distributor_tel: this.arrDistributor.distributor_tel,
      distributor_mobile: this.arrDistributor.distributor_mobile,
      distributor_addr_full: this.arrDistributor.distributor_addr_full,
      distributor_addr_number: this.arrDistributor.distributor_addr_number,
      distributor_addr_province: this.arrDistributor.distributor_addr_province,
      distributor_addr_amphoe: this.arrDistributor.distributor_addr_amphoe,
      distributor_addr_tambon: this.arrDistributor.distributor_addr_tambon,
      distributor_addr_post: this.arrDistributor.distributor_addr_post,
      lat_long: this.arrDistributor.distributor_addr_lat + ', ' + this.arrDistributor.distributor_addr_lng,
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

  btnMessage() {
    //this.router.navigate([{ outlets: { popup: null } }]);
    const data = {
      distributor_name: this.arrDistributor.distributor_name,
      distributor_id: this.arrDistributor.distributor_id
    }
    this.messagesAPIService.dataChat(data);
    // this.router.navigate([this.UrlRouter_Message, this.arrDistributor.distributor_id, this.arrDistributor.distributor_name]);
  }

  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img,
      },
    });
  }

}

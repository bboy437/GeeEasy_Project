import { Component, OnInit } from '@angular/core';
import { WarehouseAPIService, UploadAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'project-warehouse-detail',
  templateUrl: './warehouse-detail.component.html',
  styleUrls: ['./warehouse-detail.component.scss']
})
export class WarehouseDetailComponent implements OnInit {

  private UrlRouter_warehouseList = "products/warehouse/list";
  private UrlRouter_warehouseEdit = "products/warehouse/create";
  RowID: string;
  arrobjRow: any = [];
  Form: FormGroup;
  loading = false; 

  image = {
    update: false,
    main_image: {
      get: [],
      port: []
    }
  }

  constructor(
    private warehouseAPIService: WarehouseAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private uploadAPIService: UploadAPIService,
  ) { }

  ngOnInit() {   
    this.Builder();
    this.loading = true; 
    const params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      this.RowID = params.get("id");
      if (this.RowID === "new") {
      } else {
        this.warehouseAPIService.getWarehouseDetail(this.RowID).subscribe(data => {
          this.arrobjRow = data.response_data[0];
          console.log(this.arrobjRow );
          this.DetailForm();

          if (
            this.arrobjRow.warehouse_image_url !== undefined &&
            this.arrobjRow.warehouse_image_url !== "-" &&
            this.arrobjRow.warehouse_image_url !== ""
          )
            this.uploadAPIService
              .uploadImage()
              .getUrl(this.arrobjRow.warehouse_image_url, red_image => {
                this.image.main_image.get.push(red_image);
              });
        })
      }
    }
  }

  Builder() {
    this.Form = this.fb.group({
      warehouse_name: [{ value: '', disabled: true }, Validators.required],
      warehouse_tel: [{ value: '', disabled: true }, Validators.required],
      warehouse_mobile: [{ value: '', disabled: true }, Validators.required],
      warehouse_addr_address_full: [{ value: '', disabled: true }, Validators.required],
      warehouse_addr_number: [{ value: '', disabled: true }, Validators.required],
      warehouse_addr_tambon: [{ value: '', disabled: true }, Validators.required],
      warehouse_addr_amphoe: [{ value: '', disabled: true }, Validators.required],
      warehouse_addr_province: [{ value: '', disabled: true }, Validators.required],
      warehouse_addr_post: [{ value: '', disabled: true }, Validators.required],
      warehouse_lat_log: [{ value: '', disabled: true }, Validators.required],

    });
  }


  DetailForm() {
    this.Form.patchValue({
      warehouse_name: this.arrobjRow.warehouse_name,
      warehouse_tel: this.arrobjRow.warehouse_tel,
      warehouse_mobile: this.arrobjRow.warehouse_mobile,
      warehouse_addr_address_full: this.arrobjRow.warehouse_addr_address_full,
      warehouse_addr_number: this.arrobjRow.warehouse_addr_number,
      warehouse_addr_tambon: this.arrobjRow.warehouse_addr_tambon,
      warehouse_addr_amphoe: this.arrobjRow.warehouse_addr_amphoe,
      warehouse_addr_province: this.arrobjRow.warehouse_addr_province,
      warehouse_addr_post: this.arrobjRow.warehouse_addr_post,
      warehouse_lat_log: (this.arrobjRow.warehouse_lat + ',' + this.arrobjRow.warehouse_lng),
    });
    this.loading = false;
  }

  btnCancelClick(){
    this.router.navigate([this.UrlRouter_warehouseList]);

  }

  btnSaveClick(){
    this.router.navigate([this.UrlRouter_warehouseEdit,  this.arrobjRow.warehouse_id]);
  }

}

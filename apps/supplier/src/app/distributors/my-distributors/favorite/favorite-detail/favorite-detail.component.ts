import { Component, OnInit } from '@angular/core';
import { DistributorAPIService, UploadAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogsImageComponent } from '../../../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'project-favorite-detail',
  templateUrl: './favorite-detail.component.html',
  styleUrls: ['./favorite-detail.component.scss']
})
export class FavoriteDetailComponent implements OnInit {


  private UrlRouter_DistributorList = "distributors/my-distributor/favorite/list";
  arrDistributor: any = [];
  arrDistributorProduct: any = [];
  RowID: string;
  loading = false;
  isReload = false;

  Form: FormGroup;

  image = {
    update: false,
    main_image: {
      get: [],
      port: []
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private distributorAPIService: DistributorAPIService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private uploadAPIService: UploadAPIService

  ) {
    this.loading = true;
  }

  ngOnInit() {
    this.buildForm();
    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");
    if (this.RowID) {
      this.distributorAPIService.getDisDetail(this.RowID).subscribe(data => {
        console.log(data);
        this.arrDistributor = data.response_data[0];
        if (this.arrDistributor.length > 0) {
          this.dataProduct(this.arrDistributor.supplier_product_array);
        }
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
    
        this.detailForm();
      })
    }
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

  dataProduct(data) {
    this.arrDistributorProduct = data;
  }

  btnCancelClick() {
    this.router.navigate([this.UrlRouter_DistributorList]);
  }

  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img,
      },
    });
  }


}

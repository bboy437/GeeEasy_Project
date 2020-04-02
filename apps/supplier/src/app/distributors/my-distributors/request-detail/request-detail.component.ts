import { Component, OnInit } from "@angular/core";
import { DistributorAPIService, UploadAPIService } from "@project/services";
import { Router, ActivatedRoute } from "@angular/router";
import { DialogsImageComponent } from "../../../dialogs/dialogs-image/dialogs-image.component";
import { NbDialogService } from "@nebular/theme";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'project-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {
  private UrlRouter_List = "distributors/my-distributor/request/list";
  arrDistributor: any = [];
  arrDistributorProduct: any = [];
  arrRequestList: any = [];
  arrFile: any = [];
  arrReques: any = [];
  distributor_data_array: any = {};
  RowID: string;
  loading = false;
  isReload = false;

  id_local: string;
  Form: FormGroup;
  request_information_message: string;

  image = {
    update: false,
    main_image: {
      get: [],
      port: []
    }
  }


  constructor(
    private router: Router,
    private distributorAPIService: DistributorAPIService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    private uploadAPIService: UploadAPIService,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;

  }

  ngOnInit() {
    this.buildForm();
    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");

    console.log('this.RowID', this.RowID);

    if (this.RowID) {

      const value = "cur_page=" + 1 + "&per_page=" + 100 + "&supplier_id=" + this.id_local;
      this.distributorAPIService.getRequestList(value).subscribe(data => {
        this.arrReques = data.response_data;
        console.log('arrReques', this.arrReques);
        if (this.arrReques.length > 0) {
          this.arrRequestList = this.arrReques.filter((x) => x.request_information_id == Number(this.RowID));
          //  this.distributor_data_array =  this.arrRequestList[0].distributor_data_array[0];
          console.log('arrRequestList', this.arrRequestList);
          // this.detailForm();
          if (this.arrRequestList.length > 0) {
            this.distributor();
          }
        }

      })
    }
    // this.loading = false;

  }

  distributor() {
    console.log('distributor', this.arrRequestList);
    this.arrFile = this.arrRequestList[0].ref_1;
    console.log('arrFile', this.arrFile);

    this.request_information_message = this.arrRequestList[0].request_information_message;
    this.distributor_data_array = this.arrRequestList[0].distributor_data_array[0];
    console.log('distributor_data_array', this.distributor_data_array);

    if (
      this.distributor_data_array.distributor_image_url !== undefined &&
      this.distributor_data_array.distributor_image_url !== "-" &&
      this.distributor_data_array.distributor_image_url !== ""
    )
      this.uploadAPIService
        .uploadImage()
        .getUrl(this.distributor_data_array.distributor_image_url, red_image => {
          this.image.main_image.get.push(red_image);
        });

    this.detailForm();
    this.checkFile();
  }

  checkFile() {
    for (let index = 0; index < this.arrFile.length; index++) {
      const file_name = this.arrFile[index].file_name;
      if (file_name.match(/.(jpg|jpeg|png|gif)$/i)) {
        this.arrFile[index].icon = 'image-outline';
      } else if (file_name.match(/.(docx|pptx|xlsx|pdf|PDF)$/i)) {
        this.arrFile[index].icon = 'file-text-outline';
      } else {
        this.arrFile[index].icon = '';
      }
    }
  }


  buildForm() {
    this.Form = this.formBuilder.group({
      request_information_message: [{ value: '', disabled: true }, Validators.required],
      request_information_status_id: [{ value: '', disabled: true }, Validators.required],
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
      request_information_is_answer: [{ value: '', disabled: true }, Validators.required],
    });
  }

  detailForm() {
    this.Form.patchValue({
      request_information_message: this.arrRequestList[0].request_information_message,
      request_information_status_id: this.arrRequestList[0].verified === 0 ? 'Waiting' : (this.arrRequestList[0].verified === 1 ? 'Verified' : this.arrRequestList[0].verified),
      request_information_is_answer: this.arrRequestList[0].request_information_is_answer === 0 ? 'No' : "Yes",
      distributor_name: this.distributor_data_array.distributor_name,
      product_category_name: this.distributor_data_array.product_category_array[0].product_category_name,
      distributor_catalog_keyword: this.distributor_data_array.distributor_catalog_keyword,
      distributor_firstname: this.distributor_data_array.distributor_firstname,
      distributor_lastname: this.distributor_data_array.distributor_lastname,
      distributor_email: this.distributor_data_array.distributor_email,
      distributor_tel: this.distributor_data_array.distributor_tel,
      distributor_mobile: this.distributor_data_array.distributor_mobile,
      distributor_addr_full: this.distributor_data_array.distributor_addr_full,
      distributor_addr_number: this.distributor_data_array.distributor_addr_number,
      distributor_addr_province: this.distributor_data_array.distributor_addr_province,
      distributor_addr_amphoe: this.distributor_data_array.distributor_addr_amphoe,
      distributor_addr_tambon: this.distributor_data_array.distributor_addr_tambon,
      distributor_addr_post: this.distributor_data_array.distributor_addr_post,
      lat_long: this.distributor_data_array.distributor_addr_lat + ', ' + this.distributor_data_array.distributor_addr_lng,

    });
    this.loading = false;
  }



  btnCancelClick() {
    this.router.navigate([this.UrlRouter_List]);
  }

  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img
      }
    });
  }

  openUrl(url: string) {
    window.open(url, "_blank");
  }

}

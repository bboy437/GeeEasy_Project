import { Component, OnInit } from "@angular/core";
import { RequestService, SupplierAPIService, UploadAPIService } from "@project/services";
import { Router, ActivatedRoute } from "@angular/router";
import { DialogsImageComponent } from "../../../dialogs/dialogs-image/dialogs-image.component";
import { NbDialogService, NbIconLibraries } from "@nebular/theme";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'project-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {
  private UrlRouter_List = "suppliers/my-suppliers/request/list";
  arrDistributor: any = [];
  arrDistributorProduct: any = [];
  arrRequestList: any = [];
  arrReques: any = [];
  arrFile: any = [];
  arrobjRow: any = {};
  RowID: string;
  loading = false;
  isReload = false;
  submitted = false;

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
    private requestService: RequestService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    private supplierAPIService: SupplierAPIService,
    private iconLibraries: NbIconLibraries,
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

    this.requestService.requestListDistributor$.subscribe(res => {
      this.arrRequestList = res.filter((x) => x.request_information_id === +this.RowID);
      this.get_supplier();

    })

  }

  get_supplier() {
    this.arrFile = this.arrRequestList[0].ref_1;
    this.checkFile();
    this.request_information_message = this.arrRequestList[0].request_information_message;
    // this.distributor_data_array = this.arrRequestList[0].distributor_data_array[0];
    // console.log('distributor_data_array', this.distributor_data_array);
    const value = this.arrRequestList[0].supplier_id;
    this.supplierAPIService.getSupID(value).subscribe(res => {
      console.log('res', res.response_data[0]);
      this.arrobjRow = res.response_data[0];
      this.detailForm();

      if (
        this.arrobjRow.supplier_image_url !== undefined &&
        this.arrobjRow.supplier_image_url !== "-" &&
        this.arrobjRow.supplier_image_url !== ""
      )
        this.uploadAPIService
          .uploadImage()
          .getUrl(this.arrobjRow.supplier_image_url, red_image => {
            this.image.main_image.get.push(red_image);
          });

    })

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
    console.log('arrFile', this.arrFile);
  }

  get f() { return this.Form.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.Form.invalid) {
      return;
    }
  }

  buildForm() {
    this.Form = this.formBuilder.group({
      request_information_message: [{ value: '', disabled: true }, Validators.required],
      request_information_status_id: [{ value: '', disabled: true }, Validators.required],
      request_information_is_answer: [{ value: '', disabled: true }, Validators.required],
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
      request_information_message: this.arrRequestList[0].request_information_message,
      request_information_status_id: this.arrRequestList[0].verified === 0 ? 'Waiting' : (this.arrRequestList[0].verified === 1 ? 'Verified' : this.arrRequestList[0].verified),
      request_information_is_answer: this.arrRequestList[0].request_information_is_answer === 0 ? 'No' : "Yes",
      suppliername: this.arrobjRow.supplier_name,
      productcategory: this.arrobjRow.product_category_array[0].product_category_name,
      catalogkeyword: this.arrobjRow.product_category_keyword,
      supplierkeyword: this.arrobjRow.supplier_keyword,
      firstName: this.arrobjRow.supplier_name_first,
      lastName: this.arrobjRow.supplier_name_last,
      companyName: this.arrobjRow.supplier_company_name,
      emailAddress: this.arrobjRow.supplier_company_contact,
      phoneNo: this.arrobjRow.supplier_addr_phone,
      mobileNo: this.arrobjRow.supplier_addr_phone,
      AddressFull: this.arrobjRow.supplier_addr_full,
      AddressNo: this.arrobjRow.supplier_addr_number,
      province: this.arrobjRow.supplier_addr_province,
      amphoe: this.arrobjRow.supplier_addr_amphoe,
      tambon: this.arrobjRow.supplier_addr_tambon,
      zipcode: this.arrobjRow.supplier_addr_postcode,
      latlong: this.arrobjRow.supplier_addr_location_lat + ',' + this.arrobjRow.supplier_addr_location_lng
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

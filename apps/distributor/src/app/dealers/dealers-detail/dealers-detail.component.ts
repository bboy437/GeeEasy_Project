import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DealerAPIService, UploadAPIService } from '@project/services';
import { DialogsImageComponent } from '../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'project-dealers-detail',
  templateUrl: './dealers-detail.component.html',
  styleUrls: ['./dealers-detail.component.scss']
})
export class DealersDetailComponent implements OnInit {
  private UrlRouter_DealersList = "dealers/list";
  private UrlRouter_DealersEdit = "dealers/save";
  arrDeler: any = [];
  rowID: string;
  loading = false;

  dealersForm: FormGroup;

  image = {
    update: false,
    main_image: {
      get: [],
      port: []
    }
  }


  constructor(
    private router: Router,
    private dealerAPIService: DealerAPIService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private uploadAPIService: UploadAPIService,
    private formBuilder: FormBuilder,
  ) {
    this.loading = true;
  }

  ngOnInit() {
    this.buildForm();
    const params = this.route.snapshot.paramMap;
    this.rowID = params.get("id")
    if (this.rowID) {
      this.getDealerDetail();
    }
  }

  getDealerDetail() {
    this.dealerAPIService.getDealerDetail(this.rowID).subscribe(data => {
      this.arrDeler = data.response_data[0];

      if (
        this.arrDeler.dealer_image_url !== undefined &&
        this.arrDeler.dealer_image_url !== "-" &&
        this.arrDeler.dealer_image_url !== ""
      )
        this.uploadAPIService
          .uploadImage()
          .getUrl(this.arrDeler.dealer_image_url, red_image => {
            this.image.main_image.get.push(red_image);
          });
      console.log(this.arrDeler);
      this.editForm();

    })

  }


  buildForm() {
    this.dealersForm = this.formBuilder.group({
      dealer_name: [],
      dealer_tag: [],
      dealer_first_name: [],
      dealer_last_name: [],
      dealer_company: [],
      dealer_email: [],
      dealer_tel: [],
      dealer_mobile: [],
      dealer_addr_full: [],
      dealer_addr_number: [],
      dealer_addr_province: [],
      dealer_addr_amphoe: [],
      dealer_addr_tambon: [],
      dealer_addr_post: [],
      lat_long: [],
    });

  }

  editForm() {
    this.dealersForm.patchValue({
      dealer_name: this.arrDeler.dealer_name,
      dealer_tag: this.arrDeler.dealer_tag,
      dealer_first_name: this.arrDeler.dealer_first_name,
      dealer_last_name: this.arrDeler.dealer_last_name,
      dealer_company: this.arrDeler.dealer_company,
      dealer_email: this.arrDeler.dealer_email,
      dealer_tel: this.arrDeler.dealer_tel,
      dealer_mobile: this.arrDeler.dealer_mobile,
      dealer_addr_full: this.arrDeler.dealer_addr_full,
      dealer_addr_number: this.arrDeler.dealer_addr_number,
      dealer_addr_province: this.arrDeler.dealer_addr_province,
      dealer_addr_amphoe: this.arrDeler.dealer_addr_amphoe,
      dealer_addr_tambon: this.arrDeler.dealer_addr_tambon,
      dealer_addr_post: this.arrDeler.dealer_addr_post,
      lat_long: this.arrDeler.dealer_addr_lat + "," + this.arrDeler.dealer_addr_lng

    });
    this.dealersForm.disable();
    this.loading = false;
    console.log( this.dealersForm);
    
  }



  btnCancelClick() {
    this.router.navigate([this.UrlRouter_DealersList])

  }

  btnEditClick() {
    this.router.navigate([this.UrlRouter_DealersEdit, this.rowID])
  }


  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img,
      },
    });
  }


}

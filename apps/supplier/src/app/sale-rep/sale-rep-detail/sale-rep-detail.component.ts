import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { DialogsImageComponent } from '../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";

import { SaleRepService, UploadAPIService } from "@project/services";

@Component({
  selector: "project-sale-rep-detail",
  templateUrl: "./sale-rep-detail.component.html",
  styleUrls: ["./sale-rep-detail.component.scss"],
})
export class SaleRepDetailComponent implements OnInit {
  private createPage = "sale-rep/create";
  private backPage = "sale-rep/list";
  arrSale: any = [];
  arrSaleProduct: any = [];
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
    private router: Router, 
    private route: ActivatedRoute, 
    private saleRepService: SaleRepService, 
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder,
    private uploadAPIService: UploadAPIService
    ) { }

  ngOnInit() {
    this.buildForm();
    this.getSalerepAccountDetail(res => {
      console.log("ngOnInit : getSalerepAccountDetail : res : ", res);
      this.arrSale = res.response_data[0];

      if (
        this.arrSale.sale_rep_image_url !== undefined &&
        this.arrSale.sale_rep_image_url !== "-" &&
        this.arrSale.sale_rep_image_url !== ""
      )
        this.uploadAPIService
          .uploadImage()
          .getUrl(this.arrSale.sale_rep_image_url, red_image => {
            this.image.main_image.get.push(red_image);
          });

      this.editForm();
    })
  }

  getSalerepAccountDetail(callback: (res) => any) {
    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");
    this.saleRepService.getSalerepAccountDetail(this.RowID).subscribe(res => {
      console.log("getSalerepAccountDetail : res : ", res);
      callback(res);
    })
  };

  dataProduct(data) {
    this.arrSaleProduct = data;
  }

  buildForm() {
    this.Form = this.formBuilder.group({
        sale_rep_name: [{ value: "", disabled: true }, Validators.required],
        sale_rep_company: [{ value: "", disabled: true }, Validators.required],
        sale_rep_tag: [{ value: "", disabled: true }, Validators.required],
        sale_rep_first_name: [{ value: "", disabled: true }, Validators.required],
        sale_rep_last_name: [{ value: "", disabled: true }, Validators.required],
        sale_rep_email: [{ value: "", disabled: true }, [Validators.required, Validators.email]],
        sale_rep_tel: [{ value: "", disabled: true }, [Validators.required]],
        sale_rep_mobile: [{ value: "", disabled: true }, [Validators.required]],
        addressFull: [{ value: "", disabled: true }, [Validators.required]],
        addressNo: [{ value: "", disabled: true }, [Validators.required]],
        province: [{ value: "", disabled: true }, Validators.required],
        amphoe: [{ value: "", disabled: true }, Validators.required],
        tambon: [{ value: "", disabled: true }, Validators.required],
        zipcode: [{ value: "", disabled: true }, Validators.required],
        location_lat_location_lng: [{ value: "", disabled: true }, Validators.required],
    });
}

editForm() {
  this.Form.patchValue({
      sale_rep_name: this.arrSale.sale_rep_name,
      sale_rep_company: this.arrSale.sale_rep_company,
      sale_rep_tag: this.arrSale.sale_rep_tag,
      sale_rep_first_name: this.arrSale.sale_rep_first_name,
      sale_rep_last_name: this.arrSale.sale_rep_last_name,
      sale_rep_email: this.arrSale.sale_rep_email,
      sale_rep_tel: this.arrSale.sale_rep_tel,
      sale_rep_mobile: this.arrSale.sale_rep_mobile,
      addressFull: this.arrSale.sale_rep_addr_full,
      addressNo: this.arrSale.sale_rep_addr_number,
      province: this.arrSale.sale_rep_addr_province,
      amphoe: this.arrSale.sale_rep_addr_amphoe,
      tambon: this.arrSale.sale_rep_addr_tambon,
      zipcode: this.arrSale.sale_rep_addr_post,
      location_lat_location_lng: this.arrSale.sale_rep_addr_lat + ',' + this.arrSale.sale_rep_addr_lng,
  });
  this.loading = false;
}


  btnEditClick() {
    this.router.navigate([
      this.createPage,
      this.arrSale.sale_rep_id
    ]);
  }

  btnCancelClick() {
    this.router.navigate([this.backPage]);
  }

  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img,
      },
    });
  }
}

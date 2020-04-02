import { Observable } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { DecimalPipe } from "@angular/common";
import { ProductData } from "@project/interfaces";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { NgbdSortableHeader, SortEvent, UploadAPIService } from "@project/services";
import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { DialogsImageComponent } from "../../dialogs/dialogs-image/dialogs-image.component";
import { NbDialogService } from "@nebular/theme";

import { SaleRepService } from "@project/services";

@Component({
  selector: "sale-rep-detail",
  templateUrl: "./sale-rep-detail.component.html",
  styleUrls: ["./sale-rep-detail.component.scss"]
})
export class SaleRepDetailComponent implements OnInit {
  private createPage = "sale-rep/create";
  private backPage = "sale-rep/list";
  arrSale: any = [];
  arrSaleProduct: any = [];
  RowID: string;
  loading = false;
  isReload = false;

  image = {
    update: false,
    main_image: {
      get: [],
      port: []
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleRepService: SaleRepService,
    private dialogService: NbDialogService,
    private uploadAPIService: UploadAPIService
  ) {}

  ngOnInit() {
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
    });
  }

  getSalerepAccountDetail(callback: (res) => any) {
    const params = this.route.snapshot.paramMap;
    this.RowID = params.get("id");
    this.saleRepService.getSalerepAccountDetail(this.RowID).subscribe(res => {
      console.log("getSalerepAccountDetail : res : ", res);
      callback(res);
    });
  }

  dataProduct(data) {
    this.arrSaleProduct = data;
  }

  btnEditClick() {
    this.router.navigate([this.createPage, this.arrSale.sale_rep_id]);
  }

  btnCancelClick() {
    this.router.navigate([this.backPage]);
  }

  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img
      }
    });
  }
}

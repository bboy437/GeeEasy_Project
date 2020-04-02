import { Component, OnInit } from "@angular/core";
import { DistributorAPIService, UploadAPIService } from "@project/services";
import { Router, ActivatedRoute } from "@angular/router";
import { DialogsImageComponent } from "../../../dialogs/dialogs-image/dialogs-image.component";
import { NbDialogService } from "@nebular/theme";

@Component({
  selector: "project-my-distributors-detail",
  templateUrl: "./my-distributors-detail.component.html",
  styleUrls: ["./my-distributors-detail.component.scss"]
})
export class MyDistributorsDetailComponent implements OnInit {
  private UrlRouter_DistributorList = "distributors/my-distributor/list";
  private UrlRouter_DistributorCreate = "distributors/create";
  arrDistributor: any = [];
  arrDistributorProduct: any = [];
  RowID: string;
  loading = false;
  isReload = false;

  constructor(
    private router: Router,
    private distributorAPIService: DistributorAPIService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private uploadAPIService: UploadAPIService,
  ) {
    this.loading = true;
  }

  image = {
    update: false,
    main_image: {
        get: [],
        port: []
    }
}

  ngOnInit() {
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
        this.loading = false;
      });
    }
  }

  dataProduct(data) {
    this.arrDistributorProduct = data;
  }

  btnEditClick() {
    this.router.navigate([
      this.UrlRouter_DistributorCreate,
      this.arrDistributor.distributor_id
    ]);
  }

  btnCancelClick() {
    this.router.navigate([this.UrlRouter_DistributorList]);
  }

  openImg(img: any) {
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img
      }
    });
  }
}

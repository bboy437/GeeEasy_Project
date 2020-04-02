import { Component, OnInit } from '@angular/core';
import { DistributorAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogsImageComponent } from '../../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'project-verifed-detail',
  templateUrl: './verifed-detail.component.html',
  styleUrls: ['./verifed-detail.component.scss']
})
export class VerifedDetailComponent implements OnInit {

  private UrlRouter_DistributorList = "distributors/my-distributor/veriferd/list";
  arrDistributor: any = [];
  arrDistributorProduct: any = [];
  RowID: string;
  loading = false;
  isReload = false;

  constructor(
    private router: Router,
    private distributorAPIService: DistributorAPIService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService
    
    ) { 
      this.loading = true;
    }

    ngOnInit() {
      const params = this.route.snapshot.paramMap;
      this.RowID = params.get("id");
      if (this.RowID) {
        this.distributorAPIService.getDisDetail(this.RowID).subscribe(data => {
          console.log(data); 
          this.arrDistributor = data.response_data[0];
          if(this.arrDistributor.length > 0){
            this.dataProduct(this.arrDistributor.supplier_product_array);
          }
          this.loading = false;
        })
      }
    }
  
  dataProduct(data) {
    this.arrDistributorProduct = data;
  }


  btnCancelClick() {
    this.router.navigate([this.UrlRouter_DistributorList]);
  }

  openImg(img : any) {  
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img,
      },
    });
  }

  
}

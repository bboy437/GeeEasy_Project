import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DealerAPIService } from '@project/services';
import { DialogsImageComponent } from '../../dialogs/dialogs-image/dialogs-image.component';
import { NbDialogService } from '@nebular/theme';

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
  constructor(
    private router: Router,
    private dealerAPIService: DealerAPIService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService
  ) { 
    this.loading = true;
  }

  ngOnInit() {
    const params = this.route.snapshot.paramMap;
    this.rowID = params.get("id")
    if(this.rowID){
      this.getDealerDetail();
    }
  }

  getDealerDetail(){   
    this.dealerAPIService.getDealerDetail(this.rowID).subscribe(data => {
      this.arrDeler = data.response_data[0];
      console.log(this.arrDeler);
      this.loading = false;
    })
    
  }


  btnCancelClick(){
    this.router.navigate([this.UrlRouter_DealersList])

  }

  btnEditClick(){
    this.router.navigate([this.UrlRouter_DealersEdit, this.rowID])
  }


  openImg(img : any) {  
    this.dialogService.open(DialogsImageComponent, {
      context: {
        imgURL: img,
      },
    });
  }
  

}

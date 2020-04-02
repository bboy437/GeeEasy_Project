import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PurchaseAPIService } from "@project/services";

@Component({
  selector: "project-doc-order-confirmation",
  templateUrl: "./doc-order-confirmation.component.html",
  styleUrls: ["./doc-order-confirmation.component.scss"]
})
export class DocOrderConfirmationComponent implements OnInit {
  arrDoc: any = [];
  arrDocFrom: any = {};
  arrDocTo: any = {};
  rowID: string;
  typeID: string;
  status: string;
  dataDoc: any = {};
  productDoc: any = [];
  orderSummary: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseAPIService: PurchaseAPIService
  ) { }

  ngOnInit() {
    const params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      this.rowID = params.get("id");
      this.typeID = params.get("typeid");
      this.status = params.get("status");
      console.log(this.rowID);
      this.getDoc();
    }
  }

  getDoc() {
    this.purchaseAPIService
      .getDoc(this.rowID + "/" + this.typeID)
      .subscribe(data => {
        console.log("getDoc : data : ", data);
        this.dataDoc = data.response_data[0];
        this.productDoc = data.response_data[0].form_data_display.product_array;
        this.orderSummary =
          data.response_data[0].form_data_display.purchase_order_summary;

        this.arrDoc = data.response_data[0].form_data_display;
        this.arrDocFrom = data.response_data[0].form_data_display.seller;
        this.arrDocTo = data.response_data[0].form_data_display.buyer;
        console.log(this.arrDoc);
      });
  }

  btnCancelClick() {
    if (this.status === 'bill') {
      this.router.navigate(["bills/detail/", this.rowID]);
    }
    if (this.status === 'po') {
      this.router.navigate(["purchases/detail/", this.rowID]);
    }
  }

  printPage(cmpName) {
    const data = cmpName;
    const printContent = document.getElementById(data).innerHTML;
    const WindowPrt = window.open(
      "",
      "",
      "left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0"
    );
    WindowPrt.document.write(
      printContent,
      '<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">'
    );
    WindowPrt.document.close();
    WindowPrt.focus();
    setTimeout(() => {
      WindowPrt.print();
      WindowPrt.close();
    }, 1000);
  }
}

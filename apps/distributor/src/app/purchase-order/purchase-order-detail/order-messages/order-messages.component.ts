import { Component, OnInit, Input } from '@angular/core';
import { PurchaseAPIService } from '@project/services';

@Component({
  selector: 'project-order-messages',
  templateUrl: './order-messages.component.html',
  styleUrls: ['./order-messages.component.scss']
})
export class OrderMessagesComponent implements OnInit {

  messages: any[];
  @Input() purchaseID: string;
  istypeing = ""

  constructor(
    private purchaseAPIService: PurchaseAPIService,
  ) { }

  ngOnInit() {
    console.log(this.purchaseID);
    this.getMassgesDist();
  }

  getMassgesDist() {
    this.purchaseAPIService.getMassagesDis(this.purchaseID).subscribe(data => {
      this.messages = data.response_data[0].message_text_array;
      console.log(data.response_data[0].message_text_array);

    })
  }

  sendMessage(event: any) {

    console.log(event);
    
    this.messages.push({
      text_type_id: 2,
      text_detail: event.message,
      create_time: (new Date()).getTime() / 1000,
    });

    const dataJson = {
      purchase_order_id: this.purchaseID,
      message: event.message
    }
    const dataJsons = JSON.stringify(dataJson);
    this.purchaseAPIService.addMassageDis(dataJsons).subscribe(data => {
      console.log(data);
      
      // this.messages = data.response_data[0].message_text_array;
      // console.log(this.messages);
    })
  }

  showMessages(e){

  }


}

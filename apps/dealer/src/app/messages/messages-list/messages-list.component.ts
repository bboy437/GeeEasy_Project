import { Component, OnInit } from '@angular/core';
import { MessagesAPIService, UploadAPIService, BrowseSupplierAPIService } from '@project/services';
import { Router } from '@angular/router';


@Component({
  selector: 'project-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss']
})
export class MessagesListComponent implements OnInit {

  arrMessagseList: any = [];
  arrMessagseListFilter: any = [];
  messages: any = [];
  arrDistributor: any = [];
  arrDealer: any = [];
  strTitle = "Messages";
  strMessages: string;
  contact_id: number;
  isStatus = false;
  imagePath: any = [];
  uploadData: any = [];
  arrName: any = [];
  imgURL: any;
  public message = "No File chosen";
  private UrlRouter_Purchase = "purchases/list";
  strStatus = false;
  loading = false;
  strname: string
  loading1 = false;

  id_local: string;

  constructor(
    private messagesAPIService: MessagesAPIService,
    private uploadAPIService: UploadAPIService,
    private router: Router,
    private browseSupplierAPIService: BrowseSupplierAPIService
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {
    this.getMessagesList();

  }


  filterName(value: any) {
    if (value) {
      this.strStatus = true;
      this.loading = true;
      this.getName(value);
    }
    else {
      this.loading = true;
      this.strStatus = false;
      this.getMessagesList();
    }
  }

  getName(value: any) {
    const valueName = 'cur_page=' + 1 + '&per_page=' + 10 + '&search_text=' + value;
    this.browseSupplierAPIService.getNameDist(valueName).subscribe(data => {
      console.log(data.response_data);
      this.arrName = data.response_data;
      this.loading = false;
    })
  }


  getMessagesList() {
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&dealer_id=" + this.id_local;
    this.messagesAPIService.getContactListDealer(value).subscribe(data => {
      if (data.response_data.length > 0) {
        this.arrMessagseList = data.response_data;
        this.arrMessagseList.forEach(element => {
          element.distributor_data_array.forEach(d => {
            element.distributor_name = d.distributor_name;
          });

        });
        console.log(this.arrMessagseList);
        this.arrDealer = this.arrMessagseList[0].dealer_data_array[0];

      }
      this.loading = false;
    })
  }


  btnMessagesClick(ID, data) {
    //data
    this.messages = [];
    this.loading1 = true;

    this.contact_id = ID;
    this.arrDealer = data.dealer_data_array[0];
    this.arrDistributor = data.distributor_data_array[0];
    this.strTitle = data.distributor_data_array[0].distributor_name;
    this.getMessagesDetail(ID)

  }

  getMessagesDetail(ID) {
    this.messagesAPIService.getContactDetaiilSup(ID).subscribe(data => {
      this.messages = data.response_data[0].contact_text_array;
      console.log(this.messages);
      this.checkFile();
      this.loading1 = false;

    })
    this.isStatus = true;

  }

  sendMessage(event: any, ) {
    this.strMessages = "";
    this.messages.push({
      text_detail: event,
      create_time: (new Date()).getTime() / 1000,
      isUpload: 'no file',
      icon: '',
      dealer_data_array: [
        {
          dealer_name: this.arrMessagseList[0].dealer_data_array[0].dealer_name,
          dealer_image_url: this.arrMessagseList[0].dealer_data_array[0].dealer_image_url,
        }
      ],
      supplier_data_array: [],
      distributor_data_array: []
    });
    this.checkFile();

    const dataJson = {
      geeesy_contact_id: this.contact_id,
      dealer_id: this.id_local,
      message: event
    }
    console.log('messages', this.messages);
    console.log('dataJson', dataJson);
    this.messagesAPIService.addReplytDealer(JSON.stringify(dataJson)).subscribe(res => {
      console.log(res);
    })

  }


  btnMessagesSubmitClick(data) {
    console.log(data);
    this.arrDistributor = data;
    this.isStatus = true;
    this.strTitle = data.distributor_name;
    this.messages = [];
  }

  sentSubmitMessages(event: any) {
    this.strMessages = "";
    this.messages.push({
      text_detail: event,
      text_time: (new Date()).getTime() / 1000,
      isUpload: 'no file',
      icon: '',
      dealer_data_array: [
        {
          dealer_name: this.arrMessagseList[0].dealer_data_array[0].dealer_name,
          dealer_image_url: this.arrMessagseList[0].dealer_data_array[0].dealer_image_url,
        }
      ],
      supplier_data_array: [],
      distributor_data_array: []

    });

    this.checkFile();
    console.log(this.messages);
    const dataJson = {
      dealer_id: this.id_local,
      distributor_id: this.arrDistributor.distributor_id,
      message: event
    }
    console.log('messages', this.messages);
    console.log('dataJson', dataJson);
    this.messagesAPIService.addMessageSubmittDealer(JSON.stringify(dataJson)).subscribe(res => {
      this.contact_id = res.response_data[0].geeesy_contact_id;
      console.log(this.contact_id);
    })
  }

  uploadFile(files) {

    this.message = files[0].name;
    this.imagePath = files[0];

    this.upload()
  }

  upload() {
    const dataJson = {
      type_id: 660,
      file_name: this.imagePath.name,
      file_type: this.imagePath.type,
      supplier_id: 0,
      dealer_id: this.id_local,
      distributor_id: 0
    }

    this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
      this.uploadData = res.response_data[0];

      this.uploadAPIService.uploadPut(this.uploadData.file_upload_url, this.imagePath).subscribe(res1 => {
        // tslint:disable-next-line: triple-equals
        if (this.strStatus == false) {
          this.sendMessagesFile(this.uploadData.file_url);
        } else {
          this.sentSubmitFile(this.uploadData.file_url);
        }
      })

    })
  }

  sendMessagesFile(file) {

    this.strMessages = "";
    console.log(this.messages);
    this.messages.push({
      text_detail: file,
      create_time: (new Date()).getTime() / 1000,
      dealer_data_array: [
        {
          dealer_name: this.arrMessagseList[0].dealer_data_array[0].dealer_name,
          dealer_image_url: this.arrMessagseList[0].dealer_data_array[0].dealer_image_url,
        }
      ],
      supplier_data_array: [],
      distributor_data_array: [],
      text_extra_attachment: [{
        file_url: file
      }],
    });

    this.checkFile()

    const dataJson = {
      geeesy_contact_id: this.contact_id,
      dealer_id: this.id_local,
      message: this.message,
      attachment_url: file
    }

    this.messagesAPIService.addReplytDealer(JSON.stringify(dataJson)).subscribe(res => {
    })

  }

  sentSubmitFile(file: any) {
    this.strMessages = "";
    this.strStatus = false;
    this.messages.push({
      text_detail: file,
      create_time: (new Date()).getTime() / 1000,
      dealer_data_array: [
        {
          dealer_name: this.arrMessagseList[0].dealer_data_array[0].dealer_name,
          dealer_image_url: this.arrMessagseList[0].dealer_data_array[0].dealer_image_url,
        }
      ],
      supplier_data_array: [],
      distributor_data_array: [],
      text_extra_attachment: [{
        file_url: file
      }],
    });
    this.checkFile()
    console.log(this.messages);
    console.log(file);
    const dataJson = {
      dealer_id: this.id_local,
      distributor_id: this.arrDistributor.distributor_id,
      message: this.message,
      attachment_url: file

    }
    console.log(dataJson);
    this.messagesAPIService.addMessageSubmittDealer(JSON.stringify(dataJson)).subscribe(res => {
      this.contact_id = res.response_data[0].geeesy_contact_id;
    })
  }



  checkFile() {

    this.messages.sort((a, b) => a.text_time - b.text_time);
    for (let index = 0; index < this.messages.length; index++) {
      const messages_my_id = this.messages[index].text_detail;
      if (messages_my_id.match(/.(jpg|jpeg|png|gif|svg)$/i)) {
        this.messages[index].isUpload = 'img';
        this.messages[index].icon = 'image-outline';
      } else if (messages_my_id.match(/.(docx|pptx|xlsx|pdf|PDF)$/i)) {
        this.messages[index].isUpload = 'file-text';
        this.messages[index].icon = 'file-text-outline';
      } else {
        this.messages[index].isUpload = 'no file';
        this.messages[index].icon = '';
      }
    }
  }


  btnRefresh() {
    this.strname = "";
    this.strStatus = false;
    this.getMessagesList();
  }

  openUrl(url: string) {
    console.log(url);

    window.open(url, "_blank");
  }

}




  // getSupplier() {
  //   const value = "cur_page=" + 1 + "&per_page=" + 10 + "&search_text=" + "" + "&distributor_id=" + 110 + "&product_category_id=" + 0;
  //   this.supplerService.getVerifiedSupplieList(value).subscribe(data => {
  //     this.arrSuppler = data.response_data;
  //     this.arrSupplerFilter = data.response_data;
  //     console.log(this.arrSuppler);

  //   })

  // }

  // btnClickSupplier(data) {
  //   this.messages = [];
  //   this.strTitle = data.supplier_name_first + " " + data.supplier_name_last
  //   this.messages.push({
  //     text: data.supplier_name,
  //     date: new Date(),
  //     reply: false,
  //     user: {
  //       name: data.supplier_name_first,
  //       avatar: data.supplier_image_url,
  //     },
  //   });
  //   console.log('  this.messages', this.messages);


  // }

  // getOrder() {
  //   const value = "cur_page=" + 1 + "&per_page=" + 10 + "&distributor_id=" + 110 + "&supplier_id=" + 0
  //   this.purchaseAPIService.getPurchaseList(value).subscribe(data => {
  //     this.arrOrder = data.response_data;
  //     this.arrOrderFilter = data.response_data;
  //     this.strStatus = "ok";

  //   })

  // }


  // filterSupplier(value: any) {
  //   this.arrSuppler = this.arrSupplerFilter.filter(option =>
  //     option.supplier_name.toLowerCase().toString().includes(value)
  //   );

  //   return this.arrSuppler.filter(option =>
  //     option.supplier_name.toLowerCase().toString().includes(value))
  // }

  // filterOrder(value: any) {
  //   this.arrOrder = this.arrOrderFilter.filter(option =>
  //     option.purchase_order_number.toLowerCase().toString().includes(value)
  //   );

  //   return this.arrOrder.filter(option =>
  //     option.purchase_order_number.toLowerCase().toString().includes(value))

  // }









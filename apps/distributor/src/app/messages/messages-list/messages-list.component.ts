import { Component, OnInit } from '@angular/core';
import { MessagesAPIService, UploadAPIService, BrowseSupplierAPIService, DistributorAPIService } from '@project/services';
import { Router } from '@angular/router';


@Component({
  selector: 'project-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss']
})
export class MessagesListComponent implements OnInit {

  arrMessagseList: any = [];
  arrMessagseListFilter: any = [];
  arrDealer: any = [];
  filterList: any = [];
  messages: any = [];
  arrSuppler: any = [];
  arrDistributor: any = [];
  strTitle = "Messages";
  strMessages: string;
  contact_id: number;
  isStatus = false;
  imagePath: any = [];
  uploadData: any = [];
  arrDist: any = [];
  imgURL: any;
  public message = "No File chosen";
  private UrlRouter_Purchase = "purchases/list";
  strStatus = false;
  arrName: any = [];
  strname: string;
  loading = false;
  loading1 = false;
  isReload = false;

  id_local: string;


  constructor(
    private messagesAPIService: MessagesAPIService,
    private uploadAPIService: UploadAPIService,
    private router: Router,
    private browseSupplierAPIService: BrowseSupplierAPIService,
    private distributorAPIService: DistributorAPIService

  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {

    const value = this.id_local;
    this.distributorAPIService.getDisDetail(value).subscribe(res => {
      this.arrDist = res.response_data[0];
      console.log(this.arrDist);
    })

    this.getMessagesList();

  }

  filterName(value: any) {
    if (value) {
      this.strStatus = true;
      this.loading = true;
      this.getSupplierName(value);
    }
    else {
      this.strStatus = false;
      this.loading = true;
      this.getMessagesList();
    }
  }

  getSupplierName(value: any) {
    const valueName = 'cur_page=' + 1 + '&per_page=' + 100 + '&search_text=' + value + "&distributor_id=" + this.id_local;
    this.browseSupplierAPIService.getSupplierName(valueName).subscribe(data => {
      console.log(data.response_data);
      this.arrName = data.response_data;
      this.loading = false;
    })
  }

  getMessagesList() {
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&distributor_id=" + this.id_local;
    this.messagesAPIService.getContactListDist(value).subscribe(data => {
      console.log(data.response_data);
      this.arrMessagseList = data.response_data;
      this.arrMessagseList.forEach(element => {
        element.supplier_data_array.forEach(s => {
          element.supplier_name_first = s.supplier_name_first;
          element.supplier_name_last = s.supplier_name_last;
        });

      });
      this.arrMessagseListFilter = this.arrMessagseList;
      console.log(this.arrMessagseListFilter);
      this.loading = false;
    })

  }

  btnMessagesClick(ID, data) {
    this.messages = [];
    this.loading1 = true;
    this.contact_id = ID;
    if (data.supplier_data_array.length > 0) {
      this.arrSuppler = data.supplier_data_array[0];
      this.strTitle = data.supplier_data_array[0].supplier_name;
    } else {
      this.arrDealer = data.dealer_data_array[0];
      this.strTitle = data.dealer_data_array[0].dealer_name;
    }
    this.arrDistributor = data.distributor_data_array[0];
    this.getMessagesDetail(ID)
  }

  getMessagesDetail(ID) {
    this.messagesAPIService.getContactDetaiilDist(ID).subscribe(data => {
      this.messages = data.response_data[0].contact_text_array;
      console.log(this.messages);
      this.checkFile();
      this.loading1 = false;
    })
    this.isStatus = true;

  }

  sendMessage(event: any, ) {
    if (event !== "") {
      this.strMessages = "";
      console.log(this.messages);
      this.messages.push({
        text_type_id: 1,
        text_detail: event,
        create_time: (new Date()).getTime() / 1000,
        isUpload: 'no file',
        icon: '',
        dealer_data_array: [],
        supplier_data_array: [],
        distributor_data_array: [{
          distributor_name: this.arrDist.distributor_name,
          distributor_image_url: this.arrDist.distributor_image_url,
        }]
      });
      this.checkFile();
      const dataJson = {
        "geeesy_contact_id": this.contact_id,
        "distributor_id": this.id_local,
        "message": event
      }
      this.messagesAPIService.addReplyDist(JSON.stringify(dataJson)).subscribe(data => {
        console.log(data);

      })
    }
  }


  btnMessagesSubmitClick(data) {
    console.log(data);
    this.arrSuppler = data;
    this.strTitle = data.supplier_name;
    this.messages = [];
    this.isStatus = true;

  }

  sentSubmitMessages(event: any, data) {
    console.log('2', event, data);
    if (event !== "") {

      this.strMessages = "";
      this.messages.push({
        text_type_id: 1,
        text_detail: event,
        create_time: (new Date()).getTime() / 1000,
        isUpload: 'no file',
        icon: '',
        dealer_data_array: [],
        supplier_data_array: [],
        distributor_data_array: [{
          distributor_name: this.arrDist.distributor_name,
          distributor_image_url: this.arrDist.distributor_image_url,
        }]

      });
      this.checkFile();
      console.log(this.messages);
      const dataJson = {
        supplier_id: this.arrSuppler.supplier_id,
        distributor_id: this.id_local,
        message: event
      }
      this.messagesAPIService.sentMessageDist(JSON.stringify(dataJson)).subscribe(res => {
        this.contact_id = res.response_data[0].geeesy_contact_id;
        console.log(this.contact_id);
        this.strname = "";
        this.filterName("");
        this.getMessagesList();
      })
    }
  }

  uploadFile(files) {

    this.message = files[0].name;
    this.imagePath = files[0];

    this.upload()
  }

  upload() {
    const dataJson = {
      type_id: 260,
      file_name: this.imagePath.name,
      file_type: this.imagePath.type,
      supplier_id: 0,
      distributor_id: this.id_local
    }

    this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
      this.uploadData = res.response_data[0];

      this.uploadAPIService.uploadPut(this.uploadData.file_upload_url, this.imagePath).subscribe(res1 => {
        // tslint:disable-next-line: triple-equals
        if (this.strStatus == false) {
          this.sendMessagesFile(this.uploadData.file_url)
        } else {
          this.sentSubmitFile(this.uploadData.file_url)
        }

      })

    })
  }

  sendMessagesFile(file) {

    this.strMessages = "";
    console.log(this.messages);
    this.messages.push({
      text_type_id: 1,
      text_detail: this.message,
      create_time: (new Date()).getTime() / 1000,
      dealer_data_array: [],
      supplier_data_array: [],
      text_extra_attachment: [{
        file_url: file
      }],
      distributor_data_array: [{
        distributor_name: this.arrDist.distributor_name,
        distributor_image_url: this.arrDist.distributor_image_url,
      }]
    });
    this.checkFile()
    const dataJson = {
      geeesy_contact_id: this.contact_id,
      distributor_id: this.id_local,
      message: this.message,
      attachment_url: file
    }
    this.messagesAPIService.addReplyDist(JSON.stringify(dataJson)).subscribe(res => {
    })
  }

  sentSubmitFile(file: any) {

    this.strStatus = false;
    this.strMessages = "";
    this.messages.push({
      text_type_id: 1,
      text_detail: this.message,
      create_time: (new Date()).getTime() / 1000,
      dealer_data_array: [],
      supplier_data_array: [],
      text_extra_attachment: [{
        file_url: file
      }],
      distributor_data_array: [{
        distributor_name: this.arrDist.distributor_name,
        distributor_image_url: this.arrDist.distributor_image_url,
      }]

    });
    this.checkFile()
    console.log(this.messages);
    const dataJson = {
      supplier_id: this.arrSuppler.supplier_id,
      distributor_id: this.id_local,
      message: this.message,
      attachment_url: file
    }
    this.messagesAPIService.sentMessageDist(JSON.stringify(dataJson)).subscribe(res => {
      this.contact_id = res.response_data[0].geeesy_contact_id;
      this.strname = "";
      this.filterName("");
      this.getMessagesList();
    })
  }

  checkFile() {
    this.messages.sort((a, b) => a.text_time - b.text_time);
    for (let index = 0; index < this.messages.length; index++) {
      const messages_my_id = this.messages[index].text_detail;
      if (messages_my_id.match(/.(jpg|jpeg|png|gif)$/i)) {
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

  btnPoClick() {
    this.router.navigate([this.UrlRouter_Purchase, { id: this.arrSuppler.supplier_name }]);
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









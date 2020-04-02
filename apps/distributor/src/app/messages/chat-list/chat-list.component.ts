import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SupplierAPIService, MessagesAPIService, UploadAPIService, BrowseSupplierAPIService, DistributorAPIService } from '@project/services';

@Component({
  selector: 'project-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  arrMessagseList: any = [];
  arrMessagseListFilter: any = [];
  arrOrder: any = [];
  arrOrderFilter: any = [];
  arrDist: any = [];
  arrName: any = [];
  messages: any[] = [];
  strStatus = false;
  strTitle = "Messages";
  arrContact: any = [];
  arrSuppler: any = [];
  arrDealer: any = [];
  arrDistributor: any = [];
  strMessages: string;
  contact_id: number;
  imagePath: any = [];
  uploadData: any = [];
  imgURL: any;
  public message = "No File chosen";
  arrputData: any = [];
  idCheck: any = [];
  isChat: boolean;
  loading = false;
  strFilter: string;

  id_local: string;

  constructor(
    private uploadAPIService: UploadAPIService,
    private messagesAPIService: MessagesAPIService,
    private supplierAPIService: SupplierAPIService,
    private distributorAPIService: DistributorAPIService,
    private browseSupplierAPIService: BrowseSupplierAPIService
  ) {

    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);

  }

  ngOnInit() {
    // this.getMessagesList();

    const value = this.id_local;
    this.distributorAPIService.getDisDetail(value).subscribe(res => {
      this.arrDist = res.response_data[0];
      console.log(this.arrDist);

    })
  }

  filterName(value: any) {
    if (value) {
      this.strStatus = true;
      this.getSupplierName(value);
    }
    else {
      this.strStatus = false;
      this.getMessagesList();
    }
  }

  getSupplierName(value: any) {
    const valueName = 'cur_page=' + 1 + '&per_page=' + 100 + '&search_text=' + value + "&distributor_id=" + this.id_local;
    this.browseSupplierAPIService.getSupplierName(valueName).subscribe(data => {
      console.log(data.response_data);
      this.arrName = data.response_data;
    })
  }

  getMessagesList() {
    this.loading = true;
    const value = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + this.id_local;
    this.messagesAPIService.getContactListDist(value).subscribe(data => {
      // this.contact_id = data.response_data[0].geeesy_contact_id;
      this.arrMessagseList = data.response_data;
      this.arrMessagseList.forEach(element => {
        element.supplier_data_array.forEach(s => {
          element.supplier_name_first = s.supplier_name_first;
          element.supplier_name_last = s.supplier_name_last;
        });

      });
      this.arrMessagseListFilter = this.arrMessagseList;
      console.log(this.arrMessagseList);
      this.loading = false;
    })

  }


  //reply
  btnMessagesClick(ID, data) {
    console.log('data', data);
    this.arrSuppler = [];
    this.arrDealer = [];

    this.isChat = false;
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
      console.log('data', data.response_data[0]);
      console.log('messages', this.messages);
      this.checkFile()
      this.putData();
    })

  }

  putData() {

    this.arrputData.push({
      data: this.messages,
      name: this.strTitle,
      geeesy_contact_id: this.contact_id,
      status: false,
      isOpen: true
    });
    const array = this.arrputData;
    const arrayNew = new Map(array.map(obj => [obj.geeesy_contact_id, obj]));
    const arrayNews = Array.from(arrayNew.values());
    this.arrputData = arrayNews;
    this.isChat = true;
    console.log("push", this.arrputData);
  }


  replyMessage(event: any, data) {
    console.log('data', data);
    console.log('key', event);
    if (event !== "") {
      data.strMessages = "";
      this.messages = data.data;
      this.messages.push({
        text_type_id: 1,
        text_detail: event,
        text_time: (new Date()).getTime() / 1000,
        isUpload: 'no file',
        dealer_data_array: [],
        supplier_data_array: [],
        distributor_data_array: [{
          distributor_name: this.arrDist.distributor_name,
          distributor_image_url: this.arrDist.distributor_image_url,
        }]
      });
      this.checkFile()
      console.log(this.arrputData);
      const dataJson = {
        geeesy_contact_id: data.geeesy_contact_id === undefined ? this.contact_id : data.geeesy_contact_id,
        distributor_id: this.id_local,
        message: event
      }
      this.messagesAPIService.addReplyDist(JSON.stringify(dataJson)).subscribe(res => {
        console.log(res);
        //  this.getMessagesList();
      })
    }
  }

  //Submit
  btnMessagesSubmitClick(data) {
    this.strFilter = "";
    this.filterName("");

    console.log(data);
    this.arrSuppler = data;
    this.strTitle = data.supplier_name;
    this.putSubmitData();
  }

  putSubmitData() {

    this.arrputData.push({
      data: [],
      name: this.strTitle,
      supplier_id: this.arrSuppler.supplier_id,
      nameDist: "You",
      imgDist: "",
      status: true,
      isOpen: true
    });
    console.log(this.arrputData);
    const array = this.arrputData;
    const arrayNew = new Map(array.map(obj => [obj.supplier_id, obj]));
    const arrayNews = Array.from(arrayNew.values());
    this.arrputData = arrayNews;
    console.log("push", this.arrputData);
  }

  sentSubmitMessages(event: any, data) {
    console.log('2', event, data);
    if (event !== "") {

      data.status = false;
      data.strMessages = "";
      this.messages = data.data;
      this.messages.push({
        text_type_id: 1,
        text_detail: event,
        text_time: (new Date()).getTime() / 1000,
        isUpload: 'no file',
        dealer_data_array: [],
        supplier_data_array: [],
        distributor_data_array: [{
          distributor_name: this.arrDist.distributor_name,
          distributor_image_url: this.arrDist.distributor_image_url,
        }]

      });
      this.checkFile()
      console.log('messages', this.messages);
      console.log('arrputData', this.arrputData);
      const dataJson = {
        supplier_id: data.supplier_id,
        distributor_id: this.id_local,
        message: event
      }
      this.messagesAPIService.sentMessageDist(JSON.stringify(dataJson)).subscribe(res => {
        this.contact_id = res.response_data[0].geeesy_contact_id;
        this.getMessagesList();
        console.log(this.contact_id);
      })
    }
  }

  uploadFile(files, data) {
    this.message = files[0].name;
    this.imagePath = files[0];

    console.log(files, data);
    this.upload(data)

  }

  upload(data) {
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
        if (data.status == false) {
          this.sendMessagesFile(this.uploadData.file_url, data)
        } else {
          this.sentSubmitFile(this.uploadData.file_url, data)
        }

      })

    })
  }

  sendMessagesFile(file, data) {

    data.strMessages = "";
    this.messages = data.data;
    console.log(this.messages);
    this.messages.push({
      text_type_id: 1,
      text_detail: this.message,
      text_time: (new Date()).getTime() / 1000,
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
      console.log(res);
    })
  }

  sentSubmitFile(file: any, data) {
    console.log('file', file, data);

    this.strFilter = "";
    this.filterName("");

    data.status = false;
    data.strMessages = "";
    this.messages = data.data;
    this.messages.push({
      text_type_id: 1,
      text_detail: file,
      text_time: (new Date()).getTime() / 1000,
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
    console.log('messages', this.messages);
    const dataJson = {
      supplier_id: this.arrSuppler.supplier_id,
      distributor_id: this.id_local,
      message: this.message,
      attachment_url: file
    }
    this.messagesAPIService.sentMessageDist(JSON.stringify(dataJson)).subscribe(res => {
      this.contact_id = res.response_data[0].geeesy_contact_id;
      this.getMessagesList();
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



  openForm() {
    this.loading = true;
    this.getMessagesList();
    document.getElementById("myForm").style.display = "block";
    document.getElementById("myButton").style.display = "none";

  }

  closeForm() {
    document.getElementById("myForm").style.display = "none";
    document.getElementById("myButton").style.display = "block";

  }

  openChat(data) {
    // tslint:disable-next-line: triple-equals
    if (data.isOpen == true) {
      data.isOpen = false;
    } else {
      data.isOpen = true;
    }
  }

  closeChat(i) {
    this.arrputData.splice(i, 1);
    // tslint:disable-next-line: triple-equals
  }

  openUrl(url: string) {
    console.log(url);

    window.open(url, "_blank");
  }




}

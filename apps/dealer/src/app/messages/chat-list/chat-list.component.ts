import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SupplierAPIService, MessagesAPIService, UploadAPIService, BrowseSupplierAPIService } from '@project/services';

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
  arrName: any = [];
  messages: any[] = [];
  strStatus = false;
  strTitle = "Messages";
  arrContact: any = [];
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
  isChat: boolean

  id_local: string;


  constructor(
    private uploadAPIService: UploadAPIService,
    private messagesAPIService: MessagesAPIService,
    private supplierAPIService: SupplierAPIService,
    private browseSupplierAPIService: BrowseSupplierAPIService
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);

  }

  ngOnInit() {
    // this.getMessagesList();
  }

  filterName(value: any) {
    if (value) {
      this.strStatus = true;
      this.getName(value);
    }
    else {
      this.strStatus = false;
      this.getMessagesList();
    }
  }

  getName(value: any) {
    const valueName = 'cur_page=' + 1 + '&per_page=' + 10 + '&search_text=' + value;
    this.browseSupplierAPIService.getNameDist(valueName).subscribe(data => {
      console.log(data.response_data);
      this.arrName = data.response_data;

    })
  }


  getMessagesList() {
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&dealer_id=" + this.id_local;
    this.messagesAPIService.getContactListDealer(value).subscribe(data => {
      this.arrMessagseList = data.response_data;
      this.arrMessagseList.forEach(element => {
        element.distributor_data_array.forEach(d => {
          element.distributor_name = d.distributor_name;
        });

      });
      this.arrMessagseListFilter = this.arrMessagseList;
      console.log(this.arrMessagseList);
    })
  }


  //reply
  btnMessagesClick(ID, data) {
    console.log('data', data);

    //data
    this.contact_id = ID;
    this.arrDealer = data.dealer_data_array[0];
    this.arrDistributor = data.distributor_data_array[0];
    this.strTitle = data.distributor_data_array[0].distributor_name;
    this.getMessagesDetail(ID)

  }

  getMessagesDetail(ID) {
    this.messagesAPIService.getContactDetaiiltDealer(ID).subscribe(data => {
      this.messages = data.response_data[0].contact_text_array;
      this.checkFile();
      this.putData();
    })

  }



  putData() {
    this.arrputData.push({
      data: this.messages,
      name: this.strTitle,
      nameDist: this.arrDistributor.distributor_name,
      imgDist: this.arrDistributor.distributor_image_url,
      nameDealer: this.arrDealer.dealer_name,
      imgDealer: this.arrDealer.dealer_image_url,
      geeesy_contact_id: this.contact_id,
      status: false,
      isOpen: true
    });

    const array = this.arrputData;
    const arrayNew = new Map(array.map(obj => [obj.geeesy_contact_id, obj]));
    const arrayNews = Array.from(arrayNew.values());
    this.arrputData = arrayNews;
    console.log("push", this.arrputData);
  }


  sendMessage(event: any, data) {

    console.log('arrMessagseList', this.arrMessagseList);

    data.strMessages = "";
    this.messages = data.data;
    this.messages.push({
      text_detail: event,
      text_time: (new Date()).getTime() / 1000,
      isUpload: 'no file',
      dealer_data_array: [
        {
          dealer_name: this.arrMessagseList[0].dealer_data_array[0].dealer_name,
          dealer_image_url: this.arrMessagseList[0].dealer_data_array[0].dealer_image_url,
        }
      ],
      supplier_data_array: [],
      distributor_data_array: []
    });
    this.checkFile()

    const dataJson = {
      geeesy_contact_id: this.contact_id,
      dealer_id: this.id_local,
      message: event
    }
    this.messagesAPIService.addReplytDealer(JSON.stringify(dataJson)).subscribe(res => {
      console.log(res);
    })


  }

  //Submit
  btnMessagesSubmitClick(data) {
    console.log(data);
    this.arrDistributor = data;
    this.strTitle = data.distributor_name;
    this.putSubmitData();
  }

  putSubmitData() {
    this.arrputData.push({
      data: [],
      name: this.strTitle,
      distributor_id: this.arrDistributor.distributor_id,
      // nameDealer: this.arrMessagseList[0].dealer_data_array[0].dealer_name,
      // imgDealer: this.arrMessagseList[0].dealer_data_array[0].dealer_image_url,
      status: true,
      isOpen: true
    });
    const array = this.arrputData;
    const arrayNew = new Map(array.map(obj => [obj.distributor_id, obj]));
    const arrayNews = Array.from(arrayNew.values());
    this.arrputData = arrayNews;
    console.log("push", this.arrputData);
  }

  sentSubmitMessages(event: any, data) {
    console.log('2', event, data);

    data.status = false;
    data.strMessages = "";
    this.messages = data.data;
    this.messages.push({
      text_detail: event,
      text_time: (new Date()).getTime() / 1000,
      isUpload: 'no file',
      text_type_id: 2,
      dealer_data_array: [
        {
          dealer_name: this.arrMessagseList[0].dealer_data_array[0].dealer_name,
          dealer_image_url: this.arrMessagseList[0].dealer_data_array[0].dealer_image_url,
        }
      ],
      supplier_data_array: [],
      distributor_data_array: []

    });
    console.log(this.arrputData);
    this.checkFile()
    const dataJson = {
      dealer_id: this.id_local,
      distributor_id: data.distributor_id,
      message: event
    }
    this.messagesAPIService.addMessageSubmittDealer(JSON.stringify(dataJson)).subscribe(res => {
      this.contact_id = res.response_data[0].geeesy_contact_id;
      console.log(this.contact_id);
    })
  }


  uploadFile(files, data) {
    this.message = files[0].name;
    this.imagePath = files[0];
    this.upload(data)

  }

  upload(data) {
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
      text_detail: this.message,
      text_time: (new Date()).getTime() / 1000,
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


    console.log('dataJson', dataJson);

    this.messagesAPIService.addReplytDealer(JSON.stringify(dataJson)).subscribe(res => {
    })

  }

  sentSubmitFile(file: any, data) {
    console.log('file', file, data);

    data.strMessages = "";
    this.messages = data.data;
    this.messages.push({
      text_type_id: 2,
      text_detail: this.message,
      text_time: (new Date()).getTime() / 1000,
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
    const dataJson = {
      dealer_id: this.id_local,
      distributor_id: this.arrDistributor.distributor_id,
      message: this.message,
      attachment_url: file
    }
    this.messagesAPIService.addMessageSubmittDealer(JSON.stringify(dataJson)).subscribe(res => {
      this.contact_id = res.response_data[0].geeesy_contact_id;
    })
  }

  checkFile() {
    this.messages.sort((a, b) => a.text_time - b.text_time);
    // for (let index = 0; index < this.messages.length; index++) {
    //   if (this.messages[index].text_detail.match(/.(jpg|jpeg|png|gif|svg)$/i)) {
    //     this.messages[index].isUpload = 'img';
    //   }
    //   else if (this.messages[index].text_detail.match(/.(PDF)$/i)) {
    //     this.messages[index].isUpload = 'PDF';
    //   }
    //   else if (this.messages[index].text_detail.match(/.(xltx)$/i)) {
    //     this.messages[index].isUpload = 'xltx';
    //   }
    //   else {
    //     this.messages[index].isUpload = 'no file';
    //   }
    // }
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

import { Component, OnInit } from '@angular/core';
import { SupplierAPIService, MessagesAPIService, UploadAPIService, BrowseSupplierAPIService } from '@project/services';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'project-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  private UrlRouter_Message = "messages/list";

  arrMessagseList: any = [];
  arrMessagseListFilter: any = [];
  arrOrder: any = [];
  arrSupply: any = [];
  arrOrderFilter: any = [];
  messages: any[] = [];
  arrName: any = [];
  strTitle = "Messages";
  arrContact: any = [];
  arrSuppler: any = [];
  arrDistributor: any = [];
  strMessages: string;
  contact_id: number;
  imagePath: any = [];
  uploadData: any = [];
  filter: any = [];
  imgURL: any;
  public message = "No File chosen";
  arrputData: any = [];
  idCheck: any = [];
  strStatus = false;
  loading = false;
  strFilter: string;
  id_local: string;
  id: number;
  name: string;

  constructor(
    private uploadAPIService: UploadAPIService,
    private messagesAPIService: MessagesAPIService,
    private browseSupplierAPIService: BrowseSupplierAPIService,
    private supplierAPIService: SupplierAPIService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
  }

  ngOnInit() {
    // this.getMessagesList();
    const value = this.id_local;
    this.supplierAPIService.getSupID(value).subscribe(res => {
      this.arrSupply = res.response_data[0];

      if (this.arrSupply) {
        const params = this.route.snapshot.paramMap;
        this.id = +params.get("id");
        this.name = params.get("name");
        if (this.name) {
          const data = {
            distributor_name: this.name,
            distributor_id:  this.id
          }
          
          this.loading = true;
          this.getMessagesList();
          document.getElementById("myForm").style.display = "block";
          document.getElementById("myButton").style.display = "none";
          this.btnMessagesSubmitClick(data)
        }
      }

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

  getMessagesList() {
    this.loading = true;
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&supplier_id=" + this.id_local;
    this.messagesAPIService.getContactListSup(value).subscribe(data => {
      this.arrMessagseList = data.response_data;
      this.arrMessagseList.forEach(element => {
        element.distributor_data_array.forEach(d => {
          element.distributor_name = d.distributor_name;
        });

      });
      this.arrMessagseListFilter = this.arrMessagseList;
      console.log(this.arrMessagseList);
      this.loading = false;
    })
  }

  getSupplierName(value: any) {

    const valueName = 'cur_page=' + 1 + '&per_page=' + 10 + '&search_text=' + value + "&supplier_id=" + this.id_local;
    this.browseSupplierAPIService.getNameDist(valueName).subscribe(data => {
      this.arrName = data.response_data;
      console.log(' this.arrNames', this.arrName);
    })
  }

  btnMessagesClick(ID, data) {
    //data
    this.contact_id = ID;
    this.arrSuppler = data.supplier_data_array[0];
    this.arrDistributor = data.distributor_data_array[0];
    this.strTitle = data.distributor_data_array[0].distributor_name;
    this.getMessagesDetail(ID)

  }

  getMessagesDetail(ID) {
    this.messagesAPIService.getContactDetaiilSup(ID).subscribe(data => {
      this.messages = data.response_data[0].contact_text_array;
      this.checkFile();
      this.putData();
    })

  }

  putData() {
    this.arrputData.push({
      data: this.messages,
      name: this.strTitle.length < 20 ? this.strTitle : this.strTitle.substr(0, 21) + "...",
      nameDist: this.arrDistributor.distributor_name,
      imgDist: this.arrDistributor.distributor_image_url,
      nameSup: this.arrSuppler.supplier_name,
      imgSup: this.arrSuppler.supplier_image_url,
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

    if (event !== "") {
      data.strMessages = "";
      this.messages = data.data;
      this.messages.push({
        text_type_id: 2,
        text_detail: event,
        text_time: (new Date()).getTime() / 1000,
        isUpload: 'no file',
        dealer_data_array: [],
        supplier_data_array: [{
          supplier_name: this.arrSupply.supplier_name,
          supplier_image_url: this.arrSupply.supplier_image_url,
        }],
        distributor_data_array: []
      });
      this.checkFile();
      const dataJson = {
        geeesy_contact_id: this.contact_id,
        supplier_id: this.id_local,
        message: event
      }
      this.messagesAPIService.addReplySup(JSON.stringify(dataJson)).subscribe(res => {
        console.log(res);
      })
    }


  }

  btnMessagesSubmitClick(data) {
    console.log(data);
    this.strFilter = "";
    this.filterName("");

    this.arrDistributor = data;
    this.strTitle = data.distributor_name;
    this.putSubmitData();
  }

  putSubmitData() {
    this.arrputData.push({
      data: [],
      name: this.strTitle.length < 20 ? this.strTitle : this.strTitle.substr(0, 21) + "...",
      distributor_id: this.arrDistributor.distributor_id,
      nameDist: "you",
      imgDist: "",
      status: true,
      isOpen: true
    });
    const array = this.arrputData;
    const arrayNew = new Map(array.map(obj => [obj.distributor_id, obj]));
    const arrayNews = Array.from(arrayNew.values());
    this.arrputData = arrayNews;
    console.log("push", this.arrputData);
    if (this.name) {
      this.sentSubmitMessages("Hello", this.arrputData[0])
    }
  }

  sentSubmitMessages(event: any, data) {

    console.log('2', event, data);
    if (event !== "") {
      data.status = false;
      data.strMessages = "";
      this.messages = data.data;
      this.messages.push({
        text_type_id: 2,
        text_detail: event,
        text_time: (new Date()).getTime() / 1000,
        isUpload: 'no file',
        dealer_data_array: [],
        supplier_data_array: [{
          supplier_name: this.arrSupply.supplier_name,
          supplier_image_url: this.arrSupply.supplier_image_url,
        }],
        distributor_data_array: []

      });
      this.checkFile();
      console.log(this.arrputData);
      const dataJson = {
        supplier_id: this.id_local,
        distributor_id: data.distributor_id,
        message: event
      }
      this.messagesAPIService.addMessageSubmitSup(JSON.stringify(dataJson)).subscribe(res => {
        this.contact_id = res.response_data[0].geeesy_contact_id;
        console.log(this.contact_id);
        this.getMessagesList();
        // if (this.name) {
          // this.router.navigate([this.UrlRouter_Message]);
        // }
      })
    }

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

  }

  uploadFile(files, data) {
    this.message = files[0].name;
    this.imagePath = files[0];
    this.upload(data)
  }

  upload(data) {
    const dataJson = {
      type_id: 160,
      file_name: this.imagePath.name,
      file_type: this.imagePath.type,
      supplier_id: this.id_local,
      distributor_id: 0
    }

    this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
      this.uploadData = res.response_data[0];

      this.uploadAPIService.uploadPut(this.uploadData.file_upload_url, this.imagePath).subscribe(res1 => {

        // tslint:disable-next-line: triple-equals
        if (data.status == false) {
          this.sendMessageFile(this.uploadData.file_url, data)
        } else {
          this.sentSubmitFile(this.uploadData.file_url, data)
        }

      })

    })
  }

  sendMessageFile(file: any, data) {
    data.strMessages = "";
    this.messages = data.data;
    this.messages.push({
      text_type_id: 2,
      text_detail: file,
      text_time: (new Date()).getTime() / 1000,
      dealer_data_array: [],
      text_extra_attachment: [{
        file_url: file
      }],
      supplier_data_array: [{
        supplier_name: this.arrSuppler.supplier_name,
        supplier_image_url: this.arrSuppler.supplier_image_url,
      }],
      distributor_data_array: []
    });
    this.checkFile();
    console.log(this.messages);


    const dataJson = {
      geeesy_contact_id: this.contact_id,
      supplier_id: this.id_local,
      message: file,
      attachment_url: file
    }
    this.messagesAPIService.addReplySup(JSON.stringify(dataJson)).subscribe(res => {
      console.log(res);
    })


  }

  sentSubmitFile(file, data) {
    console.log('2', file, data);

    data.status = false;
    data.strMessages = "";
    this.messages = data.data;
    this.messages.push({
      text_type_id: 2,
      text_detail: file,
      text_time: (new Date()).getTime() / 1000,
      dealer_data_array: [],
      text_extra_attachment: [{
        file_url: file
      }],
      supplier_data_array: [{
        supplier_name: this.arrSuppler.supplier_name,
        supplier_image_url: this.arrSuppler.supplier_image_url,
      }],
      distributor_data_array: []
    });
    this.checkFile();
    console.log(this.arrputData);
    const dataJson = {
      supplier_id: this.id_local,
      distributor_id: data.distributor_id,
      message: file,
      attachment_url: file
    }
    this.messagesAPIService.addMessageSubmitSup(JSON.stringify(dataJson)).subscribe(res => {
      this.contact_id = res.response_data[0].geeesy_contact_id;
      this.getMessagesList();
      console.log(this.contact_id);
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

  openUrl(url: string) {
    console.log(url);
    window.open(url, "_blank");
  }



}

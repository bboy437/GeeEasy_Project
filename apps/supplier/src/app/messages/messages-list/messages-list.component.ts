import { Component, OnInit } from '@angular/core';
import { MessagesAPIService, UploadAPIService, BrowseSupplierAPIService, SupplierAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';


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
  arrSuppler: any = [];
  strTitle = "Messages";
  strMessages: string;
  contact_id: number;
  isStatus = false;
  imagePath: any = [];
  uploadData: any = [];
  arrName: any = [];
  arrSupply: any = [];
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
    private route: ActivatedRoute,
    private browseSupplierAPIService: BrowseSupplierAPIService,
    private supplierAPIService: SupplierAPIService,

  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {

    const value = this.id_local;
    this.supplierAPIService.getSupID(value).subscribe(res => {
      this.arrSupply = res.response_data[0];
    })
    const name = this.route.snapshot.queryParamMap.get('filterBy');
    if (name === null) {
      console.log('a', name);
      this.getMessagesList();
    } else {
      console.log('b', name);
      this.strname = name;
      this.filterName(name);
    }


  }


  filterName(value: any) {
    if (value) {
      this.loading = true;
      this.strStatus = true;
      this.getDistributorName(value);
    }
    else {
      this.loading = true;
      this.strStatus = false;
      this.getMessagesList();
    }
    console.log(this.strStatus);

  }

  getMessagesList() {
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

  getDistributorName(value: any) {

    const valueName = 'cur_page=' + 1 + '&per_page=' + 10 + '&search_text=' + value + "&supplier_id=" + this.id_local;
    this.browseSupplierAPIService.getNameDist(valueName).subscribe(data => {
      this.arrName = data.response_data;
      console.log(' this.arrNames', this.arrName);
      this.loading = false;
    })
  }


  btnMessagesClick(ID, data) {
    //data
    this.messages = [];
    this.loading1 = true;
    this.contact_id = ID;
    this.arrSuppler = data.supplier_data_array[0];
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

    if (event !== "") {
      this.strMessages = "";
      console.log(this.messages);
      this.messages.push({
        text_type_id: 2,
        text_detail: event,
        create_time: (new Date()).getTime() / 1000,
        isUpload: 'no file',
        icon: '',
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


    this.arrDistributor = data;
    this.isStatus = true;
    this.strTitle = data.distributor_name;
    this.messages = [];
  }

  sentSubmitMessages(event: any) {
    if (event !== "") {
      this.strMessages = "";
      this.messages.push({
        text_type_id: 2,
        text_detail: event,
        create_time: (new Date()).getTime() / 1000,
        isUpload: 'no file',
        icon: '',
        dealer_data_array: [],
        supplier_data_array: [{
          supplier_name: this.arrSupply.supplier_name,
          supplier_image_url: this.arrSupply.supplier_image_url,
        }],
        distributor_data_array: []
      });
      this.checkFile();
      console.log(this.messages);
      const dataJson = {
        supplier_id: this.id_local,
        distributor_id: this.arrDistributor.distributor_id,
        message: event
      }
      console.log(dataJson);


      this.messagesAPIService.addMessageSubmitSup(JSON.stringify(dataJson)).subscribe(res => {
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
      text_type_id: 2,
      text_detail: file,
      create_time: (new Date()).getTime() / 1000,
      dealer_data_array: [],
      text_extra_attachment: [{
        file_url: file
      }],
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
      message: this.message,
      attachment_url: file
    }

    this.messagesAPIService.addReplySup(JSON.stringify(dataJson)).subscribe(res => {
      this.checkFile();
    })

  }

  sentSubmitFile(file: any) {
    this.strname = "";
    this.filterName("");

    this.strMessages = "";
    this.strStatus = false;
    this.messages.push({
      text_type_id: 2,
      text_detail: file,
      create_time: (new Date()).getTime() / 1000,
      dealer_data_array: [],
      text_extra_attachment: [{
        file_url: file
      }],
      supplier_data_array: [{
        supplier_name: this.arrSupply.supplier_name,
        supplier_image_url: this.arrSupply.supplier_image_url,
      }],
      distributor_data_array: []
    });
    this.checkFile();
    console.log(this.messages);
    console.log(file);
    const dataJson = {
      supplier_id: this.id_local,
      distributor_id: this.arrDistributor.distributor_id,
      message: this.message,
      attachment_url: file

    }
    console.log(dataJson);
    this.messagesAPIService.addMessageSubmitSup(JSON.stringify(dataJson)).subscribe(res => {
      this.contact_id = res.response_data[0].geeesy_contact_id;
      console.log(this.contact_id);
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









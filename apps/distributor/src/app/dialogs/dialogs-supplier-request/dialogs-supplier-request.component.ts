import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SupplierAPIService, UploadAPIService } from '@project/services';
import { Router } from '@angular/router';
import { NewFolderComponent } from '../new-folder/new-folder.component';

@Component({
  selector: 'project-dialogs-supplier-request',
  templateUrl: './dialogs-supplier-request.component.html',
  styleUrls: ['./dialogs-supplier-request.component.scss']
})
export class DialogsSupplierRequestComponent implements OnInit {

  @Input() data: any;
  arrobjRow: any = {};
  RequestForm: FormGroup;
  submitted = false;
  isfilesName: string;
  strStatus: number;
  arrFileList: any = [];
  imagePath: any = [];
  uploadData: any = [];
  arrAttachment: any = [];
  imgURL: any;
  public message = "No File chosen";
  idCheck: any = [];
  loading = false;
  ischeckedAll = false;
  isSaveLodding = false;

  arrFileListFile: any = [];
  arrFileListFile1: any = [];
  name1 = "";
  name2 = "";


  id_local: string;

  constructor(
    private supplierAPIService: SupplierAPIService,
    private formBuilder: FormBuilder,
    protected ref: NbDialogRef<DialogsSupplierRequestComponent>,
    private uploadAPIService: UploadAPIService,

  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {
    console.log(this.data);
    this.buildForm();
    this.getFileList();
  }

  buildForm() {
    this.RequestForm = this.formBuilder.group({
      massage: ['', Validators.required],
      // multiproperty: []
    });
  }

  get f() { return this.RequestForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.RequestForm.invalid) {
      return;
    }
  }


  btnSaveClick() {
    this.submitted = true;
    if (this.RequestForm.invalid) {
      return;
    }

    this.isSaveLodding = true;
    const param_file = [];
    console.log('arrAttachment', this.arrAttachment);
    const param_file_list = this.arrFileListFile1.filter((x) => x.ischecked === true);
    console.log('param_file_list', param_file_list);


    for (let index = 0; index < param_file_list.length; index++) {
      param_file.push({
        file_name: param_file_list[index].file_name,
        file_url: param_file_list[index].file_url,

      });
    }
    console.log('param_file', param_file);

    this.save(param_file)
  }

  save(param_file) {
    const dataJson = {
      distributor_id: this.id_local,
      supplier_id: this.data.supplier_id,
      message: this.RequestForm.value.massage,
      attachment_array: param_file
    }
    console.log(dataJson);


    this.supplierAPIService.addRequest(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
      this.isSaveLodding = false;
      this.ref.close('ok');
    })

  }


  btnCancelClick(): void {
    this.ref.close();
  }

  getFileList() {
    this.loading = true;
    this.arrFileListFile = [];
    this.arrFileListFile1 = [];
    this.name1 = "";
    this.name2 = "";
    this.uploadAPIService.getS3List().subscribe(data => {
      console.log('data: folder', data.response_data);
      this.arrFileList = data.response_data;
      this.arrFileList.forEach(element => {
        if (element.folder_name === 'distributor') {
          element.folder_name = 'Your File';
        }
      });
      this.loading = false;
    })
  }

  // getS3fileList() {
  //   const value = "id=" + "13356"
  //   this.uploadAPIService.getS3FileList(value).subscribe(data => {
  //     this.arrFileListFile = data.response_data;
  //     console.log('data: file', data.response_data);
  //   })
  // }

  folder1(name) {
    this.loading = true;

    this.name1 = name;
    this.arrFileList = [];
    this.arrFileListFile1 = [];
    this.name2 = "";
    const value = name === 'Your File' ? 'distributor' : name
    console.log('value', value);

    this.uploadAPIService.getS3FileList(value + "?id=" + this.id_local).subscribe(data => {
      this.arrFileListFile = data.response_data;
      console.log('data: file', data.response_data);
      this.loading = false;
    })
  }

  folder2(name, data) {
    this.loading = true;
    console.log('data: file', data);
    this.name2 = name;
    this.arrFileList = [];
    this.arrFileListFile = [];
    this.arrFileListFile1 = data;

    this.arrFileListFile1.forEach(element => {
      element.ischecked = false;
    });
    this.loading = false;

  }

  allFileIsActive(file, callbacl) {
    let status = true;
    file.forEach(item => {
      if (!item.ischecked)
        status = false;
    });
    callbacl(status);
  }

  toggle(checked: boolean, data: any, i) {
    this.ischeckedAll = false;

    if (checked) {
      data.ischecked = false;
      setTimeout(() => {
        this.allFileIsActive(this.arrFileListFile1, res => {
          console.log('res', res);
          if (res)
            this.ischeckedAll = true;
        })
      }, 0);

    } else {
      data.ischecked = true;
      setTimeout(() => {
        this.allFileIsActive(this.arrFileListFile1, res => {
          console.log('res', res);
          if (res)
            this.ischeckedAll = true;
        })
      }, 0);
    }
    console.log(this.arrFileListFile1);
  }

  toggleAll() {
    this.arrAttachment = [];
    if (this.ischeckedAll) {
      this.ischeckedAll = false;
      this.arrFileListFile1.forEach(element => {
        element.ischecked = false;
      });
      this.arrAttachment = [];
    } else {
      this.ischeckedAll = true;
      this.arrFileListFile1.forEach(element => {
        element.ischecked = true;
      });
      this.arrAttachment = this.arrFileListFile1;
    }
    console.log(this.arrAttachment);
    console.log(this.arrFileListFile1);
  }



  openUrl(url: string) {
    window.open(url, "_blank");
  }





  // getFileList() {
  //   this.name1 = "";
  //   const value = "cur_page=" + 1 + "&per_page=" + 20 + "&distributor_id=" + this.id_local + "&supplier_id=" + 0 + "&view_id=" + 1 + "&file_row_parent_id=" + 0;
  //   this.uploadAPIService.getFileList(value).subscribe(data => {
  //     this.arrFileList = data.response_data;
  //     console.log(this.arrFileList);
  //     this.checkFile();
  //   })
  // }

  // checkFile() {
  //   for (let index = 0; index < this.arrFileList.length; index++) {
  //     if (this.arrFileList[index].file_row_title.match(/.(jpg|jpeg|png|gif)$/i)) {
  //       this.arrFileList[index].isUpload = 'img';
  //     }
  //     else if (this.arrFileList[index].file_row_title.match(/.(PDF)$/i)) {
  //       this.arrFileList[index].isUpload = 'PDF';
  //     }
  //     else if (this.arrFileList[index].file_row_title.match(/.(xltx)$/i)) {
  //       this.arrFileList[index].isUpload = 'xltx';
  //     }
  //     else {
  //       this.arrFileList[index].isUpload = 'no file';
  //     }

  //   }
  // }

  // folder1(id, name) {
  //   this.name1 = name;
  //   const value = "cur_page=" + 1 + "&per_page=" + 20 + "&distributor_id=" + this.id_local + "&supplier_id=" + 0 + "&view_id=" + 1 + "&file_row_parent_id=" + id;
  //   this.uploadAPIService.getFileList(value).subscribe(data => {
  //     this.arrFileList = data.response_data;
  //     console.log(this.arrFileList);
  //     this.checkFile();
  //   })

  // }


  // toggle(checked: boolean, data: any, i) {

  //   const position = this.idCheck.indexOf(data.file_row_id);
  //   if (position === -1) {
  //     // nodata => push
  //     this.idCheck.push(data.file_row_id);
  //     this.arrAttachment.push(data);
  //   } else {
  //     // data => delete
  //     this.arrAttachment.splice(position, 1);
  //     this.idCheck.splice(position, 1);
  //   }

  // }


}

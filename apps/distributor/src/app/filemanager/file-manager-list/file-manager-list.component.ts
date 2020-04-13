import { Component, OnInit } from '@angular/core';

import * as Uppy from '@uppy/core/lib';
import * as Dashboard from '@uppy/dashboard';
import * as AwsS3 from '@uppy/aws-s3';

import { UploadAPIService } from '@project/services';
import { NewFolderComponent } from '../../dialogs/new-folder/new-folder.component';
import { NbDialogService } from '@nebular/theme';


@Component({
  selector: 'project-file-manager-list',
  templateUrl: './file-manager-list.component.html',
  styleUrls: ['./file-manager-list.component.scss']
})
export class FileManagerListComponent implements OnInit {
  arrFileList: any = [];
  arrFileListFile: any = [];
  arrFileListFile1: any = [];
  imagePath: any = [];
  uploadData: any = [];
  imgURL: any;
  public message = "No File chosen";
  name1 = "";
  name2 = "";
  strStatus = '200';
  loading = false;


  id_local: string;

  constructor(
    private uploadAPIService: UploadAPIService,
    private dialogService: NbDialogService
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {

    // this.getFileList();
    this.getS3file();
    // this.getS3fileList();
    this.uppy()

  }

  uppy() {

    const uppy = Uppy({
      id: 'uppy',
      autoProceed: false,
      allowMultipleUploads: true,
      debug: false,
      restrictions: {
        maxFileSize: null,
        maxNumberOfFiles: null,
        minNumberOfFiles: null,
        allowedFileTypes: null
      },
      meta: {},

    })

    uppy.use(Dashboard, {
      trigger: '#uppy-select-files',
      inline: true,
      target: '.DashboardContainer',
      replaceTargetContent: true,
      showProgressDetails: true,
      note: 'Images and video only, 2–3 files, up to 1 MB',
      maxHeight: 450,
      metaFields: [
        { id: 'name', name: 'Name', placeholder: 'file name' },
        { id: 'license', name: 'License', placeholder: 'specify license' },
        { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' }
      ]
    })

    // uppy.use(GoogleDrive, {
    //   target: Dashboard,
    //   companionUrl: 'https://companion.uppy.io/',
    // })
    // uppy.use(Dropbox, {
    //   target: Dashboard,
    //   companionUrl: 'https://companion.uppy.io/',
    // })

    // uppy.use(Instagram, {
    //   target: Dashboard,
    //   companionUrl: 'https://companion.uppy.io/',
    // })

    // uppy.use(Webcam, {
    //   target: Dashboard,
    //   onBeforeSnapshot: () => Promise.resolve(),
    //   countdown: false,
    //   modes: [
    //     'video-audio',
    //     'video-only',
    //     'audio-only',
    //     'picture'
    //   ],
    //   mirror: true,
    //   facingMode: 'user',
    //   locale: {}
    // })


    // uppy.use(Tus, {
    //   endpoint: 'https://master.tus.io/files/', // use your tus endpoint here
    //   resume: true,
    //   autoRetry: true,
    //   retryDelays: [0, 1000, 3000, 5000]
    // })
    // uppy.use(RestoreFiles, {
    //   serviceWorker: true,
    //   indexedDB: {
    //     maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB => Each file
    //     maxTotalSize: 1024 * 1024 * 1024 * 1024 // 1 TB
    //   }
    // })
    //   .run();


    uppy.use(AwsS3, {
      getUploadParameters(file) {

        //@ts-ignore
        const fTypeId = document.getElementById('fTypeId').value;
        //const fTypeId = this.strStatus;
        // tslint:disable-next-line: triple-equals
        const distributor_id = localStorage.getItem('id');
        console.log('fTypeId', fTypeId);
        console.log('distributor_id', distributor_id);
        // tslint:disable-next-line: triple-equals
        if (fTypeId == "") {
          window.alert('You must select a folder name.');
          return;
        }
        const url = "https://api.gee-supply.com/v1/server/document/endpoint_by_type";
        const data_send = {
          'type_id': fTypeId,
          'file_name': file.name,
          'file_type': file.type,
          'supplier_id': 0,
          'distributor_id': distributor_id,
          'uppy': 1
        };

        console.log('data_send', data_send);
        // this.getS3file()

        // Send a request to our PHP signing endpoint.
        return fetch(url, {
          method: 'post',
          // Send and receive JSON.
          headers: { 'content-type': 'text/plain' },
          body: JSON.stringify(data_send)
        }).then((response) => {
          // Parse the JSON response.
          return response.json()
        }).then((data) => {
          // Return an object in the correct shape.
          return {
            method: data.method,
            url: data.url,
            fields: data.fields,
            headers: data.headers
          }
        });

        this.getS3file()
      }
    })
  }

  typeID(event) {
    this.strStatus = event;
  }



  getS3file() {
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
    this.name2 = name;
    this.arrFileList = [];
    this.arrFileListFile = [];
    this.arrFileListFile1 = data;
    this.loading = false;

  }

  openUrl(url: string) {
    window.open(url, "_blank");
  }


  preview(files) {

    this.message = files.target.files[0].name;
    this.imagePath = files.target.files[0];
    console.log(this.imagePath);


    this.upload()
  }


  upload() {
    const dataJson = {
      type_id: 400,
      file_name: this.imagePath.name,
      file_type: this.imagePath.type,
      supplier_id: 13356,
      distributor_id: 0
    }

    this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
      console.log(res);
      this.uploadData = res.response_data[0];

      this.uploadAPIService.uploadPut(this.uploadData.file_upload_url, this.imagePath).subscribe(res1 => {
        console.log(res1);
        // this.arrobjRow.supplier_image_url = this.uploadData.file_url;
        // console.log(this.arrobjRow.supplier_image_url);
        this.createDoc();
        this.checkFile();
      })

    })
  }

  checkFile() {
    for (let index = 0; index < this.arrFileList.length; index++) {
      if (this.arrFileList[index].file_row_title.match(/.(jpg|jpeg|png|gif)$/i)) {
        this.arrFileList[index].isUpload = 'img';
      }
      else if (this.arrFileList[index].file_row_title.match(/.(PDF)$/i)) {
        this.arrFileList[index].isUpload = 'PDF';
      }
      else if (this.arrFileList[index].file_row_title.match(/.(xltx)$/i)) {
        this.arrFileList[index].isUpload = 'xltx';
      }
      else {
        this.arrFileList[index].isUpload = 'no file';
      }

    }

  }


  createDoc() {
    const dataJson = {
      distributor_id: this.id_local,
      supplier_id: 0,
      file_name: this.message,
      file_url: this.uploadData.file_url,
      file_note: "",
      view_id: 1,
      file_row_type_id: 2,
      file_row_parent_id: 0
    }
    this.uploadAPIService.addDoc(JSON.stringify(dataJson)).subscribe(data => {
      console.log('data', data);
      // this.getFileList();
    })
  }

  btnFolder() {
    const dialogRef = this.dialogService.open(NewFolderComponent, {

    });

    dialogRef.onClose.subscribe(result => {
      if (result) {
        const dataJson = {
          distributor_id: this.id_local,
          supplier_id: 0,
          file_name: result,
          file_url: "",
          file_note: "note",
          view_id: 1,
          file_row_type_id: 1,
          file_row_parent_id: 0
        }
        this.uploadAPIService.addDoc(JSON.stringify(dataJson)).subscribe(data => {
          console.log(data);
          // this.getFileList();
        })
      }

    });

  }




}


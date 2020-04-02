import { Component, OnInit, Input } from '@angular/core';
import { UploadAPIService, TeamAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { DialogsCancelComponent } from '../dialogs-cancel/dialogs-cancel.component';


@Component({
  selector: 'project-dialogs-team-create',
  templateUrl: './dialogs-team-create.component.html',
  styleUrls: ['./dialogs-team-create.component.scss']
})
export class DialogsTeamCreateComponent implements OnInit {
  @Input() RowID: string;
  @Input() status: string;
  @Input() group_id_group: string;
  @Input() group_name: string;
  private UrlRouter_List = "team/myteam/list";
  private UrlRouter_Detail = "team/myteam/detail";
  Form: FormGroup;
  submitted = false;
  arrobjRow: any = [];
  arrTeam: any = [];
  isValidatorsCity: string;
  loading = false;
  imgURL: any;
  public message = "No File chosen";
  imagePath: any = [];
  uploadData: any = [];
  imag_url: string;
  group_id: number;

  image = {
    update: false,
    main_image: {
      get: [],
      port: []
    }
  }


  id_local: string;

  constructor(
    private teamAPIService: TeamAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private uploadAPIService: UploadAPIService,
    protected ref: NbDialogRef<DialogsTeamCreateComponent>,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {

    this.Builder();
    if (this.RowID === "new") {
      this.getSeller(-1)
      this.loading = false;
    } else {
      this.teamAPIService.getTeamDetail(this.RowID).subscribe(res => {
        this.arrobjRow = res.response_data[0];
        this.imgURL = res.response_data[0].group_image_url;

        this.imag_url = res.response_data[0].group_image_url;

        if (this.arrobjRow.group_image_url !== undefined && this.arrobjRow.group_image_url !== "-" && this.arrobjRow.group_image_url !== "")
          this.uploadAPIService.uploadImage().getUrl(this.arrobjRow.group_image_url, red_image => {
            this.image.main_image.get.push(red_image);
          });

        this.group_id = this.arrobjRow.group_id;
        console.log('arrobjRow', this.arrobjRow);
        this.getSeller(-1)
      })
    }
  }

  getSeller(group_id) {
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&dealer_id=" + this.id_local + "&group_parent_id=" + 0 + "&group_id=" + group_id;
    this.teamAPIService.getTeamList(value).subscribe(data => {
      const team = data.response_data;
      for (let index = 0; index < team.length; index++) {
        if (team[index].group_id !== this.group_id) {
          this.arrTeam.push(team[index])
        }
      }
      this.arrTeam.sort((a, b) => b.create_time - a.create_time);
      console.log('arrTeam', this.arrTeam);
      if (this.RowID !== "new") {
        this.editForm();
      }

    })

  }

  Builder() {
    this.Form = this.fb.group({
      TeamName: ['', Validators.required],
      TeamLavel: ['', Validators.required],
      percent_commission: ['', Validators.required],
    });
    this.Form.get('TeamLavel').patchValue(this.group_id_group);
    this.Form.get('percent_commission').patchValue(0);
  }

  editForm() {
    this.Form.patchValue({
      TeamName: this.arrobjRow.group_name,
      percent_commission: this.arrobjRow.group_data_ref.percent_commission,
    });
    this.Form.get('TeamLavel').patchValue(this.arrobjRow.group_parent_id);
    this.loading = false;
  }


  get f() { return this.Form.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.Form.invalid) {
      return;
    }
  }



  btnSaveClick() {

    this.submitted = true;
    if (this.Form.invalid || this.image.update) {
      return;
    }


    this.image.update = true;
    const dataSend = {
      type_id: 600,
      file_name: "",
      file_type: "",
      dealer_id: this.id_local,
      user_id: 0
    };
    this.uploadAPIService.uploadImage().getImageArray(dataSend, this.image.main_image.get, red_image_array => {
      console.log('btnSaveClick : red_image_array : ', red_image_array);
      this.image.main_image.port = red_image_array;
      this.save();
    });

  }

  save() {


    if (this.RowID === "new") {
      const group_data_ref = {
        total_sales: 0,
        total_user: 0,
        percent_commission: Number(this.Form.value.percent_commission)
      }
      const dataJson = {
        dealer_id: this.id_local,
        group_parent_id: this.Form.value.TeamLavel,
        group_user_array: [],
        group_data_ref: group_data_ref,
        group_name: this.Form.value.TeamName,
        group_image_url: (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-"
      }
      console.log('dataJson', dataJson);
      this.teamAPIService.postTeam(JSON.stringify(dataJson)).subscribe(data => {
        console.log(data);
        this.ref.close('ok');
      })

    } else {
      const group_data_ref = {
        total_sales: this.arrobjRow.group_data_ref.total_sales,
        total_user: this.arrobjRow.group_data_ref.total_user,
        percent_commission: Number(this.Form.value.percent_commission),
      }
      const dataJson = {
        group_id: this.arrobjRow.group_id,
        dealer_id: this.id_local,
        group_parent_id: this.Form.value.TeamLavel,
        group_user_array: [],
        group_data_ref: group_data_ref,
        group_name: this.Form.value.TeamName,
        group_image_url: (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-"

      }

      console.log('dataJson', dataJson);
      console.log(JSON.stringify(dataJson));
      this.teamAPIService.updateTeam(JSON.stringify(dataJson)).subscribe(data => {
        console.log(data);
        this.ref.close('ok');
      })
    }

  }

  btnCancelClick() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'cancel') {
      }
      if (result === 'ok') {
        this.ref.close();
      }
    });

  }

  btnBackClick() {
    const dialogRef = this.dialogService.open(DialogsCancelComponent, {
    });

    dialogRef.onClose.subscribe(result => {
      if (result === 'cancel') {
      }
      if (result === 'ok') {
        this.ref.close();
      }
    });
  }


}




  // uploadFile(event) {
  //   if (event.length === 0)
  //     return;

  //   const mimeType = event[0].type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     this.message = "Only images are supported.";
  //     return;
  //   }
  //   const reader = new FileReader();
  //   this.message = event[0].name;
  //   this.imagePath = event[0];
  //   reader.readAsDataURL(event[0]);
  //   reader.onload = (_event) => {
  //     this.imgURL = reader.result;
  //   }
  //   console.log('imgURL', this.imgURL);

  //   this.upload()
  // }


  // upload() {
  //   const dataJson = {
  //     type_id: 600,
  //     file_name: this.imagePath.name,
  //     file_type: this.imagePath.type,
  //     dealer_id: this.id_local,
  //     distributor_id: 0
  //   }

  //   this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
  //     console.log(res);
  //     this.uploadData = res.response_data[0];
  //     this.imag_url = this.uploadData.file_url;

  //     this.uploadAPIService.uploadPut(this.uploadData.file_upload_url, this.imagePath).subscribe(res1 => {
  //       this.imag_url = this.uploadData.file_url;
  //       console.log(this.imag_url);
  //     })

  //   })

  // }

  // btnUpload() {
  //   this.uploadAPIService.uploadPut(this.uploadData.file_upload_url, this.imagePath).subscribe(res1 => {
  //     console.log(res1);
  //   })
  // }





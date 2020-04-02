import { Component, OnInit } from '@angular/core';
import { LocationAPIService, UploadAPIService, TeamAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { DialogsCancelComponent } from '../../../dialogs/dialogs-cancel/dialogs-cancel.component';


@Component({
  selector: 'project-myteam-create',
  templateUrl: './myteam-create.component.html',
  styleUrls: ['./myteam-create.component.scss']
})
export class MyteamCreateComponent implements OnInit {
  private UrlRouter_List = "team/myteam/list";
  private UrlRouter_Detail = "team/myteam/detail";
  Form: FormGroup;
  RowID: string;
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

  id_local: string;

  constructor(
    private teamAPIService: TeamAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private locationService: LocationAPIService,
    private dialogService: NbDialogService,
    private uploadAPIService: UploadAPIService,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
    this.loading = true;
  }

  ngOnInit() {

    this.Builder();
    const params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      this.RowID = params.get("id");
      if (this.RowID === "new") {
        this.getSeller(-1)
        this.loading = false;
      } else {
        this.teamAPIService.getTeamDetail(this.RowID).subscribe(res => {
          this.arrobjRow = res.response_data[0];
          this.imgURL = res.response_data[0].group_image_url;
          this.imag_url = res.response_data[0].group_image_url;
          this.group_id = this.arrobjRow.group_id;
          console.log(this.arrobjRow);
          this.getSeller(-1)
        })
      }
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
      this.arrTeam.push({
        group_id: 0,
        group_name: 'No Group',
        create_time: (new Date()).getTime() / 1000
      })
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
      total_sales: [{ value: '', disabled: true }, Validators.required],
      total_user: [{ value: '', disabled: true }, Validators.required],
      percent_commission: ['', Validators.required],
    });
    this.Form.get('TeamLavel').patchValue('0');
    this.Form.get('total_sales').patchValue(0);
    this.Form.get('total_user').patchValue(0);
    this.Form.get('percent_commission').patchValue(0);
  }

  editForm() {
    this.Form.patchValue({
      TeamName: this.arrobjRow.group_name,
      total_sales: this.arrobjRow.group_data_ref.total_sales,
      total_user: this.arrobjRow.group_data_ref.total_user,
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
    if (this.Form.invalid) {
      return;
    }
    this.save();

  }

  save() {

    if (this.RowID === "new") {
      const group_data_ref = {
        total_sales: this.Form.value.total_sales,
        total_user: this.Form.value.total_user,
        percent_commission: this.Form.value.percent_commission,
      }
      const dataJson = {
        dealer_id: this.id_local,
        group_parent_id: this.Form.value.TeamLavel,
        group_user_array: [],
        group_data_ref: group_data_ref,
        group_name: this.Form.value.TeamName,
        group_image_url: this.imag_url
      }
      console.log('dataJson', dataJson);
      this.teamAPIService.postTeam(JSON.stringify(dataJson)).subscribe(data => {
        console.log(data);
        this.router.navigate([this.UrlRouter_List]);
      })

    } else {
      const group_data_ref = {
        total_sales: this.Form.value.total_sales,
        total_user: this.Form.value.total_user,
        percent_commission: this.Form.value.percent_commission,
      }
      const dataJson = {
        group_id: this.arrobjRow.group_id,
        dealer_id: this.id_local,
        group_parent_id: this.Form.value.TeamLavel,
        group_user_array: [],
        group_data_ref: group_data_ref,
        group_name: this.Form.value.TeamName,
        group_image_url: this.imag_url

      }

      console.log(dataJson);
      console.log(JSON.stringify(dataJson));
      this.teamAPIService.updateTeam(JSON.stringify(dataJson)).subscribe(data => {
        console.log(data);
        this.router.navigate([this.UrlRouter_List]);
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
        this.router.navigate([this.UrlRouter_List]);
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
        this.router.navigate([this.UrlRouter_Detail, this.RowID]);
      }
    });
  }



  uploadFile(event) {
    if (event.length === 0)
      return;

    const mimeType = event[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    const reader = new FileReader();
    this.message = event[0].name;
    this.imagePath = event[0];
    reader.readAsDataURL(event[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
    console.log('imgURL', this.imgURL);

    this.upload()
  }


  upload() {
    const dataJson = {
      type_id: 600,
      file_name: this.imagePath.name,
      file_type: this.imagePath.type,
      dealer_id: this.id_local,
      distributor_id: 0
    }

    this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
      console.log(res);
      this.uploadData = res.response_data[0];
      this.imag_url = this.uploadData.file_url;

      this.uploadAPIService.uploadPut(this.uploadData.file_upload_url, this.imagePath).subscribe(res1 => {
        this.imag_url = this.uploadData.file_url;
        console.log(this.imag_url);
      })

    })

  }

  btnUpload() {
    this.uploadAPIService.uploadPut(this.uploadData.file_upload_url, this.imagePath).subscribe(res1 => {
      console.log(res1);
    })
  }



}

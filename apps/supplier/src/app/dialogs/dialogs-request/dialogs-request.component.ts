import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DistributorAPIService } from '@project/services';

@Component({
  selector: 'project-dialogs-request',
  templateUrl: './dialogs-request.component.html',
  styleUrls: ['./dialogs-request.component.scss']
})
export class DialogsRequestComponent implements OnInit {
  @Input() data: any;

  arrobjRow: any = {};
  Form: FormGroup;
  submitted = false;


  constructor(
    private distributorAPIService: DistributorAPIService,
    private formBuilder: FormBuilder,
    protected ref: NbDialogRef<DialogsRequestComponent>,
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.buildForm();
  }

  buildForm() {
    this.Form = this.formBuilder.group({
      massage: ['', Validators.required],
      action_id: ['', Validators.required],
    });
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
    this.save()
  }

  save() {
    // if ((this.data === '' || this.data === undefined) ||
    //   (this.arrobjRow.action_id === '' || this.arrobjRow.action_id === undefined) ||
    //   (this.arrobjRow.message === '' || this.arrobjRow.message === undefined))
    //   return
    const dataSend = {
      "request_information_id": this.data,
      "action_id": this.Form.value.action_id,
      "message": this.Form.value.massage
    };
    console.log(dataSend);


    const dataJson = JSON.stringify(dataSend)
    console.log(dataJson);
    this.distributorAPIService.addRequest(dataJson).subscribe(data => {
      this.ref.close();
      console.log(data);

    })
  }


  btnCancelClick(): void {
    this.ref.close();
  }



}

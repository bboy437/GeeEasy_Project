import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CheckinAPIService } from '@project/services';

@Component({
  selector: 'project-dialog-success',
  templateUrl: './dialog-success.component.html',
  styleUrls: ['./dialog-success.component.scss']
})
export class DialogSuccessComponent implements OnInit {
  @Input() data: any;
  gifs: string;
  arrobjRow: any = {};
  saveForm: FormGroup;
  submitted = false;

  constructor(
    protected ref: NbDialogRef<DialogSuccessComponent>,
    private formBuilder: FormBuilder,
    private checkinAPIService: CheckinAPIService
  ) { }

  ngOnInit() {
    //this.buildForm();
  }

  buildForm() {
    this.saveForm = this.formBuilder.group({
      confirm_message: ['', Validators.required],
    });
  }

  get f() { return this.saveForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.saveForm.invalid) {
      return;
    }
  }


  btnCancelClick() {
    this.ref.close('cancel');
  }

  btnSaveClick() {
    this.save()
  }

  save() {

    console.log(this.data.status);

    // tslint:disable-next-line: triple-equals
    if (this.data.status == 0) {
      const dataJson = {
        purchase_order_id: this.data.purchase_order_id,
        confirm_id: this.data.confirm_id,
        product_json: this.data.product_json,
        message: "-",
      }
      console.log(dataJson);
      this.checkinAPIService.addCheckIn(JSON.stringify(dataJson)).subscribe(data => {
        console.log(data);
        if (data.status_msg === "success") {
          this.ref.close('ok');
        } else {
          window.alert(data.status_msg);
        }
      })
    }
    // tslint:disable-next-line: triple-equals
    if (this.data.status == 1) {
      const dataJson = {
        purchase_order_id: this.data.purchase_order_id,
        product_id: this.data.product_id,
        checkin_qty: this.data.checkin_qty,
        warehouse_id: this.data.warehouse_id,
        note: this.data.note
      }
      console.log(dataJson);
      this.checkinAPIService.addCheckInItem(JSON.stringify(dataJson)).subscribe(data => {
        console.log(data);
        if (data.status_msg === "success") {
          this.ref.close('ok');
        } else {
          window.alert(data.status_msg);
        }
      })


    }

  }

}

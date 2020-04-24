import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PurchaseAPIService } from '@project/services';

@Component({
  selector: 'project-dialogs-reply',
  templateUrl: './dialogs-reply-po.component.html',
  styleUrls: ['./dialogs-reply-po.component.scss']
})
export class DialogsReplyPOComponent implements OnInit {
  @Input() data: any;
  arrobjRow: any = {};
  ReplyForm: FormGroup;
  submitted = false;
  confirmDate = new Date();
  isSaveLodding = false;
  // confirmDateDay = new Date();


  constructor(
    private purchaseAPIService: PurchaseAPIService,
    private formBuilder: FormBuilder,
    protected ref: NbDialogRef<DialogsReplyPOComponent>,
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.buildForm();
  }

  buildForm() {
    this.ReplyForm = this.formBuilder.group({
      note: ['', Validators.required],
      date: ['', Validators.required],
    });
    this.ReplyForm.get("date").patchValue(new Date())
  }

  get f() { return this.ReplyForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.ReplyForm.invalid) {
      return;
    }
  }




  btnSaveClick() {
    this.submitted = true;
    if (this.ReplyForm.invalid) {
      return;
    }
    this.isSaveLodding = true;
    this.save()
  }

  save() {
    const dataSend = {
      "purchase_order_id": this.data,
      "reply_id": "1",
      "note": this.ReplyForm.value.note,
      "confirm_date_timestamp": (new Date(this.ReplyForm.value.date)).getTime() / 1000,
      "confirm_date_day_number": 30,
      "confirm_date_note": 'PO ' + this.data,
    };
    const dataJson = JSON.stringify(dataSend)
    this.purchaseAPIService.addRePay(dataJson).subscribe(data => {
      this.isSaveLodding = false;
      this.ref.close();
    })
  }


  btnCancelClick(): void {
    this.ref.close();
  }

}

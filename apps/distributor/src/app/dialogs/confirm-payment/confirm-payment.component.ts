import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillingAPIService } from '@project/services';
import { AleartComponent } from '../aleart/aleart.component';

@Component({
  selector: 'project-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.scss']
})
export class ConfirmPaymentComponent implements OnInit {

  @Input() data: any;
  @Input() status: string;
  From: FormGroup;
  From1: FormGroup;
  submitted = false;
  arrobjRow: any = {};
  confirm_balance: string;
  isSaveLodding = false;

  constructor(
    protected ref: NbDialogRef<ConfirmPaymentComponent>,
    private formBuilder: FormBuilder,
    private billingAPIService: BillingAPIService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    console.log('data', this.data);
    console.log('status', this.status);
    this.arrobjRow.confirm_id = 0;
    this.confirm_balance = this.data.total_grand;
    this.buildForm();

  }

  buildForm() {
    this.From = this.formBuilder.group({
      confirm_id: ['', Validators.required],
      confirm_balance: ['', Validators.required],
      confirm_reference: ['', Validators.required],
      confirm_message: ['', Validators.required],
    });
  }


  get f() { return this.From.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.From.invalid) {
      return;
    }
  }

  changeConfirm(event) {
    console.log(event);
    // tslint:disable-next-line: triple-equals
    if (event === 1) {
      this.From.get('confirm_balance').disable();
      this.From.get('confirm_balance').patchValue(this.confirm_balance);
    } else {
      this.From.get('confirm_balance').setValue('1')
      this.From.get('confirm_balance').enable();
    }


  }

  keyValue(value, data) {
    console.log(value, data);

    // tslint:disable-next-line: triple-equals
    if (value <= 0 || value == "-" || data > this.data.total_grand) {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'checkin',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          // this.arrobjRow.confirm_balance = "1";
          this.From.get('confirm_balance').setValue('1')
        }
      });
    }
  }

  keyDown(e) {
    console.log(e);
    // tslint:disable-next-line: triple-equals
    if (e.key == "-" || e.key == 0) {
      return false;
    }

  }

  btnComfrimPaidClick() {
    this.submitted = true;
    if (this.From.invalid) {
      return;
    }
    this.isSaveLodding = true;
    this.comfrimPaid();
  }

  comfrimPaid() {
    this.From.get('confirm_balance').enable();

    const dataJson = {
      purchase_order_id: this.data.purchase_order_id,
      confirm_id: this.From.value.confirm_id,
      confirm_balance: Number(this.From.value.confirm_balance),
      confirm_reference: this.From.value.confirm_reference,
      confirm_message: this.From.value.confirm_message
    }
    console.log('dataJson', dataJson);
    console.log('From', this.From);
    this.billingAPIService.confrimPayment(JSON.stringify(dataJson)).subscribe(data => {
      this.isSaveLodding = false;
      this.ref.close('ok');
    })

  }





  btnCancelClick() {
    this.ref.close('cancel');
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderAPIService } from '@project/services';

@Component({
  selector: 'project-dialogs-confirm-order',
  templateUrl: './dialogs-confirm-order.component.html',
  styleUrls: ['./dialogs-confirm-order.component.scss']
})
export class DialogsConfirmOrderComponent implements OnInit {

  @Input() data: any;
  @Input() status: string;
  From: FormGroup;
  From1: FormGroup;
  submitted = false;
  arrobjRow: any = {};

  constructor(
    protected ref: NbDialogRef<DialogsConfirmOrderComponent>,
    private formBuilder: FormBuilder,
    private orderAPIService: OrderAPIService
  ) { }

  ngOnInit() {
    console.log('data', this.data);
    console.log('status', this.status);
    this.arrobjRow.confirm_id = 0;

    // tslint:disable-next-line: triple-equals
    if (this.status == "confirmOrder") {

    }

    // tslint:disable-next-line: triple-equals
    if (this.status == "confirmPaid") {
      this.buildForm();
    }
    // tslint:disable-next-line: triple-equals
    if (this.status == "confirmDelivery") {
      this.buildForm1();
    }

  }

  buildForm() {
    this.From = this.formBuilder.group({
      confirm_id: ['', Validators.required],
      confirm_balance: ['', Validators.required],
      confirm_reference: ['', Validators.required],
    });
  }

  buildForm1() {
    this.From1 = this.formBuilder.group({
      confirm_id: ['', Validators.required],
      confirm_balance: ['', Validators.required],
    });
  }

  get f() { return this.From.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.From.invalid) {
      return;
    }
  }

  get d() { return this.From1.controls; }
  onSubmit1() {
    this.submitted = true;
    if (this.From1.invalid) {
      return;
    }
  }


  changeConfirm(event) {
    console.log(event);
    // tslint:disable-next-line: triple-equals
    if (event == 1) {
      this.arrobjRow.confirm_balance = this.data.total_grand;
      this.From.get('confirm_balance').disable();
    } else {
      this.arrobjRow.confirm_balance = 0;
      this.From.get('confirm_balance').enable();
    }

  }

  btnComfrimPaidClick() {
    this.submitted = true;
    if (this.From.invalid) {
      return;
    }
    this.comfrimPaid();
  }

  comfrimPaid() {
    const dataJson = {
      dealer_order_id: this.data.dealer_order_id,
      confirm_id: this.arrobjRow.confirm_id,
      confirm_balance: this.arrobjRow.confirm_balance,
      confirm_reference: this.arrobjRow.confirm_reference
    }
    console.log('dataJson', dataJson);
    this.orderAPIService.comfirmPaid(JSON.stringify(dataJson)).subscribe(data => {
      this.ref.close('ok');
    })

  }


  changeDelivery(event) {
    console.log(event);
    // tslint:disable-next-line: triple-equals
    if (event == 1) {
      this.From1.get('confirm_balance').setValue(this.data.total_grand);
      this.From1.get('confirm_balance').disable();
    } else {
      this.From1.get('confirm_balance').setValue(0);
      this.From1.get('confirm_balance').enable();
    }

  }

  btnComfrimDeliveryClick() {
    this.submitted = true;
    if (this.From1.invalid) {
      return;
    }
    this.comfrimDelivery();
  }

  comfrimDelivery() {
    const dataJson = {
      dealer_order_id: this.data.dealer_order_id,
      confirm_id: this.From1.value.confirm_id,
      confirm_balance: this.From1.value.confirm_balance,
    }
    console.log('dataJson', dataJson);
    this.orderAPIService.comfirmDelivery(JSON.stringify(dataJson)).subscribe(data => {
      this.ref.close('ok');
    })

  }

  comfrimOrder() {
    const dataJson = {
      dealer_order_id: this.data.dealer_order_id,
      confirm_id: 1,
    }
    console.log('dataJson', dataJson);
    this.orderAPIService.comfirmOrder(JSON.stringify(dataJson)).subscribe(data => {
      this.ref.close('ok');
    })
  }



  btnCancelClick() {
    this.ref.close('cancel');
  }

  keyDown(e) {
    console.log(e);
    // tslint:disable-next-line: triple-equals
    if (e.key == "-" || e.key == 0) {
      return false;
    }

  }

}

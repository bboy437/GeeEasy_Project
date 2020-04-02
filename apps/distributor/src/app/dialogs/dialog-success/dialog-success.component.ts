import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CheckinAPIService, UploadAPIService } from '@project/services';

@Component({
  selector: 'project-dialog-success',
  templateUrl: './dialog-success.component.html',
  styleUrls: ['./dialog-success.component.scss']
})
export class DialogSuccessComponent implements OnInit {
  @Input() data: any;
  @Input() status: string;
  gifs: string;
  arrobjRow: any = {};
  Form: FormGroup;
  submitted = false;
  isSaveLodding = false;

  product = {
    update: false,
    main_image: {
      get: [],
      port: []
    },
    product_image_array: {
      get: [],
      port: []
    },
    product_image_array_state: true
  };

  id_local: string;
  constructor(
    protected ref: NbDialogRef<DialogSuccessComponent>,
    private formBuilder: FormBuilder,
    private checkinAPIService: CheckinAPIService,
    private uploadAPIService: UploadAPIService
  ) {
    this.id_local = localStorage.getItem("id");
    console.log(" this.id_local", this.id_local);
  }

  ngOnInit() {
    console.log(this.data)

    if (this.status === 'add-note') {
      this.buildForm();
    }
    if (this.status === "add-img") {
      if (this.data.image_array !== undefined)
        this.uploadAPIService
          .uploadImage()
          .imageArray(
            this.data.image_array,
            imageArray => {
              this.product.product_image_array.get = imageArray;
            }
          );
    }

  }

  buildForm() {
    this.Form = this.formBuilder.group({
      note: ['', Validators.required],
    });
    this.Form.get("note").patchValue(this.data.note)
  }

  get f() { return this.Form.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.Form.invalid) {
      return;
    }
  }


  btnCancelClick() {
    this.ref.close("");
  }

  btnSaveClick() {
    this.isSaveLodding = true;
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
        product_manual_json: this.data.product_manual_json,
      }
      console.log(dataJson);
      this.checkinAPIService.addCheckIn(JSON.stringify(dataJson)).subscribe(data => {
        console.log(data);
        this.isSaveLodding = false;
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
        note: this.data.note,
        image_array: this.data.image_array,
        product_manual_json: this.data.product_manual_json,
      }
      console.log('dataJson', dataJson);
      this.checkinAPIService.addCheckInItem(JSON.stringify(dataJson)).subscribe(data => {
        console.log(data);
        this.isSaveLodding = false;
        if (data.status_msg === "success") {
          this.ref.close('ok');
        } else {
          window.alert(data.status_msg);
        }
      })


    }

  }

  btnAddImgeClick() {

    this.product.update = true;
    const dataSend = {
      type_id: 120,
      file_name: "",
      file_type: "",
      distributor_id: this.id_local,
      user_id: 0
    };
    let product_image_array = {};

    this.uploadAPIService.uploadImage().getImageArray(dataSend, this.product.product_image_array.get,
      red_product_image_array => {
        console.log("btnSaveClick : red_product_image_array : ", red_product_image_array);
        product_image_array = red_product_image_array;
        this.addImage(product_image_array);
      }
    );
  }

  addImage(product_image_array) {
    product_image_array.forEach(element => {
      element.note = element.note === "" ? "-" : element.note
    });

    this.ref.close(product_image_array);
  }

  btnAddNote() {
    this.submitted = true;
    if (this.Form.invalid) {
      return;
    }
    this.isSaveLodding = true;
    this.addNote();
  }

  addNote() {
    this.isSaveLodding = false;
    this.ref.close(this.Form.value.note);
  }


}

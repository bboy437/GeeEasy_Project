import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { UploadAPIService } from '@project/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'project-dialogs-image',
  templateUrl: './dialogs-image.component.html',
  styleUrls: ['./dialogs-image.component.scss']
})
export class DialogsImageComponent implements OnInit {

  @Input() imgURL: string;
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
    protected ref: NbDialogRef<DialogsImageComponent>,
    private formBuilder: FormBuilder,
    private uploadAPIService: UploadAPIService
  ) {
    this.id_local = localStorage.getItem("id");
    console.log(" this.id_local", this.id_local);
  }

  ngOnInit() {
    console.log(this.data)

    if (this.status === 'note') {
      this.buildForm();
    }
    if (this.status === "img") {
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

  btnOKClick() {
    this.ref.close("");
  }


}

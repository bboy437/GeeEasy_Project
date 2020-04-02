import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductAPIService } from '@project/services';
import { Router } from '@angular/router';

@Component({
  selector: 'project-dialogs-product-group',
  templateUrl: './dialogs-product-group.component.html',
  styleUrls: ['./dialogs-product-group.component.scss']
})
export class DialogsProductGroupComponent implements OnInit {
  @Input() status: string;
  @Input() data: string;
  @Input() product_id: string;
  isSaveLodding = false;
  id_local: string;
  arrProducts: any = [];

  constructor(
    private productAPIService: ProductAPIService,
    private router: Router,
    private formBuilder: FormBuilder,
    protected ref: NbDialogRef<DialogsProductGroupComponent>,
  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
  }

  arrobjRow: any = {};
  productGroupForm: FormGroup;
  submitted = false;


  ngOnInit() {
    this.getProductGroup();
    if (this.status === 'create') {
      this.buildForm();
    }
    if (this.status === 'addProductTogroup') {
      this.buildForm();
    }
  }

  getProductGroup() {
    const value = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + this.id_local;
    this.productAPIService.getProductGroup(value).subscribe(data => {
      this.arrProducts = data.response_data;
      console.log('this.arrProducts', this.arrProducts);

    })

  }

  buildForm() {
    this.productGroupForm = this.formBuilder.group({
      productname: ['', Validators.required],
    });
  }

  get f() { return this.productGroupForm.controls; }

  btnSaveClick() {
    this.submitted = true;
    if (this.productGroupForm.invalid) {
      return;
    }
    this.isSaveLodding = true;
    this.save();
  }


  save() {
    this.arrobjRow.distributor_id = this.id_local;
    const dataJson = JSON.stringify(this.arrobjRow);
    console.log(dataJson);

    this.productAPIService.addProductGroup(dataJson).subscribe(data => {
      console.log(data);
      this.isSaveLodding = false;
      this.ref.close('ok');
    })
  }


  btnAddProductClick() {
    this.submitted = true;
    if (this.productGroupForm.invalid) {
      return;
    }
    this.isSaveLodding = true;
    this.AddProduct();
  }


  AddProduct() {
    const dataJson = {
      "distributor_id": this.id_local,
      "inventory_group_id": this.productGroupForm.value.productname,
      "product_id": this.product_id
    }
    console.log('dataJson', dataJson);

    this.productAPIService.addProductToGroup(JSON.stringify(dataJson)).subscribe(data => {
      console.log(data);
      this.isSaveLodding = true;
      this.ref.close('ok');
    })
  }


  btnCancelClick(): void {
    this.ref.close();
  }

}

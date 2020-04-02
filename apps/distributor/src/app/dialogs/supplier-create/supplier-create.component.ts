import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SupplierAPIService, UploadAPIService, BrowseSupplierAPIService } from '@project/services';
import { Router } from '@angular/router';
import { NewFolderComponent } from '../new-folder/new-folder.component';

@Component({
  selector: 'project-supplier-create',
  templateUrl: './supplier-create.component.html',
  styleUrls: ['./supplier-create.component.scss']
})
export class SupplierCreateComponent implements OnInit {

  arrobjRow: any = {};
  arrCategory: any = [];
  from: FormGroup;
  submitted = false;

  id_local: string;

  constructor(
    private supplierAPIService: SupplierAPIService,
    private formBuilder: FormBuilder,
    protected ref: NbDialogRef<SupplierCreateComponent>,
    private browseSupplierAPIService: BrowseSupplierAPIService

  ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local)
  }

  ngOnInit() {
    this.buildForm();
    this.getCategory();
  }

  getCategory() {
    const valueCategory = 'cur_page=' + 1 + '&per_page=' + 10 + "&distributor_id=" + this.id_local;
    this.browseSupplierAPIService.getCategory(valueCategory).subscribe(data => {
      this.arrCategory = data.response_data;
      console.log(this.arrCategory);

    })
  }


  buildForm() {
    this.from = this.formBuilder.group({
      suppliername: ['', Validators.required],
      suppliercategory: ['', Validators.required],
      productcategory: ['', Validators.required],
    });
  }

  get f() { return this.from.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.from.invalid) {
      return;
    }
  }

  btnSaveClick() {
    this.submitted = true;
    if (this.from.invalid) {
      return;
    }
    this.save();
  }

  save() {
    this.arrobjRow.distributor_id = this.id_local;
    this.arrobjRow.dealer_id = 0;
    this.arrobjRow.sale_rep_id = 0;
    const dataJson = JSON.stringify(this.arrobjRow)
    console.log(this.arrobjRow);

    this.supplierAPIService.addSupplier(dataJson).subscribe(data => {
      this.ref.close('ok');
    })
  }


  btnCancelClick(data): void {
    this.ref.close('ok');
  }

}

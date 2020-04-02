import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SupplierAPIService } from '@project/services';
import { Router } from '@angular/router';

@Component({
  selector: 'project-dialogs-supplier-wishlist',
  templateUrl: './dialogs-supplier-wishlist.component.html',
  styleUrls: ['./dialogs-supplier-wishlist.component.scss']
})
export class DialogsSupplierWishlistComponent implements OnInit {

  @Input() data: any;
  arrobjRow: any = {};
  WishListForm: FormGroup;
  submitted = false;

  constructor(
    private supplierAPIService: SupplierAPIService,
    private router: Router,
    private formBuilder: FormBuilder,
    protected ref: NbDialogRef<DialogsSupplierWishlistComponent>,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.WishListForm = this.formBuilder.group({
      massage: ['', Validators.required],
    });
  }

  get f() { return this.WishListForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.WishListForm.invalid) {
      return;
    }
  }


  btnSaveClick() {
    this.submitted = true;
    if (this.WishListForm.invalid) {
      return;
    }
    this.save()
  }

  save() {
    this.arrobjRow.distributor_id = this.data.distributor_id;
    this.arrobjRow.supplier_id = this.data.supplier_id;
    const dataJson = JSON.stringify(this.arrobjRow);
    this.supplierAPIService.addWishList(dataJson).subscribe(data => {
      this.ref.close();
      console.log(data);

    })
  }


  btnCancelClick(): void {
    this.ref.close();
  }
  
}


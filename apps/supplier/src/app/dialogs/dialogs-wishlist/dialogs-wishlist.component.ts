import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SupplierAPIService } from '@project/services';
import { Router } from '@angular/router';


@Component({
  selector: 'project-dialogs-wishlist',
  templateUrl: './dialogs-wishlist.component.html',
  styleUrls: ['./dialogs-wishlist.component.scss']
})
export class DialogsWishlistComponent implements OnInit {
  private UrlRouter_Savedlists = "distributors/supplier/browse-suppliers";
  arrobjRow: any = {};
  WishListForm: FormGroup;
  submitted = false;

  constructor(
    private supplierAPIService: SupplierAPIService,
    private router: Router,
    private formBuilder: FormBuilder,
    protected ref: NbDialogRef<DialogsWishlistComponent>,
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
    this.supplierAPIService.addWishList(this.arrobjRow).subscribe(data => {
      this.ref.close();
      console.log(data);

    })
  }


  btnCancelClick(): void {
    this.ref.close();
  }
  
}


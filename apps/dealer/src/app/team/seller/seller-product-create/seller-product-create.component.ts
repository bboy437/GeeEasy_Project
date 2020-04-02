import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SellerService, UploadAPIService } from '@project/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogsCancelComponent } from '../../../dialogs/dialogs-cancel/dialogs-cancel.component';
import { NbDialogService } from '@nebular/theme';

@Component({
    selector: 'project-seller-product-create',
    templateUrl: './seller-product-create.component.html',
    styleUrls: ['./seller-product-create.component.scss']
})
export class SellerProductCreateComponent implements OnInit {
    private backPage = "team/seller/detail";
    private cancelPage = "team/seller/product-detail";
    RowID: string;
    seller_id: string;
    ID: string;
    arrProduct: any = [];
    loading = false;
    submitted = false;
    Form: FormGroup;
    imagePath: any = [];
    uploadData: any = [];
    imgURL: any;
    public message = "No File chosen";

    id_local: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private sellerService: SellerService,
        private fb: FormBuilder,
        private uploadAPIService: UploadAPIService,
        private dialogService: NbDialogService,
    ) {
        this.id_local = localStorage.getItem('id');
        console.log(' this.id_local', this.id_local);
        this.loading = true;

    }

    ngOnInit() {
        this.Builder();
        const params = this.route.snapshot.paramMap;
        this.RowID = params.get("id");
        this.seller_id = params.get("seller_id");
        this.getProductDetail(this.RowID)
    }

    getProductDetail(id) {
        this.sellerService.getSellerProductDetail(id).subscribe(res => {
            this.arrProduct = res.response_data[0];
            this.imgURL = res.response_data[0].product_image_url;
            console.log(' this.arrProduct', this.arrProduct);
            this.valueForm();
            this.loading = false;

        })

    }

    Builder() {
        this.Form = this.fb.group({
            product_title: ['', Validators.required],
            product_sku: [{ value: '', disabled: true }, Validators.required],
        });
    }

    get f() {
        return this.Form.controls;
    }
    onSubmit() {
        this.submitted = true;
        if (this.Form.invalid) {
            return;
        }
    }

    valueForm() {
        this.Form.patchValue({
            product_title: this.arrProduct.product_title,
            product_sku: this.arrProduct.product_sku,
        });
    }


    btnSaveClick() {
        this.submitted = true;
        if (this.Form.invalid) {
            return;
        }
        this.save();
    }

    save() {
        const dataJson = {
            "user_product_id": this.arrProduct.user_product_id,
            "product_image_url": this.arrProduct.product_image_url,
            "product_title": this.Form.value.product_title
        }

        this.sellerService.postUpdateProduct(JSON.stringify(dataJson)).subscribe(res => {
            console.log('update', res);

            this.router.navigate([this.backPage, this.seller_id, 'seller']);
        })

    }



    btnCancelClick() {
        const dialogRef = this.dialogService.open(DialogsCancelComponent, {});

        dialogRef.onClose.subscribe(result => {
            if (result === "cancel") {
            }
            if (result === "ok") {
                this.router.navigate(['team/seller/product-detail',this.seller_id,this.RowID]);
            }
        });
    }


    uploadFile(event) {
        if (event.length === 0) return;

        const mimeType = event[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.message = "Only images are supported.";
            return;
        }
        const reader = new FileReader();
        this.message = event[0].name;
        this.imagePath = event[0];
        reader.readAsDataURL(event[0]);
        reader.onload = _event => {
            this.imgURL = reader.result;
        };
        this.upload();
    }

    upload() {
        const dataJson = {
            type_id: 620,
            file_name: this.imagePath.name,
            file_type: this.imagePath.type,
            dealer_id: this.id_local,
            user_id: 0
        };

        this.uploadAPIService.uploadImg(JSON.stringify(dataJson)).subscribe(res => {
            console.log(res);
            this.uploadData = res.response_data[0];
            this.arrProduct.product_image_url = this.uploadData.file_url;
            this.uploadAPIService
                .uploadPut(this.uploadData.file_upload_url, this.imagePath)
                .subscribe(res1 => {
                    console.log(res1);
                });
        });
    }

}

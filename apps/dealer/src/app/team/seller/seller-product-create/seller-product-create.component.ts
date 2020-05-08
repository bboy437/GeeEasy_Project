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

    image = {
        update: false,
        main_image: {
            get: [],
            port: []
        }
    }

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
        if (this.RowID) {
            this.sellerService.dataSellerProducts$.subscribe(res => {
                res ? this.getProductDetail(res) : this.router.navigate([this.backPage, this.seller_id, 'seller']);
            })
        }

    }

    getProductDetail(data) {

        this.arrProduct = data.response_data[0];
        this.imgURL = data.response_data[0].product_image_url;
        console.log(' this.arrProduct', this.arrProduct);

        this.valueForm();

        if (this.arrProduct.product_image_url !== undefined && this.arrProduct.product_image_url !== "-" && this.arrProduct.product_image_url !== "")
            this.uploadAPIService.uploadImage().getUrl(this.arrProduct.product_image_url, red_image => {
                this.image.main_image.get.push(red_image);
            });

        this.loading = false;

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
        this.image.update = true;
        const dataSend = {
            type_id: 620,
            file_name: "",
            file_type: "",
            dealer_id: this.id_local,
            user_id: 0
        };

        this.uploadAPIService.uploadImage().getImageArray(dataSend, this.image.main_image.get, red_image_array => {
            console.log('btnSaveClick : red_image_array : ', red_image_array);
            this.image.main_image.port = red_image_array;
            this.save();
        });
    }

    save() {
        const dataJson = {
            "user_product_id": this.arrProduct.user_product_id,
            "product_image_url": (this.image.main_image.port.length > 0) ? this.image.main_image.port[0].image_url : "-",
            "product_title": this.Form.value.product_title
        }

        this.sellerService.postUpdateProduct(JSON.stringify(dataJson)).subscribe(res => {
            console.log('update', res);
            this.Form.reset();
            this.router.navigate([this.backPage, this.seller_id, 'seller']);
        })

    }

    btnCancelClick() {
        this.router.navigate(['team/seller/product-detail', this.seller_id, this.RowID]);
    }


}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SellerService } from '@project/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'project-seller-product-detail',
    templateUrl: './seller-product-detail.component.html',
    styleUrls: ['./seller-product-detail.component.scss']
})
export class SellerProductDetailComponent implements OnInit {
    private backPage = "team/seller/detail";
    private editPage = "team/seller/product-create";
    RowID: string;
    ID: string;
    seller_id: string;
    arrProduct: any = [];
    loading = false;
    Form: FormGroup;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private sellerService: SellerService,
        private fb: FormBuilder,
    ) {
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
            this.arrProduct.product_wholesale_array.forEach(element => {
                this.arrProduct.product_price = element.product_price;
                this.arrProduct.product_qty = 1;
                element.unit_price = element.unit_prices;
            });
            console.log(' this.arrProduct', this.arrProduct);
            this.valueForm();
            this.loading = false;

        })

    }

    Builder() {
        this.Form = this.fb.group({
            product_title: [{ value: '', disabled: true }, Validators.required],
            product_sku: [{ value: '', disabled: true }, Validators.required],
            product_price: [{ value: '', disabled: true }, Validators.required],
        });
    }

    valueForm() {
        this.Form.patchValue({
            product_title: this.arrProduct.product_title,
            product_sku: this.arrProduct.product_sku,
            product_price: this.arrProduct.product_price,
        });
    }


    btnEditClick() {
        this.router.navigate([this.editPage, this.seller_id, this.RowID]);
    }

    btnBackClick() {
        this.router.navigate([this.backPage, this.seller_id, 'seller']);
    }

}

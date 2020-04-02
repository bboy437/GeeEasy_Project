import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RetailProductService, WarehouseAPIService } from '@project/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'project-retailer-product-detail',
    templateUrl: './retailer-product-detail.component.html',
    styleUrls: ['./retailer-product-detail.component.scss']
})
export class RetailerProductDetailComponent implements OnInit {
    private backPage = "retailers/retailer/detail";
    private editPage = "retailers/product/create";
    retailId: string;
    RowID: string;
    ID: string;
    arrProduct: any = [];
    loading = false;
    Form: FormGroup;

    product_wholesale_array = [];

    product_image = {
        image_url_array: [],
        product_image_array: []
    }

    id_local: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private retailProductService: RetailProductService,
        private warehouseAPIService: WarehouseAPIService,
        private fb: FormBuilder,
    ) {
        this.id_local = localStorage.getItem('id');
        console.log(' this.id_local', this.id_local);
        this.loading = true;

    }

    ngOnInit() {
        this.Builder();
        const params = this.route.snapshot.paramMap;
        this.RowID = params.get("id");
        this.retailId = params.get("dealer_id");
        this.getProductDetail(this.RowID)
    }

    getProductDetail(id) {
        this.retailProductService.getRetailProductDetail(id).subscribe(res => {
            this.arrProduct = res.response_data[0];
            this.valueForm();
            if (this.arrProduct.product_image_array !== undefined)
                this.arrProduct.product_image_array.forEach(item => {
                    const _image = {
                        name: "",
                        type: "",
                        result: item.image_url,
                        event: ""
                    };
                    this.product_image.image_url_array.push(_image);
                });
            if (this.arrProduct.product_wholesale_array !== undefined) {
                this.arrProduct.product_wholesale_array.forEach(item => {
                    this.productWholesaleArray().get(item, red => {
                        const product_price = parseFloat(red.product_wholesale.product_price);
                        const discount_thb = parseFloat(red.product_wholesale.discount_thb);
                        const discount_percent = parseFloat(red.product_wholesale.discount_percent);
                        this.productWholesaleArray().calculate(product_price, discount_thb, discount_percent, (red_product_price, red_discount_thb, red_discount_percent, red_product_discount) => {
                            red.product_discount = red_product_discount;
                            this.product_wholesale_array.push(red);
                        });
                    });
                });
            }
            console.log(' this.arrProduct', this.arrProduct);
            this.valueForm();
            this.loading = false;

        })

    }

    Builder() {
        this.Form = this.fb.group({
            product_warehouse: [{ value: '', disabled: true }, Validators.required],
            product_title: [{ value: '', disabled: true }, Validators.required],
            product_sku: [{ value: '', disabled: true }, Validators.required],
            product_price: [{ value: '', disabled: true }, Validators.required],
        });
    }

    valueForm() {
        this.Form.patchValue({
            product_warehouse: this.arrProduct.warehouse_id,
            product_title: this.arrProduct.product_title,
            product_sku: this.arrProduct.product_sku,
            product_price: this.arrProduct.product_price,
        });
    }

    getWarehouse(callback: (res: any) => any) {
        const value = "dealer_id=" + this.id_local + "&warehouse_type_id=" + 3
        this.warehouseAPIService.getWarehouseList(value).subscribe(data => {
            const res = data.response_data;
            callback(res);
        })
    }

    btnEditClick() {
        this.router.navigate([this.editPage, this.arrProduct.retail_id, this.RowID]);
    }

    btnBackClick() {
        this.router.navigate([this.backPage, this.arrProduct.retail_id]);
    }

    productWholesaleArray() {
        const self = this;
        const _function = {
            consoleLog(_function_name, _title, _data) {
                const _self = this;
                console.log(_function_name, " : ", _title, " : ", _data);
            },
            get(_wholesale, callback: (red) => any) {
                const _self = this;
                const wholesale = {
                    product_discount: 0,
                    discount: (_wholesale.discount_percent !== 0 && _wholesale.discount_percent !== "0") ? "discount_percent" : "discount_thb",
                    product_wholesale: {
                        qty_minimum: _wholesale.qty_minimum,
                        product_price: _wholesale.product_price,
                        discount_thb: _wholesale.discount_thb,
                        discount_percent: _wholesale.discount_percent,
                    }
                };
                _self.consoleLog("add", "wholesale", wholesale);
                callback(wholesale);
            },
            add(callback: (red) => any) {
                const _self = this;
                const wholesale = {
                    product_discount: 0,
                    discount: "discount_thb",
                    product_wholesale: {
                        qty_minimum: 1,
                        product_price: 1,
                        discount_thb: 1,
                        discount_percent: 0,
                    }
                };
                _self.consoleLog("add", "wholesale", wholesale);
                callback(wholesale);
            },
            push() {
                const _self = this;
                _self.add(red => {
                    self.product_wholesale_array.push(red);
                    _self.consoleLog("add", "this.product_wholesale_array", self.product_wholesale_array);
                });
            },
            remove(index, item) {
                const _self = this;
                _self.consoleLog("remove", "index", index);
                _self.consoleLog("remove", "item", item);
                self.product_wholesale_array.splice(index, 1);
            },
            update(index, object_values) {
                const _self = this;
                _self.consoleLog("update", "index", index);
                _self.consoleLog("update", "object_values", object_values);
                /* tslint:disable-next-line: forin */
                for (const key in self.product_wholesale_array[index].product_wholesale) {
                    if (self.product_wholesale_array[index].product_wholesale.hasOwnProperty(key) && object_values === key) {
                        if (self.product_wholesale_array[index].product_wholesale[key] === "" || self.product_wholesale_array[index].product_wholesale[key] === "0" || self.product_wholesale_array[index].product_wholesale[key] === undefined || self.product_wholesale_array[index].product_wholesale[key] < 1)
                            self.product_wholesale_array[index].product_wholesale[key] = 1;
                        const product_price = parseFloat(self.product_wholesale_array[index].product_wholesale['product_price']);
                        const discount_thb = parseFloat(self.product_wholesale_array[index].product_wholesale['discount_thb']);
                        const discount_thb_default = self.product_wholesale_array[index].product_wholesale['discount_thb'];
                        const discount_percent = parseFloat(self.product_wholesale_array[index].product_wholesale['discount_percent']);
                        _self.calculate(product_price, discount_thb, discount_percent, (red_product_price, red_discount_thb, red_discount_percent, red_product_discount) => {
                            self.product_wholesale_array[index].product_wholesale['discount_thb'] = (product_price < discount_thb) ? red_discount_thb : discount_thb_default;
                            self.product_wholesale_array[index].product_wholesale['discount_percent'] = red_discount_percent;
                            self.product_wholesale_array[index]['product_discount'] = red_product_discount;
                        });
                    }
                }
                _self.consoleLog("update", "self.product_wholesale_array[index];", self.product_wholesale_array[index]);
            },
            onChange(index, event) {
                const _self = this;
                _self.consoleLog("onChange", "index", index);
                _self.consoleLog("onChange", "event", event);
                _self.consoleLog("onChange", "self.product_wholesale_array[index];", self.product_wholesale_array[index]);
                /* tslint:disable-next-line: forin */
                for (const key in self.product_wholesale_array[index].product_wholesale) {
                    if (self.product_wholesale_array[index].product_wholesale.hasOwnProperty(key) && event === key) {
                        self.product_wholesale_array[index].product_wholesale[key] = 1;
                        self.product_wholesale_array[index].product_wholesale[(key === 'discount_thb') ? 'discount_percent' : 'discount_thb'] = 0;
                    }
                    const product_price = parseFloat(self.product_wholesale_array[index].product_wholesale['product_price']);
                    const discount_thb = parseFloat(self.product_wholesale_array[index].product_wholesale['discount_thb']);
                    const discount_percent = parseFloat(self.product_wholesale_array[index].product_wholesale['discount_percent']);
                    _self.calculate(product_price, discount_thb, discount_percent, (red_product_price, red_discount_thb, red_discount_percent, red_product_discount) => {
                        self.product_wholesale_array[index].product_wholesale['discount_thb'] = red_discount_thb;
                        self.product_wholesale_array[index].product_wholesale['discount_percent'] = red_discount_percent;
                        self.product_wholesale_array[index]['product_discount'] = red_product_discount;
                    });
                }
                _self.consoleLog("onChange", "self.product_wholesale_array[index];", self.product_wholesale_array[index]);
            },
            calculate(product_price, discount_thb, discount_percent, callback: (product_price, discount_thb, discount_percent, product_discount) => any) {
                const _self = this;
                let product_discount = 0;
                if (product_price < discount_thb) {
                    discount_thb = product_price;
                }
                if (discount_percent >= 100) {
                    discount_percent = 100;
                }
                product_discount = (discount_thb !== 0) ? (product_price - discount_thb) : (product_price - ((product_price * discount_percent) / 100));
                callback(product_price, discount_thb, discount_percent, product_discount);
            }
        }
        return _function;
    }
}

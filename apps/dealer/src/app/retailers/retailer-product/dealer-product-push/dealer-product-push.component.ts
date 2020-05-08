import { Component, OnInit } from '@angular/core';
import { RetailAccountService, RetailProductService, ProductAPIService, TeamAPIService, UploadAPIService } from '@project/services';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AleartComponent } from '../../../dialogs/aleart/aleart.component';
import { DialogsCancelComponent } from '../../../dialogs/dialogs-cancel/dialogs-cancel.component';
import { DialogsTeamComponent } from '../../../dialogs/dialogs-team/dialogs-team.component';
import { DeleteComponent } from '../../../dialogs/delete/delete.component';

@Component({
    selector: 'project-dealer-product-push',
    templateUrl: './dealer-product-push.component.html',
    styleUrls: ['./dealer-product-push.component.scss']
})

export class DealerProductPushComponent implements OnInit {
    private UrlRouter_Detail = "retailers/retailer/detail";
    FromProduct: FormGroup;
    arrobjRow: any = [];
    filter: any = [];
    arrProducts: any = [];
    products: any = [];
    RetailId: string;
    RowID: string;
    loading = false;
    update_loading = false;
    warehouse: any = [];
    checkedAll: boolean;

    id_local: string;

    image = {
        update: false,
        main_image: {
            get: [],
            port: []
        }
    }

    constructor(
        private retailAccountService: RetailAccountService,
        private retailProductService: RetailProductService,
        private router: Router,
        private route: ActivatedRoute,
        private dialogService: NbDialogService,
        private formBuilder: FormBuilder,
        private productAPIService: ProductAPIService,
        private uploadAPIService: UploadAPIService
    ) {
        this.id_local = localStorage.getItem('id');
        console.log(' this.id_local', this.id_local);
        this.loading = true;
    }

    ngOnInit() {
        this.buildFormProduct();
        const params = this.route.snapshot.paramMap;
        this.RetailId = params.get("retail_id");
        this.RowID = params.get("id");
        this.getData();
        this.getProduct();
    }

    buildFormProduct() {
        this.FromProduct = this.formBuilder.group({
            product_id: [],
            product_title: [],
            product_sku: [],
            product_price: [],
        });
    };

    getData() {
        this.retailAccountService.getRetailAccountDetail(this.RetailId).subscribe(red => {
            console.log("getData : red : ", red);
            red.response_data.forEach((item: any) => {
                this.arrobjRow = item;
            });
            const data_send = {
                dealer_id: this.id_local,
                retail_id: this.RetailId
            };
            this.retailProductService.getRetailProductLists(data_send).subscribe(res => {
                console.log("getData : res : ", res);
                this.products = res.response_data;
                this.loading = false;
            });
        });


        /* this.teamAPIService.getTeamDetail(this.RowID).subscribe(res => {
            this.arrobjRow = res.response_data[0];
            this.products = res.response_data[0].group_product_array;
            this.loading = false;
            console.log('arrobjRow', this.arrobjRow);
        }) */
    }

    getProduct() {
        const value = "cur_page=" + 1 + "&per_page=" + 100 + "&dealer_id=" + this.id_local;
        this.productAPIService.getProductDealer(value).subscribe(data => {
            this.arrProducts = data.response_data;
            this.arrProducts.forEach((element: { product_name: any; product_title: string | any[]; product_sku: any; }) => {
                element.product_name = element.product_title.concat(" (", element.product_sku, ")")

            });
            this.loading = false;
        })
    }

    //product warehouse
    productChange(event: string | any[]) {

        this.warehouse = [];
        if (event.length > 0) {
            const dataProduct = event[0].data;
            const dataWarehouse = event[0].data.product_row_display_array;
            let onhand = 0, available = 0, change = 0, outgoing = 0, incoming = 0;

            //Check Warehouse
            const data1 = dataWarehouse.filter((x: { warehouse_id: number; }) => x.warehouse_id === 0);
            const data2 = dataWarehouse.filter((x: { warehouse_id: number; }) => x.warehouse_id !== 0);
            const data3 = [];

            if (data1.length > 0) {
                for (let index = 0; index < data1.length; index++) {
                    if (isNaN(data1[index].checkin_data.onhand)) {
                        continue;
                    }
                    onhand += Number(data1[index].checkin_data.onhand);
                    available += Number(data1[index].checkin_data.available);
                    change += Number(data1[index].checkin_data.change)
                    incoming += Number(data1[index].checkin_data.incoming);
                    outgoing += Number(data1[index].checkin_data.outgoing);


                }
                console.log(onhand);

                //push ค่า ที่ซ้ำ warehouse = 0
                data3.push({
                    purchase_data: data1[0].purchase_data,
                    warehouse_id: data1[0].warehouse_id,
                    warehouse_data: data1[0].warehouse_data,
                    product_price: dataProduct.product_price,
                    product_qty: 0,
                    product_is_active: false,
                    checkin_data: {
                        available: available,
                        onhand: onhand,
                        qty: onhand,
                        change: change,
                        incoming: incoming,
                        outgoing: outgoing,
                    },
                })
            }

            //เพิ่มฟิล ค่า ที่ไม่ซ้ำ 
            data2.forEach((element: { product_price: any; product_qty: number; product_is_active: boolean; checkin_data: { qty: any; onhand: any; }; }) => {
                element.product_price = dataProduct.product_price;
                element.product_qty = 0;
                element.product_is_active = false;
                element.checkin_data.qty = element.checkin_data.onhand
                element.checkin_data.onhand = element.checkin_data.onhand
            });

            console.log('data1', data1);
            console.log('data2', data2);
            console.log('data3', data3);

            //All Warehouse
            const warehouse = data3.concat(data2);

            //push Warehoush
            this.warehouse.push({
                dealer_id: dataProduct.dealer_id,
                distributor_id: dataProduct.distributor_id,
                product_id: dataProduct.product_id,
                product_sku: dataProduct.product_sku,
                product_title: dataProduct.product_title,
                product_price: dataProduct.product_price,
                product_image_url: dataProduct.product_image_url,
                warehouse: warehouse
            })
            console.log('warehouse', this.warehouse);

            if (
                this.warehouse[0].product_image_url !== undefined &&
                this.warehouse[0].product_image_url !== "-" &&
                this.warehouse[0].product_image_url !== ""
            )
                this.uploadAPIService
                    .uploadImage()
                    .getUrl(this.warehouse[0].product_image_url, red_image => {
                        this.image.main_image.get.push(red_image);
                    });


            this.FromProduct.get('product_title').patchValue(this.warehouse[0].product_title);
            this.FromProduct.get('product_sku').patchValue(this.warehouse[0].product_sku);
            this.FromProduct.get('product_price').patchValue(this.warehouse[0].product_price);
        }
    }

    allWarehouseActive(product: any[], callbacl: (arg0: boolean) => void) {
        let status = true;
        product.forEach((item: { product_is_active: boolean; }) => {
            if (item.product_is_active === false)
                status = false;
        });
        callbacl(status);
    }

    updateStatus(checked: boolean, data: { product_is_active: boolean; warehouse_id: any; }) {
        console.log('checked', checked, data);
        if (checked) {
            data.product_is_active = true;
            this.warehouse[0].warehouse.forEach((element: { warehouse_id: any; product_is_active: boolean; }) => {
                if (element.warehouse_id !== data.warehouse_id)
                    element.product_is_active = false;
            });
        } else {
            data.product_is_active = false;
            this.warehouse[0].warehouse.forEach((element: { warehouse_id: any; product_is_active: boolean; }) => {
                if (element.warehouse_id !== data.warehouse_id)
                    element.product_is_active = false;
            });
        }


        console.log('warehouse', this.warehouse);
    }

    updateStatusAll(checked: boolean) {
        console.log('checked', checked);
        this.warehouse.forEach((element: { warehouse: any[]; }) => {
            element.warehouse.forEach((element1: { product_is_active: boolean; }) => {
                element1.product_is_active = (checked) ? true : false;
            });
        });
        console.log('warehouse', this.warehouse);
    }

    onKeyQuantity(searchValue: any, data: any): void {
        console.log(data);


        if (data.product_qty < 0 || data.product_qty > data.checkin_data.onhand || data.product_qty === "") {
            const dialogRef = this.dialogService.open(AleartComponent, {
                context: {
                    status: 'Quantity',
                },
            });
            dialogRef.onClose.subscribe(result => {
                if (result === 'ok') {
                    data.product_qty = 0;
                    data.checkin_data.onhand = (data.checkin_data.qty - Number(data.product_qty));
                }
            });
        } else {
            data.checkin_data.onhand = (data.checkin_data.qty - Number(data.product_qty));
        }
    }

    transferChange(data: any) {
        console.log("transferChange : data : ", data);

        if (Number(data.product_qty) <= 0)
            return

        const dialogRef = this.dialogService.open(DialogsTeamComponent, {
            context: {
                status: 'confirmProductTeam',
            }
        });

        dialogRef.onClose.subscribe(result => {
            if (result === 'cancel') {
            }
            if (result === 'ok') {
                const checkin_data = {
                    available: data.checkin_data.available,
                    onhand: Number(data.product_qty),
                    change: data.checkin_data.change,
                    incoming: data.checkin_data.incoming,
                    outgoing: data.checkin_data.outgoing,
                };
                const products = []
                products.push({
                    product_id: this.warehouse[0].product_id,
                    product_title: this.warehouse[0].product_title,
                    product_sku: this.warehouse[0].product_sku,
                    product_price: this.warehouse[0].product_price,
                    product_image_url: this.warehouse[0].product_image_url,
                    checkin_data: checkin_data,
                    create_time: new Date().getTime() / 1000,
                    warehouse_id: data.warehouse_id
                });
                this.add(products, red => {
                    console.log("transferChange : add : red : ", red);
                    this.update_loading = true;
                    const data_send = {
                        dealer_id: this.id_local,
                        retail_id: this.RetailId
                    };
                    this.retailProductService.getRetailProductLists(data_send).subscribe(res => {
                        console.log("getData : res : ", res);
                        this.products = res.response_data;
                        this.update_loading = false;
                    });
                });
                this.checkTransfer(products);
            }
        });
    }

    checkTransfer(_product) {
        console.log("checkTransfer : _product : ", _product);
        this.products.unshift({
            product_id: _product[0].product_id,
            product_title: _product[0].product_title,
            product_sku: _product[0].product_sku,
            product_price: this.warehouse[0].product_price,
            product_image_url: _product[0].product_image_url,
            create_time: new Date().getTime() / 1000,
            checkin_data: _product[0].checkin_data
        });
        console.log("checkTransfer : this.products : ", this.products);
    };

    btnDeleteProduct(i: any, product) {
        console.log("btnDeleteProduct : i : ", i);
        console.log("btnDeleteProduct : product : ", product);
        const dialogRef = this.dialogService.open(DeleteComponent, {
            context: {
                icon: 'people-outline',
                title: 'Confirm Delete ?',
            }
        });

        dialogRef.onClose.subscribe(result => {
            if (result === 'ok') {
                this.update_loading = true;
                this.remove(product.retail_product_id, red => {
                    console.log("btnDeleteProduct : red : ", red);
                    this.products.splice(i, 1);
                    console.log("btnDeleteProduct : this.products : ", this.products);
                    this.update_loading = false;
                });
            }
        });
    }

    btnClearClick() {
        this.warehouse = [];
        this.FromProduct.get('product_id').patchValue("");
    }

    add(product_json, callback: (res) => any) {
        const dataJson = {
            retail_id: this.RetailId,
            dealer_id: this.id_local,
            product_json: product_json
        }
        console.log("add : dataJson : ", dataJson);
        this.retailProductService.postRetailProductAdd(JSON.stringify(dataJson)).subscribe(red => {
            console.log("add : red : ", red);
            callback(red);
        });
    }

    remove(retail_product_id, callback: (res) => any) {
        const dataJson = {
            retail_id: this.RetailId,
            dealer_id: this.id_local,
            retail_product_id: retail_product_id
        };
        this.retailProductService.postRetailProductRemove(JSON.stringify(dataJson)).subscribe(red => {
            callback(red);
        });
    }

    update(callback: (res) => any) {
        const dataJson = {
            retail_id: this.RetailId,
            dealer_id: this.id_local,
            product_json: this.products,
        }
        console.log(dataJson);
        this.retailProductService.postRetailProductSave(JSON.stringify(dataJson)).subscribe(data => {
            console.log(data);
            callback(data);
        });
    };

    btnCancelClick() {
        const dialogRef = this.dialogService.open(DialogsCancelComponent, {
        });

        dialogRef.onClose.subscribe(result => {
            if (result) {
                this.router.navigate([this.UrlRouter_Detail, this.RetailId]);
            }
        });
    }

    btnBackClick() {
        this.router.navigate([this.UrlRouter_Detail, this.RetailId]);
    }

}

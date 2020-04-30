import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map, tap, shareReplay } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { IObjStock, ProductDataArray, IObjectProductList, IObjectFavorite, IFavoriteList, IStock, IObjectProductGroup, IProductDealerResponse } from '@project/interfaces';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})

export class ProductAPIService {



    // Distributor
    private productDetailDistributor = new BehaviorSubject<any>(null);
    productDetailDistributor$ = this.productDetailDistributor.asObservable();

    private myMethodSubjectTransfer = new BehaviorSubject<any>("");
    dataTransfer$ = this.myMethodSubjectTransfer.asObservable();

    private productGroupSelectedSubject = new BehaviorSubject<any>(null);
    productGroupSelectedAction$ = this.productGroupSelectedSubject.asObservable();

    //Dealer
    private productDetailDealer = new BehaviorSubject<any>(null);
    productDetailDealer$ = this.productDetailDealer.asObservable();


    protected ServerApiUrls = "https://api.gee-supply.com/v1/";
    protected ServerApiUrlProductSup = "https://api.gee-supply.com/v1-sup/";
    protected ServerApiUrlProductDist = "https://api.gee-supply.com/v1-dist/";
    protected ServerApiUrlProducDealer = "https://api.gee-supply.com/v1-dealer/";

    constructor(private http: HttpClient, private router: Router, ) {

    }

    // Product List suppier  
    paramProductSupplier = "cur_page=" + 1 + "&per_page=" + 100 + "&supplier_id=" + localStorage.getItem('id');
    productSupplierList$ = this.http.get<IObjectProductList>(`${this.ServerApiUrlProductSup}${'supplier/product/list?'}${this.paramProductSupplier}`)
        .pipe(
            map(products =>
                products.response_data.map(product => ({
                    ...product,
                    warehouse: product.product_warehouse_array.map(warehouse => {
                        product.checkin_available = +warehouse.available;
                        product.checkin_onhand = +warehouse.onhand;
                        product.checkin_outgoing = +warehouse.outgoing;
                        product.checkin_incoming = +warehouse.incoming;
                        product.warehouse_name = warehouse.warehouse_name;
                    })
                }) as ProductDataArray)
            ),
            tap(data => console.log('productSupplierList', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );


    // Product List Distributor
    paramProductList = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + localStorage.getItem('id');
    productDistributor$ = this.http.get<IObjectProductList>(`${this.ServerApiUrlProductDist}${'distributor/inventory/default/lists?'}${this.paramProductList}`)
        .pipe(
            map(products => products.response_data),
            tap(data => console.log('productDistributor', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );


    // Stock List Distributor
    paramStockList = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + localStorage.getItem('id');
    stockDistributor$ = this.http.get<IObjStock>(`${this.ServerApiUrlProductDist}${'distributor/inventory/default/lists_by_row?'}${this.paramStockList}`)
        .pipe(
            map(products => products.response_data),
            tap(data => console.log('stockDistributor', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );


    // Product Favorite List
    paramFavorite = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + localStorage.getItem('id');
    productFavorite$ = this.http.get<IObjectFavorite>(`${this.ServerApiUrlProductDist}${'distributor/favorite_list/lists?'}${this.paramFavorite}`)
        .pipe(
            map(products =>
                products.response_data.map(product => ({
                    ...product,
                    product_title: product.product_data[0].product_title,
                    product_image_url: product.product_data[0].product_image_url,
                    product_sku: product.product_data[0].product_sku,
                    product_price: product.product_data[0].product_price,
                }) as IFavoriteList)
            ),
            tap(data => console.log('productFavorite', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );


    // Product Inventory Log List
    paramInventory = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + localStorage.getItem('id');
    productInventory$ = this.http.get<IObjStock>(`${this.ServerApiUrlProductDist}${'distributor/inventory/product/log?'}${this.paramInventory}`)
        .pipe(
            map(products =>
                products.response_data.map(product => ({
                    ...product,
                    type_key: product.type_key !== "NEW CHECKIN" ? "No" : product.type_key,
                }) as IStock)
            ),
            tap(data => console.log('productFavorite', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );

    // Product Group List Distributor
    paramProductGroupList = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + localStorage.getItem('id');
    ProductGroupList$ = this.http.get<IObjectProductGroup>(`${this.ServerApiUrlProductDist}${'distributor/inventory/group/lists?'}${this.paramProductGroupList}`)
        .pipe(
            map(products => products.response_data),
            tap(data => console.log('ProductGroupList', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );


    // Dealer Product

    paramProductDealerList = "cur_page=" + 1 + "&per_page=" + 100 + "&dealer_id=" + localStorage.getItem('id');
    productDealerList$ = this.http.get<IProductDealerResponse>(`${this.ServerApiUrlProducDealer}${'dealer/product/lists?'}${this.paramProductDealerList}`)
        .pipe(
            map(products => products.response_data),
            tap(data => console.log('products', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );



    // product the selected Product Group
    selectedProductGroup(data: any): void {
        this.productGroupSelectedSubject.next(data);
    }


    // Distributor product the selected Transfer
    clickDataTransfer(data): any {
        this.myMethodSubjectTransfer.next(data);
    }

    // Distributor product data detail
    dataProductDetailDistributor(data): void {
        console.log(data)
        this.productDetailDistributor.next(data);
    }

    // Dealer product data detail
    dataProductDetailDealer(data): void {
        console.log(data)
        this.productDetailDealer.next(data);
    }




    getViewDefaultID(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlProductDist + "distributor/inventory/key?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getProductGroup(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlProductDist + "distributor/inventory/group/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getFarvoriteList(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlProductDist + "distributor/favorite_list/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    getInventoryLogId(strUrl: string): Observable<IObjStock> {
        return this.http.get<IObjStock>(this.ServerApiUrlProductDist + "distributor/inventory/id?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    getProductListSup(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlProductSup + "supplier/product/list?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getProductDetailSup(id: string): Observable<IObjectProductList> {
        const url = `${this.ServerApiUrlProductSup}${"/supplier/product/id/"}${id}`;
        return this.http.get<IObjectProductList>(url)
            .pipe(
                retry(1),
                catchError(this.handleError)
            );
    }

    getProductDetailDealer(id: string): Observable<any> {
        const url = `${this.ServerApiUrlProducDealer}${"/dealer/product/id/?"}${id}`;
        return this.http.get<any>(url)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    //get product for new order

    getProductOrder(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlProductDist + "distributor/search_product_short/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    //get product for dealer

    getProductDealer(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlProducDealer + "dealer/product/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getProductDealerDetail(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlProducDealer + "dealer/product/key?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    //get Transfer Stock
    getTransferID(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlProductDist + "distributor/real_product/id/?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }





    //add

    addProductGroup(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProductDist + "distributor/inventory/group/create", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addProductToGroup(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProductDist + "distributor/inventory/group/save_group", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addProducts(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProductSup + "supplier/product/create", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addProductsDealer(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProducDealer + "dealer/product/add/", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addProductsDistributor(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProductDist + "distributor/inventory/default/add/", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postSKU(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProductSup + "supplier/product/sku/", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postSKUDist(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProductDist + "distributor/product/sku/", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    addFarvorite(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProductDist + "distributor/favorite_list/add", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addTransfer(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProductDist + "distributor/inventory/product/stock_transfer", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }



    //update

    updateProductsDealer(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProducDealer + "dealer/product/update/", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    updateProductsDistributor(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProductDist + "distributor/inventory/default/update/", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    updateProducts(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProductSup + "supplier/product/update", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    updateStock(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProductSup + "supplier/product/stock/update", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    updateStockDist(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProductDist + "distributor/inventory/product/stock_update", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    updateStatusDist(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlProductDist + "distributor/inventory/default/update_active", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    handleError(err) {
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
        }
        console.error(err);
        return throwError(errorMessage);
    }

}


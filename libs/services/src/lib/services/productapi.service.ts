import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { IObjStock } from '@project/interfaces';


@Injectable()

export class ProductAPIService {
    data$: Observable<any>;
    private myMethodSubject = new Subject<any>();
    datatest: any;

    dataTransfer$: Observable<any>;
    private myMethodSubjectTransfer = new BehaviorSubject<any>("");


    protected ServerApiUrls = "https://api.gee-supply.com/v1/";
    protected ServerApiUrlProductSup = "https://api.gee-supply.com/v1-sup/";
    protected ServerApiUrlProductDist = "https://api.gee-supply.com/v1-dist/";
    protected ServerApiUrlProducDealer = "https://api.gee-supply.com/v1-dealer/";

    constructor(private http: HttpClient) {
        this.data$ = this.myMethodSubject.asObservable();
        this.dataTransfer$ = this.myMethodSubjectTransfer.asObservable();
    }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    clickDataGroud(data) {
        this.myMethodSubject.next(data);
    }

    clickDataTransfer(data) :any {
         this.myMethodSubjectTransfer.next(data);
    }


    getViewDefault(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlProductDist + "distributor/inventory/default/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getStockList(strUrl: string): Observable<IObjStock> {
        return this.http.get<IObjStock>(this.ServerApiUrlProductDist + "distributor/inventory/default/lists_by_row?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
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

    getInventoryLog(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlProductDist + "distributor/inventory/product/log?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getInventoryLogId(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlProductDist + "distributor/inventory/id?" + strUrl)
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

    getProductDetailSup(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlProductSup + "supplier/product/id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getProductDetailDealer(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlProducDealer + "dealer/product/id/?" + strUrl)
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


    handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }

}


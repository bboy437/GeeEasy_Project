import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Subject } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';
import { IObjectPurchase, IPurchaseDetail, ISettingList, IPurchaseList } from '@project/interfaces';

@Injectable({
    providedIn: 'root'
})

export class PurchaseAPIService {

    protected ServerApiUrl = "https://api.gee-supply.com/v1/supplier/";
    protected ServerApiUrlMassges = "https://api.gee-supply.com/v1/";
    protected ServerApiUrlDist = "https://api.gee-supply.com/v1-dist/";

    filterList$: Observable<any>;
    private filterListSubject = new Subject<any>();

    constructor(private http: HttpClient) {
        this.filterList$ = this.filterListSubject.asObservable();
    }

    // Supplier
    value = "cur_page=" + 1 + "&per_page=" + 100 + "&supplier_id=" + localStorage.getItem('id');
    purchaseList$ = this.http.get<IObjectPurchase>(`${this.ServerApiUrl}${'purchase_order/short_lists?'}${this.value}`)
        .pipe(
            map(purchases =>
                purchases.response_data.map(purchase => ({
                    ...purchase,
                    po_status: (purchase.order_status_btn.button_confirm === 1
                        && purchase.purchase_order_status_display.po_is_delivery === 1
                        && purchase.order_status_btn.button_paid === 1) ? 1 : 0,
                    distributor_name: purchase.distributor_data_array[0].distributor_name.split(",")
                }) as IPurchaseList)
            ),
            tap(data => console.log('requestList', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );


    // Distributor
    valueDist = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + localStorage.getItem('id');
    purchaseListDistributor$ = this.http.get<IObjectPurchase>(`${this.ServerApiUrl}${'purchase_order/short_lists?'}${this.valueDist}`)
        .pipe(
            map(purchases =>
                purchases.response_data.map(purchase => ({
                    ...purchase,
                    po_status: (purchase.order_status_btn.button_confirm === 1
                        && purchase.purchase_order_status_display.po_is_delivery === 1
                        && purchase.order_status_btn.button_paid === 1) ? 1 : 0,
                    supplier_name: purchase.supplier_data_array[0].supplier_name.split(",")
                }) as IPurchaseList)
            ),
            tap(data => console.log('requestList', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );



    dataFilterList(data) {
        this.filterListSubject.next(data);
    }



    //get PurchaseAPIService


    getPurchaseDetail(strUrl: string): Observable<IPurchaseDetail> {
        return this.http.get<IPurchaseDetail>(this.ServerApiUrl + "purchase_order/id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getDoc(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "purchase_order/doc/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }
    getMassagesDis(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlMassges + "messages/purchase_order/id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getSettingDist(strUrl: string): Observable<ISettingList> {
        return this.http.get<ISettingList>(this.ServerApiUrlDist + "distributor/setting/purchase_order/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    //post PurchaseAPIService

    addPurchase(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "purchase_order/create", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }
    addConfirmPO(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "purchase_order/distributor_confirm", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }
    addRePay(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "purchase_order/reply", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }
    addDilivery(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "purchase_order/supplier_confirm", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }
    addMassageSup(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlMassges + "messages/purchase_order/supplier_insert/", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }
    addMassageDis(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlMassges + "messages/purchase_order/distributor_insert/", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }
    addSettingDist(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDist + "distributor/setting/purchase_order/save", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    //update PurchaseAPIService

    updatePO(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "purchase_order/update_info", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }
    updateProduct(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "purchase_order/update_product", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }



    handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }

}

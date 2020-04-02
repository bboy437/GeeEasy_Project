import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { IObjectPurchase, IPurchaseDetail, ISettingList } from '@project/interfaces';

@Injectable()

export class PurchaseAPIService {

    protected ServerApiUrl = "https://api.gee-supply.com/v1/supplier/";
    protected ServerApiUrlMassges = "https://api.gee-supply.com/v1/";
    protected ServerApiUrlDist = "https://api.gee-supply.com/v1-dist/";

    filterList$: Observable<any>;
    private filterListSubject = new Subject<any>();

    constructor(private http: HttpClient) {
        this.filterList$ = this.filterListSubject.asObservable();
    }

    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    dataFilterList(data) {
        this.filterListSubject.next(data);
    }



    //get PurchaseAPIService

    getPurchaseList(strUrl: string): Observable<IObjectPurchase> {
        return this.http.get<IObjectPurchase>(this.ServerApiUrl + "purchase_order/short_lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }
    
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

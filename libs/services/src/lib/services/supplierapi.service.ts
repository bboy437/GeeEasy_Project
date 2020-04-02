import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

@Injectable()

export class SupplierAPIService {


    protected ServerApiUrl = "https://api.gee-supply.com/v1-sup/";

    data$: Observable<any>;
    private myMethodSubject = new Subject<any>();
    dataCategory$: Observable<any>;
    private myCategory = new Subject<any>();
    tabData$: Observable<any>;
    private tabData = new Subject<any>();

    constructor(private http: HttpClient) {
        this.data$ = this.myMethodSubject.asObservable();
        this.dataCategory$ = this.myCategory.asObservable();
        this.tabData$ = this.tabData.asObservable();
    }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',

        })

    }


    clickData(data) {
        this.myMethodSubject.next(data);
    }

    clickDataCategory(data) {
        this.myCategory.next(data);
    }

    tabTitle(data) {
        this.tabData.next(data);
    }



    //get Supplier

    getSupID(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier_account/id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getSupListCreate(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/created_list/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    //cate ของตังเอง ฝั่ง dist
    getSupCat(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/product_category_my_supplier/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    getVerifiedSupplieList(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getWishlist(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/save_wishlists/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getRequestCheck(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/request_information/check?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getVerifiedCate(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/product_category_verified_supplier/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }




    //Add Supplier

    addWishList(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "supplier/request_information/save_wishlist" , objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addRequest(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "supplier/request_information/submit", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addSupplier(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "supplier_account/create", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }



    updateSupplier(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "supplier_account/update", objbody)
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


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()

export class BrowseSupplierAPIService {

    protected ServerApiUrl = "https://api.gee-supply.com/v1-sup/";
    protected ServerApiUrlDist = "https://api.gee-supply.com/v1-dist/";

    constructor(private http: HttpClient) {
    }

    //supplier

    getSupplierProduct(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/browse_by_product?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getSupplierName(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/browse_by_name?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }



    getCategory(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/product_category?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getCategoryDetail(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/category/id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }



    getCategoryID(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/browse_by_product_category_id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    getCheckReques(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "/supplier/request_information/check/?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    //distributor

    getCategoryDist(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDist + "distributor/product_category?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getProductDist(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "distributor/list_product?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getNameDist(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "distributor/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getDistDetail(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDist + "distributor/info/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    // demo : https://api.gee-supply.com/v1-dist/distributor/search_product_short/lists?cur_page=1&per_page=50&distributor_id={distributor_id}
    getDistributorsProductsShortDetail(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDist + "distributor/search_product_short/lists" + strUrl)
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


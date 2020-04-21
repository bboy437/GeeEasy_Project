import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class DealerAPIService {

    protected ServerApiUrlDealer = "https://api.gee-supply.com/v1-dealer/";

    constructor(private http: HttpClient) {
    }
    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }


    getDealerList(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDealer + "dealer/account/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getDealerDetail(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDealer + "dealer/account/id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }




    addDealer(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDealer + "dealer/account/create", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    updateDealer(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDealer + "dealer/account/update", objbody)
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


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class LocationAPIService {

    protected ServerApiUrl = 'https://getappeasy.com/store/api/v1/location/lists?';
    protected ServerApiUrlSup = "https://api.gee-supply.com/v1-sup/";
    protected ServerApiUrlDist = "https://api.gee-supply.com/v1-dist/";
    constructor(private http: HttpClient) {

    }

    getHeaderContentTypeJson() {
        const headerDict = {
            'authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
        return headerDict;
    }


    get(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + strUrl);
    }


    getdSupLocation(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlSup + "supplier/location/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getdDistLocation(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDist + "distributor/location/" + strUrl)
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


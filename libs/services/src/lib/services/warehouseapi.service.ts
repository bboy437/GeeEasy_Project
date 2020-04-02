import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

@Injectable()

export class WarehouseAPIService {

    // protected ServerApiUrl = "https://nwt0gw8wy8.execute-api.ap-southeast-1.amazonaws.com/Prod/warehouse/lists?";
    protected ServerApiUrl = "https://api.gee-supply.com/v1/";

    constructor(private http: HttpClient) {

    }


    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    getWarehouseList(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "warehouse/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getWarehouseDetail(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "warehouse/id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    addWarehouse(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "warehouse/create", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    updateWarehouse(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "warehouse/update", objbody)
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

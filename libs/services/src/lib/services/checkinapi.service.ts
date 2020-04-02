import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

@Injectable()

export class CheckinAPIService {

    constructor(private http: HttpClient) {
        this.dataCheckin$ = this.myMethodSubject.asObservable();
    }

    //get
    // protected ServerApiUrlCheckIn = "https://private-anon-dd003e29ce-geeesyapiblueprint.apiary-mock.com/";
    protected ServerApiUrl = "https://api.gee-supply.com/v1/";

    protected ServerApiUrlTest = "https://private-anon-dd003e29ce-geeesyapiblueprint.apiary-mock.com/";
    //add


    dataCheckin$: Observable<any>;
    private myMethodSubject = new Subject<any>();


    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    clickDataCheckIn(data) {
        this.myMethodSubject.next(data);
    }


    getCheckinList(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/purchase_order/checkin/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getCheckdetail(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/purchase_order/checkin/id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addCheckIn(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "supplier/purchase_order/checkin_confirm", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addCheckInItem(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "supplier/purchase_order/checkin_confirm_item/", objbody)
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


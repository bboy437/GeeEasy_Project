import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { IObjectCheckIn, ICheckInList } from '@project/interfaces';

@Injectable({
    providedIn: 'root'
})

export class CheckinAPIService {

    protected ServerApiUrl = "https://api.gee-supply.com/v1/";

    constructor(private http: HttpClient) {
    }


    //   CheckIn
    valueList = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + localStorage.getItem('id');
    checkInList$ = this.http.get<IObjectCheckIn>(`${this.ServerApiUrl}${'supplier/purchase_order/checkin/lists?'}${this.valueList}`)
        .pipe(
            map(checkInList => checkInList.response_data),
            tap(data => console.log('checkInList', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );



    getCheckinList(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/purchase_order/checkin/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getCheckdetail(strUrl: string): Observable<IObjectCheckIn> {
        return this.http.get<IObjectCheckIn>(this.ServerApiUrl + "supplier/purchase_order/checkin/id/" + strUrl)
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


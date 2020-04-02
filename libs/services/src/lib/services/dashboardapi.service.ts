import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { IDashbord } from '@project/interfaces';

@Injectable()

export class DashboardAPIService {

    protected ServerApiUrl = "https://api.gee-supply.com/v1/";

    constructor(private http: HttpClient) {

    }


    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    get(content_type: string, strUrl: string): Observable<IDashbord> {
        return this.http.get<IDashbord>(this.ServerApiUrl + "content/" + content_type + "/lists?" + strUrl)
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


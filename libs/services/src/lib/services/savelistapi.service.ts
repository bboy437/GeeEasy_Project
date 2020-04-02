import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()

export class SaveListSupplierAPIService {

    protected ServerApiUrlSup = "https://api.gee-supply.com/v1-sup/";
    protected ServerApiUrlDist = "https://api.gee-supply.com/v1-dist/";
    protected ServerApiUrl = "https://api.gee-supply.com/v1/";

    data$: Observable<any>;
    private myMethodSubject = new Subject<any>();

    constructor(private http: HttpClient) {
        this.data$ = this.myMethodSubject.asObservable();
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


    //Distributor

    getSaveList(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlSup + "supplier/save_lists/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    createSaveListDist(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlSup + "supplier/save_lists/create", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addSaveListDist(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlSup + "supplier/save_lists/add", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }
    deleteSaveListDist(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlSup + "supplier/save_lists/remove", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    renameSaveListDist(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlSup + "supplier/save_lists/update_name", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }
    deleteAllDist(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlSup + "supplier/save_lists/delete_all", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }



    //supplier

    getSavelistSup(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDist + "distributor/saved_list/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    createSaveListSup(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDist + "distributor/saved_list/create", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }
    addSaveListSup(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDist + "distributor/saved_list/add", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    renameSaveListSup(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDist + "distributor/saved_list/update_name", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    deleteSaveListSup(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDist + "distributor/saved_list/remove", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    deleteAllSup(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDist + "distributor/saved_list/delete_all", objbody)
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


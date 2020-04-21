import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';
import { IobjectSavelist } from '@project/interfaces';

@Injectable({
    providedIn: 'root'
})

export class SaveListSupplierAPIService {

    protected ServerApiUrlSup = "https://api.gee-supply.com/v1-sup/";
    protected ServerApiUrlDist = "https://api.gee-supply.com/v1-dist/";
    protected ServerApiUrl = "https://api.gee-supply.com/v1/";

    data$: Observable<any>;
    private myMethodSubject = new Subject<any>();

    private savelistDistSelectedSubject = new BehaviorSubject<any>(null);
    savelistDistSelectedAction$ = this.savelistDistSelectedSubject.asObservable();

    private savelistSupplierSelectedSubject = new BehaviorSubject<any>(null);
    savelistSupplierSelectedAction$ = this.savelistSupplierSelectedSubject.asObservable();

    constructor(private http: HttpClient) {
        this.data$ = this.myMethodSubject.asObservable();
    }

    //All List supplier
    value = "cur_page=" + 1 + "&per_page=" + 100 + "&supplier_id=" + localStorage.getItem('id');
    savelistSupplier$ = this.http.get<IobjectSavelist>(`${this.ServerApiUrlDist}${'distributor/saved_list/lists?'}${this.value}`)
        .pipe(
            map(savelist => savelist.response_data),
            tap(data => console.log('savelistSupplier', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );

    //All List Distributor
    valueDist = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + localStorage.getItem('id');
    savelistDistributor$ = this.http.get<IobjectSavelist>(`${this.ServerApiUrlSup}${'supplier/save_lists/lists?'}${this.valueDist}`)
        .pipe(
            map(savelist => savelist.response_data),
            tap(data => console.log('savelistDistributor', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );


    // Distributor savelist the selected List name
    selectedListDistriburor(data: any): void {
        this.savelistDistSelectedSubject.next(data);
    }

    // Supplier savelist the selected List name
    selectedListSupplier(data: any): void {
        this.savelistSupplierSelectedSubject.next(data);
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


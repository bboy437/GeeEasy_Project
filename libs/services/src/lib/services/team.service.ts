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


export class TeamAPIService {

    protected ServerApiUrlDealer= "https://api.gee-supply.com/v1-dealer/";
    constructor(private http: HttpClient) {

    }

    getHeaderContentTypeJson() {
        const headerDict = {
            'authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
        return headerDict;
    }



    getTeamList(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDealer + "team/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }
    getTeamDetail(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDealer + "team/id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postTeam(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDealer + "team/create" , objbody,)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    updateTeam(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDealer + "team/update" , objbody,)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    tranferProduct(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDealer + "team/product_add" , objbody,)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }



   deleteGroup(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDealer + "team/remove_group" , objbody,)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    deleteTeam(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDealer + "team/remove_team" , objbody,)
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


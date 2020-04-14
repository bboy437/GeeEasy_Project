import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';

@Injectable()

export class MessagesAPIService {

    dataChat$: Observable<any>;
    private myMethodSubjectChat = new BehaviorSubject<any>("");

    constructor(private http: HttpClient) {
        this.dataChat$ = this.myMethodSubjectChat.asObservable();
    }


    //get
    // protected ServerApiUrlCheckIn = "https://private-anon-dd003e29ce-geeesyapiblueprint.apiary-mock.com/";
    protected ServerApiUrlSup = "https://api.gee-supply.com/v1-sup/";
    protected ServerApiUrlDist = "https://api.gee-supply.com/v1-dist/";
    protected ServerApiUrlDealer = "https://api.gee-supply.com/v1-dealer/";

    //add
    

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    dataChat(data) {
        this.myMethodSubjectChat.next(data);
    }

    //Api ฝั่ง distributor

    getContactListDist(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDist + "supplier/contact/distributor/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getContactDetaiilDist(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDist + "supplier/contact/distributor/id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addReplyDist(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDist + "supplier/contact/distributor/reply/", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    sentMessageDist(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDist + "supplier/contact/distributor/submit", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }



    //Api ฝั่ง supplier

    getContactListSup(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlSup + "supplier/contact/distributor/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getContactDetaiilSup(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlSup + "supplier/contact/distributor/id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addReplySup(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlSup + "supplier/contact/distributor/reply/", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addMessageSubmitSup(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlSup + "supplier/contact/distributor/submit/", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    //Api ฝั่ง Dealer

    getContactListDealer(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDealer + "dealer/contact/distributor/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getContactDetaiiltDealer(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDealer + "dealer/contact/distributor/id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addReplytDealer(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDealer + "dealer/contact/distributor/reply/", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addMessageSubmittDealer(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDealer + "dealer/contact/distributor/submit/", objbody)
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


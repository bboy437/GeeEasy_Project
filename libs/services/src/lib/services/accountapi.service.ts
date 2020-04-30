import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, combineLatest, EMPTY, from, merge, Subject, throwError, of, forkJoin, Observable } from 'rxjs';
import {
  catchError, filter, map, mergeMap, scan, shareReplay, tap, toArray, switchMap,
  mergeAll, max, reduce, concatMap, delay, retry
} from 'rxjs/operators';
import { ISetting, IObjectSetting } from '@project/interfaces';

@Injectable({
  providedIn: 'root'
})

export class AccountAPIService {

  protected ServerApiUrl = "https://api.gee-supply.com/v1-sup/";

  private deliverySubject = new Subject<ISetting>();
  deliverySubject$ = this.deliverySubject.asObservable();


  constructor(private http: HttpClient) {

  }


  delivery$ = this.http.get<IObjectSetting>(`${this.ServerApiUrl}supplier/setting/delivery_information/id/${localStorage.getItem('id')}`)
    .pipe(
      map((res: IObjectSetting) => res.response_data),
      tap((res: ISetting[]) => {
        console.log('tab 1', res)
      }),
      shareReplay(1),
      catchError(this.handleError)
    );




  getDeliverInformation(strUrl: string): Observable<any> {
    return this.http.get<any>(this.ServerApiUrl + "supplier/setting/delivery_information/id/" + strUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }



  addDeliverInformation(objbody: any): Observable<any> {
    return this.http.post<any>(this.ServerApiUrl + "supplier/setting/delivery_information/save/", objbody)
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


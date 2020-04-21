import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, combineLatest, EMPTY, from, merge, Subject, throwError, of, forkJoin, Observable } from 'rxjs';
import {
  catchError, filter, map, mergeMap, scan, shareReplay, tap, toArray, switchMap,
  mergeAll, max, reduce, concatMap, delay, retry
} from 'rxjs/operators';
import { ISetting, IObject } from '@project/interfaces';

@Injectable({
  providedIn: 'root'
})

export class AccountAPIService {

  protected ServerApiUrl = "https://api.gee-supply.com/v1-sup/";

  private deliverySubject = new Subject<ISetting>();
  deliverySubject$ = this.deliverySubject.asObservable();


  constructor(private http: HttpClient) {

  }


  delivery$ = this.http.get<IObject>(`${this.ServerApiUrl}supplier/setting/delivery_information/id/${localStorage.getItem('id')}`)
    .pipe(
      map((res: IObject) => res.response_data),
      tap((res: ISetting[]) => {
        console.log('tab 1', res)
      }),
      catchError(this.handleError)
    );

  arrdelivery$ = merge(
    this.delivery$,
    this.deliverySubject$
      .pipe(
        tap(res => { console.log('tab 2', res) }),
        concatMap(delivery => this.saveProduct(delivery)),
      ))
    .pipe(
      scan((deliverys: ISetting[], delivery: ISetting) => this.modifyProducts(deliverys, delivery)),
      shareReplay(1)
    );



  addProduct(data: ISetting) {
    const updatedData = { ...data };
    this.deliverySubject.next(updatedData);
  }

  saveProduct(product: ISetting) {
    const dataJson = {
      "supplier_id": localStorage.getItem('id'),
      "setting_json": product.setting_json
    }
    return this.http.post<ISetting>(`${this.ServerApiUrl}supplier/setting/delivery_information/save/`, JSON.stringify(dataJson))
      .pipe(
        tap(res => {
          console.log('Created product', JSON.stringify(res))
        }),

        catchError(this.handleError)
      );

  }

  modifyProducts(deliverys: ISetting[], delivery: ISetting) {
    return deliverys.map(p => p.supplier_id === delivery.supplier_id ?
      { ...delivery } : p);
    // return [...deliverys, { ...delivery }];
  }


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


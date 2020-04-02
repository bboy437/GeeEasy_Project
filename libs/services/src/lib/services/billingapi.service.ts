import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()

export class BillingAPIService {
  //  protected ServerApiUrl = "https://private-anon-3c36a00762-geeesyapiblueprint.apiary-mock.com/";
    protected ServerApiUrl = "https://api.gee-supply.com/v1/";

  constructor(private http: HttpClient) {
  }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }


  //bill list Supplier
  getBillsList(strUrl: string): Observable<any> {
    return this.http.get<any>(this.ServerApiUrl + "supplier/purchase_order/lists_bill_supplier?" + strUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  //bill list Distributor
  getBillsListDist(strUrl: string): Observable<any> {
    return this.http.get<any>(this.ServerApiUrl + "supplier/purchase_order/lists_bill_distributor?" + strUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getBillsDetail(strUrl: string): Observable<any> {
    return this.http.get<any>(this.ServerApiUrl + "distributor/my_bill/id?purchase_order_id=" + strUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getPaymentMethod(strUrl: string): Observable<any> {
    return this.http.get<any>(this.ServerApiUrl + "distributor/payment_method/lists?distributor_id=" + strUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }


  addPayment(objbody: any): Observable<any> {
    return this.http.post<any>(this.ServerApiUrl + "distributor/my_bill/payment_otf", objbody)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  confrimPayment(objbody: any): Observable<any> {
    return this.http.post<any>(this.ServerApiUrl + "supplier/purchase_order/distributor_pay_confirm/", objbody)
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


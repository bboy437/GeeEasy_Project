import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';
import { IObjectBillList, IBillList } from '@project/interfaces';

@Injectable({
  providedIn: 'root'
})

export class BillingAPIService {

  protected ServerApiUrl = "https://api.gee-supply.com/v1/";

  constructor(private http: HttpClient) {
  }


  //Supplier

  value = "cur_page=" + 1 + "&per_page=" + 100 + "&supplier_id=" + localStorage.getItem('id');
  billList$ = this.http.get<IObjectBillList>(`${this.ServerApiUrl}${'supplier/purchase_order/lists_bill_supplier?'}${this.value}`)
    .pipe(
      map(bills =>
        bills.response_data.map(bill => ({
          ...bill,
          distributor_name: bill.distributor_data_array[0].distributor_name.split(",")
        }) as IBillList)
      ),
      tap(data => console.log('billList', data)),
      // shareReplay(1),
      catchError(this.handleError)
    );


  // Distributor

  valueDist = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + localStorage.getItem('id');
  billListDistributor$ = this.http.get<IObjectBillList>(`${this.ServerApiUrl}${'supplier/purchase_order/lists_bill_distributor?'}${this.valueDist}`)
    .pipe(
      map(bills =>
        bills.response_data.map(bill => ({
          ...bill,
          supplier_name: bill.supplier_data_array[0].supplier_name.split(",")
        }) as IBillList)
      ),
      tap(data => console.log('billList', data)),
      // shareReplay(1),
      catchError(this.handleError)
    );



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


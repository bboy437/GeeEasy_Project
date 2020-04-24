import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';
import { IObjectOrder, IOrderList } from '@project/interfaces';

@Injectable({
  providedIn: 'root'
})

export class OrderAPIService {

  protected ServerApiUrlDealer = "https://api.gee-supply.com/v1-dealer/";

  constructor(private http: HttpClient) {
  }


  // Order List Distributor
  paramOrderList = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + localStorage.getItem('id') + "&short=" + 1;
  orderList$ = this.http.get<IObjectOrder>(`${this.ServerApiUrlDealer}${'distributor/place_order/lists?'}${this.paramOrderList}`)
    .pipe(
      map(orders =>
        orders.response_data.map(order => ({
          ...order,
          dealer_name: order.dealer_data[0].dealer_name.split(",")
        }) as IOrderList)
      ),
      tap(data => console.log('orderList', data)),
      // shareReplay(1),
      catchError(this.handleError)
    );


  getOrderList(strUrl: string): Observable<any> {
    return this.http.get<any>(this.ServerApiUrlDealer + "distributor/place_order/lists?" + strUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  getOrderDetail(strUrl: string): Observable<any> {
    return this.http.get<any>(this.ServerApiUrlDealer + "distributor/place_order/id/" + strUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }


  newOrder(objbody: any): Observable<any> {
    return this.http.post<any>(this.ServerApiUrlDealer + "distributor/place_order/create", objbody)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  comfirmPaid(objbody: any): Observable<any> {
    return this.http.post<any>(this.ServerApiUrlDealer + "distributor/place_order/confirm_paid", objbody)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  comfirmDelivery(objbody: any): Observable<any> {
    return this.http.post<any>(this.ServerApiUrlDealer + "distributor/place_order/confirm_delivery", objbody)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  comfirmOrder(objbody: any): Observable<any> {
    return this.http.post<any>(this.ServerApiUrlDealer + "distributor/place_order/confirm", objbody)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  comfirmPrice(objbody: any): Observable<any> {
    return this.http.post<any>(this.ServerApiUrlDealer + "distributor/place_order/confirm_price", objbody)
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


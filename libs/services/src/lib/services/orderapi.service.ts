import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()

export class OrderAPIService {


  protected ServerApiUrlTest = "http://private-7cc4cf-geeesyapiblueprint.apiary-mock.com/distributor/place_order/lists?cur_page=1&per_page=10&dealer_id=400";
  protected ServerApiUrls = "https://api.gee-supply.com/v1/";
  protected ServerApiUrlDist = "https://api.gee-supply.com/v1-dist/";
  protected ServerApiUrlSup = "https://api.gee-supply.com/v1-sup/";
  protected ServerApiUrlDealer = "https://api.gee-supply.com/v1-dealer/";
  constructor(private http: HttpClient) {
  }


  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

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

  // getOrderList(strUrl: string): Observable<any> {
  //   return this.http.get<any>(this.ServerApiUrl + strUrl)
  //     .pipe(
  //       retry(1),
  //       catchError(this.handleError)
  //     )
  // }


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


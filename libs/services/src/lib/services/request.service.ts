import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, combineLatest, EMPTY, from, merge, Subject, throwError, of } from 'rxjs';
import { catchError, filter, map, mergeMap, scan, shareReplay, tap, toArray, switchMap } from 'rxjs/operators';
import { IObjectVerified, IObjectVerifiedDistList, IObjectRequest } from '@project/interfaces';


@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private supplierUrl = 'https://api.gee-supply.com/v1-sup/';


  constructor(
    private http: HttpClient,
  ) { }

  // All Request List Supplier

  valueRequestSupplier = "cur_page=" + 1 + "&per_page=" + 100 + "&supplier_id=" + localStorage.getItem('id');
  requestList$ = this.http.get<IObjectRequest>(`${this.supplierUrl}${'supplier/request_information/lists?'}${this.valueRequestSupplier}`)
    .pipe(
      map((res) => res.response_data),
      tap(data => console.log('requestList', data)),
      shareReplay(1),
      catchError(this.handleError)
    );



  // All Request List Distributor
  valueRequestDistributor = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + localStorage.getItem('id');
  requestListDistributor$ = this.http.get<IObjectRequest>(`${this.supplierUrl}${'supplier/request_information/lists?'}${this.valueRequestDistributor}`)
    .pipe(
      map((res) => res.response_data),
      tap(data => console.log('requestList', data)),
      shareReplay(1),
      catchError(this.handleError)
    );



  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}

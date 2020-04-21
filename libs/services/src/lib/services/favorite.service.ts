import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, combineLatest, EMPTY, from, merge, Subject, throwError, of } from 'rxjs';
import { catchError, filter, map, mergeMap, scan, shareReplay, tap, toArray, switchMap } from 'rxjs/operators';
import { IObjectVerified, IObjectVerifiedDistList, IObjectSupplier } from '@project/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private supplierUrl = 'https://api.gee-supply.com/v1-sup/';


  constructor(
    private http: HttpClient,
  ) { }

  // All Favorite Distributor
  value = "cur_page=" + 1 + "&per_page=" + 10 + "&supplier_id=" + localStorage.getItem('id');
  farvoriteListDisteibutor$ = this.http.get<IObjectVerified>(`${this.supplierUrl}${'distributor/save_wishlists/lists?'}${this.value}`)
    .pipe(
      map((res) => res.response_data),
      tap(data => console.log('farvorite', data)),
      // shareReplay(1),
      catchError(this.handleError)
    );



  // All Favorite Supplier
  valueFarvoritetSupplier = "cur_page=" + 1 + "&per_page=" + 10 + "&distributor_id=" + localStorage.getItem('id');
  farvoriteListSupplier$ = this.http.get<IObjectSupplier>(`${this.supplierUrl}${'supplier/save_wishlists/lists?'}${this.valueFarvoritetSupplier}`)
    .pipe(
      map((res) => res.response_data),
      tap(data => console.log('farvoriteList', data)),
      // shareReplay(1),
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
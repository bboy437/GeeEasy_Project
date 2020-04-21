import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, combineLatest, EMPTY, from, merge, Subject, throwError, of } from 'rxjs';
import { catchError, filter, map, mergeMap, scan, shareReplay, tap, toArray, switchMap } from 'rxjs/operators';
import { IObjectVerified, IObjectVerifiedDistList } from '@project/interfaces';


@Injectable({
  providedIn: 'root'
})

export class VerifiedService {

  private supplierUrl = 'https://api.gee-supply.com/v1-sup/';

  private categorySelectedSubject = new BehaviorSubject<string>("");
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  // All Verifed Cate Distributor
  verifieds$ = this.http.get<IObjectVerified>(`${this.supplierUrl}${'distributor/list_catalog_verified/'}${localStorage.getItem('id')}`)
    .pipe(
      map((res) => res.response_data),
      tap(data => console.log('verifieds', data)),
      // shareReplay(1),
      catchError(this.handleError)
    );

  // Select Verifed Cate Distributor
  value = "cur_page=" + 1 + "&per_page=" + 100 + "&supplier_id=" + localStorage.getItem('id');
  selectedCategory$ = this.categorySelectedAction$
    .pipe(
      tap(category => console.log('category', category)),
      switchMap((categorys) => this.http.get<IObjectVerifiedDistList>(`${this.supplierUrl}${'distributor/verified/lists?'}${this.value}${'catalog='}${categorys}`)),
      map((res) => res.response_data),
      tap(data => console.log('verifieds', data)),
      shareReplay(1),
    );

  // Change the selected category
  selectedCategoryChanged(category: string): void {
    this.categorySelectedSubject.next(category);
  }



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

import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe, DatePipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortDirection } from '@project/services';
import { PurchaseAPIService } from '@project/services';
import { IPurchaseList, SupplierDataArray } from '@project/interfaces';

interface SearchResult {
  countries: IPurchaseList[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  searchTerm1: any;
  searchStatus1: string;
  searchStatus2: string;
  searchStatus3: string;
  searchStatus4: string;
  startDate: number;
  endDate: number;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(countries: IPurchaseList[], column: string, direction: string): IPurchaseList[] {
  if (direction === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(country: IPurchaseList, term: string, term1: any, status1: string, status2: string, status3: string, status4: string, startDate: number, endDate: number, pipe: PipeTransform) {

  return country.purchase_order_number.toString().toLowerCase().includes(term.toString().toLowerCase())
    && country.supplier_name.every(el => term1 === '' ? country.supplier_name : term1.indexOf(el) > -1)
    && (country.purchase_order_reply_id.toString().toLowerCase().includes(status1.toString().toLowerCase())
      && country.purchase_order_status_display.po_is_delivery.toString().toLowerCase().includes(status2.toString().toLowerCase())
      && country.order_status_btn.button_paid.toString().toLowerCase().includes(status3.toString().toLowerCase())
      && country.purchase_order_status_display.po_is_invoice.toString().toLowerCase().includes(status4.toString().toLowerCase()))
    && (country.purchase_order_create >= startDate && country.purchase_order_create <= endDate)

}



@Injectable({ providedIn: 'root' })
export class PurchaseTableService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<IPurchaseList[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  voneMonthAgo = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 5,
    new Date().getDate()
  );

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    searchTerm1: '',
    searchStatus1: '',
    searchStatus2: '',
    searchStatus3: '',
    searchStatus4: '',
    startDate: (new Date(this.voneMonthAgo)).getTime() / 1000,
    endDate: (new Date()).getTime() / 1000,
    sortColumn: '',
    sortDirection: ''
  };

  arrPurchase: any = [];

  id_local: string;

  constructor(
    private pipe: DecimalPipe,
    private purchaseAPIService: PurchaseAPIService, ) {

    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);

  }

  data(callback) {

    this.purchaseAPIService.purchaseListDistributor$.subscribe(res => {
      this.arrPurchase = res;

      this._search$.pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(100), // 200
        switchMap(() => this._search()),
        delay(100), // 200
        tap(() => this._loading$.next(false))
      ).subscribe(result => {
        this._countries$.next(result.countries);
        this._total$.next(result.total);
        callback(true);
      });

      this._search$.next();

    })

  }

  get countries$() { return this._countries$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get searchTerm1() { return this._state.searchTerm1; }
  get searchStatus1() { return this._state.searchStatus1; }
  get searchStatus2() { return this._state.searchStatus2; }
  get searchStatus3() { return this._state.searchStatus3; }
  get searchStatus4() { return this._state.searchStatus4; }
  get startDate() { return this._state.startDate; }
  get endDate() { return this._state.endDate; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set searchTerm1(searchTerm1: any) { this._set({ searchTerm1 }); }
  set searchStatus1(searchStatus1: string) { this._set({ searchStatus1 }); }
  set searchStatus2(searchStatus2: string) { this._set({ searchStatus2 }); }
  set searchStatus3(searchStatus3: string) { this._set({ searchStatus3 }); }
  set searchStatus4(searchStatus4: string) { this._set({ searchStatus4 }); }
  set startDate(startDate: number) { this._set({ startDate }); }
  set endDate(endDate: number) { this._set({ endDate }); }
  set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {

    const { sortColumn, sortDirection, pageSize, page, searchTerm, searchTerm1, searchStatus1, searchStatus2, searchStatus3, searchStatus4, startDate, endDate } = this._state;

    // 1. sort
    let countries = sort(this.arrPurchase, sortColumn, sortDirection);

    // 2. filter
    countries = countries.filter(country => matches(country, searchTerm, searchTerm1, searchStatus1, searchStatus2, searchStatus3, searchStatus4, startDate, endDate, this.pipe));
    const total = countries.length;

    // 3. paginate
    countries = countries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ countries, total });
  }
}

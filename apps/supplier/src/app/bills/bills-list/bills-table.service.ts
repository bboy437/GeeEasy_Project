import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortDirection } from '@project/services';
import { BillingAPIService } from '@project/services';
import { IBillList } from '@project/interfaces';

interface SearchResult {
  countries: IBillList[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  searchTerm1: any;
  searchTerm2: string;
  searchTerm3: string;
  startDate: number;
  endDate: number;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(countries: IBillList[], column: string, direction: string): IBillList[] {
  if (direction === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(country: IBillList, term: string, term1: any, term2: string, term3: string, startDate: number, endDate: number, pipe: PipeTransform) {
  return country.purchase_order_number.toString().toLowerCase().includes(term.toString().toLowerCase())
    && country.distributor_name.every(el => term1 === '' ? country.distributor_name
      : term1.indexOf(el) > -1)
    && country.purchase_order_paid_id.toString().toLowerCase().includes(term2.toString().toLowerCase())
    && (country.delivery_date >= startDate && country.delivery_date <= endDate)
}

@Injectable({ providedIn: 'root' })
export class BillsableService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<IBillList[]>([]);
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
    searchTerm2: '',
    searchTerm3: '',
    startDate: (new Date(this.voneMonthAgo)).getTime() / 1000,
    endDate: (new Date()).getTime() / 1000,
    sortColumn: '',
    sortDirection: ''
  };

  arrbills: any = [];

  id_local: string;

  constructor(
    private pipe: DecimalPipe,
    private billingAPIService: BillingAPIService, ) {

    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
  }

  getData(callback) {

    this.billingAPIService.billList$.subscribe(res => {
      this.arrbills = res;
      
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
  get searchTerm2() { return this._state.searchTerm2; }
  get searchTerm3() { return this._state.searchTerm3; }
  get startDate() { return this._state.startDate; }
  get endDate() { return this._state.endDate; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set searchTerm1(searchTerm1: any) { this._set({ searchTerm1 }); }
  set searchTerm2(searchTerm2: string) { this._set({ searchTerm2 }); }
  set searchTerm3(searchTerm3: string) { this._set({ searchTerm3 }); }
  set startDate(startDate: number) { this._set({ startDate }); }
  set endDate(endDate: number) { this._set({ endDate }); }
  set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm, searchTerm1, searchTerm2, searchTerm3, startDate, endDate } = this._state;

    // 1. sort
    let countries = sort(this.arrbills, sortColumn, sortDirection);

    // 2. filter
    countries = countries.filter(country => matches(country, searchTerm, searchTerm1, searchTerm2, searchTerm3, startDate, endDate, this.pipe));
    const total = countries.length;

    // 3. paginate
    countries = countries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ countries, total });
  }
}

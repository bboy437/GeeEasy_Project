import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe, DatePipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortDirection, SaleRepService, SellerService, RetailAccountService } from '@project/services';
import { iFSeller, searchResultSeller } from '@project/interfaces';

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(countries: iFSeller[], column: string, direction: string): iFSeller[] {
  if (direction === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(country: iFSeller, term: string, pipe: PipeTransform) {
  return country.create_time.toString().toLowerCase().includes(term.toString().toLowerCase())
    || country.user_name.toString().toLowerCase().includes(term.toString().toLowerCase())
    || country.user_mobile.toString().toLowerCase().includes(term.toString().toLowerCase())
    || country.user_addr_amphoe.toString().toLowerCase().includes(term.toString().toLowerCase())
    || country.user_addr_province.toString().toLowerCase().includes(term.toString().toLowerCase())
}

@Injectable({ providedIn: 'root' })

export class WishlistTableService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<iFSeller[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  private data_api = {
    search: "",
    data_send: {
      dealer_id: "",
      cur_page: 1,
      per_page: 100
    }
  };

  arrWishlist: any = [];

  id_local: string;

  constructor(
    private pipe: DecimalPipe,
    private sellerService: SellerService,
    private saleRepService: SaleRepService,
    private retailAccountService: RetailAccountService) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
  }

  getData(callback: (res, countries$, total$) => any) {
    this.data_api.data_send.dealer_id = this.id_local;
    this.retailAccountService.getRetailAccountLists(this.data_api.data_send).subscribe(res => {
      this.arrWishlist = <iFSeller>res.response_data;
      console.log("getData : arrWishlist : ", this.arrWishlist);
      this._search$.pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(100),
        switchMap(() => this._search()),
        delay(100),
        tap(() => this._loading$.next(false))
      ).subscribe(result => {
        this._countries$.next(result.countries);
        this._total$.next(result.total);
        callback(true, this.countries$, this.total$);
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

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<searchResultSeller> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;
    // 1. sort
    let countries = sort(this.arrWishlist, sortColumn, sortDirection);
    // 2. filter
    countries = countries.filter(country => matches(country, searchTerm, this.pipe));
    const total = countries.length;
    // 3. paginate
    countries = countries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ countries, total });
  }
}

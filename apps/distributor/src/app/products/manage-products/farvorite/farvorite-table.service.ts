import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { Ifarvorite } from '@project/interfaces';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortDirection } from '@project/services';
import { ProductAPIService } from '@project/services';

interface SearchResult {
  countries: Ifarvorite[];
  total: number;
}

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

function sort(countries: Ifarvorite[], column: string, direction: string): Ifarvorite[] {
  if (direction === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(country: Ifarvorite, term: string, pipe: PipeTransform) {
  return country.product_title.toString().toLowerCase().includes(term.toString().toLowerCase()) ||
    country.product_sku.toString().toLowerCase().includes(term.toString().toLowerCase()) ||
    country.product_price.toString().toLowerCase().includes(term.toString().toLowerCase())
}

@Injectable({ providedIn: 'root' })


export class FarvoriteTableService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<Ifarvorite[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  arrFarvorite: any = [];

  id_local: string;

  constructor(
    private pipe: DecimalPipe,
    private productAPIService: ProductAPIService, ) {
    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
  }


  getData(callback) {
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&distributor_id=" + this.id_local;
    this.productAPIService.getFarvoriteList(value).subscribe(data => {
      this.arrFarvorite = <Ifarvorite>data.response_data;
      console.log(this.arrFarvorite);

      if (this.arrFarvorite !== undefined) {
        this.arrFarvorite.forEach(element => {
          element.product_title = element.product_data[0].product_title;
          element.product_image_url = element.product_data[0].product_image_url;
          element.product_sku = element.product_data[0].product_sku;
          element.product_price = element.product_data[0].product_price;
        });
      } else {
        this.arrFarvorite = [];
      }

      // console.log('arrFarvorite',this.arrFarvorite);

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

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
    let countries = sort(this.arrFarvorite, sortColumn, sortDirection);

    // 2. filter
    countries = countries.filter(country => matches(country, searchTerm, this.pipe));
    const total = countries.length;

    // 3. paginate
    countries = countries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ countries, total });
  }
}

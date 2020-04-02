import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { ProductData } from '@project/interfaces';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortDirection } from '@project/services';
import { ProductAPIService } from '@project/services';

interface SearchResult {
  countries: ProductData[];
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

function sort(countries: ProductData[], column: string, direction: string): ProductData[] {
  if (direction === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(country: ProductData, term: string, pipe: PipeTransform) {
  return country.product_sku.toString().toLowerCase().includes(term.toString().toLowerCase())
    || country.product_name.toString().toLowerCase().includes(term.toString().toLowerCase())
    || country.product_price.toString().toLowerCase().includes(term.toString().toLowerCase())

}

@Injectable({ providedIn: 'root' })


export class ProductTableService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<ProductData[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  arrProducts: any = [];
  id_local: string;

  constructor(
    private pipe: DecimalPipe,
    private productAPIService: ProductAPIService, ) {

    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);
  }

  getData(callback) {
    const value = "cur_page=" + 1 + "&per_page=" + 10 + "&supplier_id=" + this.id_local;
    this.productAPIService.getProductListSup(value).subscribe(data => {
      if (data.response_data !== undefined) {
        this.arrProducts = data.response_data;
        console.log(this.arrProducts);

        this.arrProducts.forEach(product => {
            product.checkin_available = 0;
            product.checkin_onhand = 0;
            product.checkin_outgoing = 0;
            product.checkin_incoming = 0;
            if (product.product_warehouse_array !== undefined) {
                if (product.product_warehouse_array.length > 0) {
                    product.product_warehouse_array.forEach(warehouse => {
                        product.checkin_available += warehouse.available;
                        product.checkin_onhand += warehouse.onhand;
                        product.checkin_outgoing += warehouse.outgoing;
                        product.checkin_incoming += warehouse.incoming;
                        product.warehouse_name = warehouse.warehouse_name
                        if (Number.isNaN(product.checkin_available)) {
                            product.checkin_available = 0;
                        }
                        if (Number.isNaN(product.checkin_onhand)) {
                            product.checkin_onhand = 0;
                        }
                        if (Number.isNaN(product.checkin_outgoing)) {
                            product.checkin_outgoing = 0;
                        }
                        if (Number.isNaN(product.checkin_incoming)) {
                            product.checkin_incoming = 0;
                        }
                    });
                }
            }


        });
    }

      console.log('arrProducts', this.arrProducts);

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
    let countries = sort(this.arrProducts, sortColumn, sortDirection);

    // 2. filter
    countries = countries.filter(country => matches(country, searchTerm, this.pipe));
    const total = countries.length;

    // 3. paginate
    countries = countries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ countries, total });
  }
}
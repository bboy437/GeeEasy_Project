import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe, DatePipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortDirection } from '@project/services';
import { DistributorAPIService } from '@project/services';
import { IRequest } from '@project/interfaces';


interface SearchResult {
  countries: IRequest[];
  total: number;
}



interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  searchTerm1: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(countries: IRequest[], column: string, direction: string): IRequest[] {
  if (direction === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(country: IRequest, term: string, term1: string, pipe: PipeTransform) {
  return (country.request_information_from.distributor_name.toString().toLowerCase().includes(term.toString().toLowerCase()) ||
    country.request_information_message.toString().toLowerCase().includes(term.toString().toLowerCase())) &&
    country.verified.toString().toLowerCase().includes(term1.toString().toLowerCase())
}


@Injectable({ providedIn: 'root' })


export class TableService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<IRequest[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    searchTerm1: '',
    sortColumn: '',
    sortDirection: ''
  };

  arrRequestList: any = [];

  id_local: string;

  constructor(
    private pipe: DecimalPipe,

    private distributorAPIService: DistributorAPIService, ) {

    this.id_local = localStorage.getItem('id');
    console.log(' this.id_local', this.id_local);

  }


  getData(callback) {
    const value = "cur_page=" + 1 + "&per_page=" + 20 + "&distributor_id	=" + this.id_local;
    this.distributorAPIService.getRequestList(value).subscribe(data => {
      this.arrRequestList = <IRequest>data.response_data;
      console.log(this.arrRequestList);

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

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set searchTerm1(searchTerm1: string) { this._set({ searchTerm1 }); }
  set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm, searchTerm1 } = this._state;

    // 1. sort
    let countries = sort(this.arrRequestList, sortColumn, sortDirection);

    // 2. filter
    countries = countries.filter(country => matches(country, searchTerm, searchTerm1, this.pipe));
    const total = countries.length;

    // 3. paginate
    countries = countries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ countries, total });
  }
}

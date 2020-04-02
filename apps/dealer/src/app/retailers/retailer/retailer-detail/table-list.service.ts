import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe, DatePipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap, filter } from 'rxjs/operators';
import { SortDirection, SaleRepService, SellerService, RetailProductService } from '@project/services';
import { retailersProduct, searchRetailersProduct } from '@project/interfaces';
import { Router, ActivatedRoute } from '@angular/router';

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

function sort(countries: retailersProduct[], column: string, direction: string): retailersProduct[] {
    if (direction === '') {
        return countries;
    } else {
        return [...countries].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(country: retailersProduct, term: string, pipe: PipeTransform) {
    return country.create_time.toString().toLowerCase().includes(term.toString().toLowerCase())
        || country.product_title.toString().toLowerCase().includes(term.toString().toLowerCase())
        || country.product_sku.toString().toLowerCase().includes(term.toString().toLowerCase())
}

@Injectable({ providedIn: 'root' })

export class WishlistTableService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _countries$ = new BehaviorSubject<retailersProduct[]>([]);
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
            dealer_id: 0,
            retail_id: 0
        }
    };

    arrWishlist: any = [];

    id_local: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pipe: DecimalPipe,
        private sellerService: SellerService,
        private saleRepService: SaleRepService,
        private retailProductService: RetailProductService) {

        this.id_local = localStorage.getItem('id');
        console.log(' this.id_local', this.id_local);
    }

    getData(callback: (res, countries$, total$) => any) {
        const params = this.route.snapshot.paramMap;
        this.data_api.data_send.retail_id = Number(params.get("id"));
        this.data_api.data_send.dealer_id = Number(this.id_local);

        this.retailProductService.getRetailProductLists(this.data_api.data_send).subscribe(res => {
            this.arrWishlist = <retailersProduct>res.response_data;
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

    removeEvent(index: number): void {

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

    private _search(): Observable<searchRetailersProduct> {
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

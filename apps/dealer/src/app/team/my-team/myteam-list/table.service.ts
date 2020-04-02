import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe, DatePipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortDirection, TeamAPIService } from '@project/services';
import { OrderAPIService } from '@project/services';
import { ITeam } from '@project/interfaces';

interface SearchResult {
    countries: ITeam[];
    total: number;
}

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    startDate: number;
    endDate: number;
    sortColumn: string;
    sortDirection: SortDirection;
}

function compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(countries: ITeam[], column: string, direction: string): ITeam[] {
    if (direction === '') {
        return countries;
    } else {
        return [...countries].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(country: ITeam, term: string, pipe: PipeTransform) {
    return country.group_name.toString().toLowerCase().includes(term.toString().toLowerCase())
}

@Injectable({ providedIn: 'root' })
export class TableService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _countries$ = new BehaviorSubject<ITeam[]>([]);
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
        startDate: (new Date(this.voneMonthAgo)).getTime() / 1000,
        endDate: (new Date()).getTime() / 1000,
        sortColumn: '',
        sortDirection: ''
    };

    arrTeam: any = [];

    id_local: string;

    constructor(
        private pipe: DecimalPipe,
        private teamAPIService: TeamAPIService, ) {

        this.id_local = localStorage.getItem('id');
        console.log(' this.id_local', this.id_local);
    }


    getData(callback) {
        const value = "cur_page=" + 1 + "&per_page=" + 10 + "&dealer_id=" + this.id_local + "&group_parent_id=" + 0;
        this.teamAPIService.getTeamList(value).subscribe(data => {
            this.arrTeam = <ITeam>data.response_data;
            console.log(this.arrTeam);

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
    get startDate() { return this._state.startDate; }
    get endDate() { return this._state.endDate; }

    set page(page: number) { this._set({ page }); }
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
    set startDate(startDate: number) { this._set({ startDate }); }
    set endDate(endDate: number) { this._set({ endDate }); }
    set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerm, startDate, endDate } = this._state;

        // 1. sort
        let countries = sort(this.arrTeam, sortColumn, sortDirection);

        // 2. filter
        countries = countries.filter(country => matches(country, searchTerm, this.pipe));

        const total = countries.length;

        // 3. paginate
        countries = countries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({ countries, total });
    }
}

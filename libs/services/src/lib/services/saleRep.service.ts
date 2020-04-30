import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { IObjectSalerep } from '@project/interfaces';

@Injectable({
    providedIn: 'root'
})

export class SaleRepService {

    protected serverApiUrl = "https://api.gee-supply.com/v1-dealer/";

    private dataSaleRepDetail = new BehaviorSubject<any>(null);
    dataSaleRepDetail$ = this.dataSaleRepDetail.asObservable();

    constructor(private http: HttpClient) { }

    // My Sale Rep Supplier
    paramSalerepList = "cur_page=" + 1 + "&per_page=" + 100 + "&supplier_id=" + localStorage.getItem('id');
    salerepList$ = this.http.get<IObjectSalerep>(`${this.serverApiUrl}${'salerep/account/lists?'}${this.paramSalerepList}`)
        .pipe(
            map(salereps => salereps.response_data),
            tap(data => console.log('SalerepList', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );


    // My Sale Rep Disributor
    paramSalerepListDisributor = "cur_page=" + 1 + "&per_page=" + 100 + "&distributor_id=" + localStorage.getItem('id');
    salerepListDisributor$ = this.http.get<IObjectSalerep>(`${this.serverApiUrl}${'salerep/account/lists?'}${this.paramSalerepListDisributor}`)
        .pipe(
            map(salereps => salereps.response_data),
            tap(data => console.log('SalerepList', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );

    // Sale Rep data detail
    dataSaleRep(data): void {
        console.log(data)
        this.dataSaleRepDetail.next(data);
    }


    getApi() {
        let function_ = {
            consoleLog(_function, _title, _data) {
                let _self = this;
                console.log(_function, " : ", _title, " : ", _data);
            },
            buildUrlRequest(params, callback: (res) => any) {
                let _self = this;
                _self.consoleLog("getApi : buildUrlRequest : ", "params : ", params);
                let isArray = params instanceof Array;
                let res = "";
                if (!isArray && typeof params === 'object') {
                    let r = '', i = 0;
                    for (let key in params) {
                        if (res.indexOf('?') == -1 && i <= 0) {
                            r += "?" + key + "=" + params[key];
                        } else {
                            r += "&" + key + "=" + params[key];
                        }
                        i++;
                    }
                    res = res + r;
                    _self.consoleLog("getApi : buildUrlRequest : ", "res : ", res);
                    callback(res);
                } else if (isArray) {
                    let r = "";
                    for (let i = 0; i < params.length; i++) {
                        if (res.indexOf('?') == -1 && i <= 0) {
                            r += "?" + params[i].key + "=" + params[i].value;
                        } else if (i <= 0) {
                            r += "&" + params[i].key + "=" + params[i].value;
                        }
                    }
                    res = res + r;
                    _self.consoleLog("getApi : buildUrlRequest : ", "res : ", res);
                    callback(res);
                }
            },
            getData(api, dataSend, callback: (_self, res) => any) {
                let _self = this;
                _self.consoleLog("getApi : salerepAccountLists : ", "dataSend : ", dataSend);
                _self.buildUrlRequest(dataSend, buildUrlRequest => {
                    _self.consoleLog("getApi : salerepAccountLists : ", "buildUrlRequest : ", buildUrlRequest);
                    callback(_self, api.concat(buildUrlRequest));
                });
            }
        }
        return function_;
    };

    getSalerepAccountLists(dataSend): Observable<any> {
        let res_api = this.serverApiUrl.concat("salerep/account/lists");
        this.getApi().getData(res_api, dataSend, (_self, api) => {
            _self.consoleLog("getSalerepAccountLists : getData : ", "api : ", api);
            res_api = api
        });
        return this.http.get<any>(res_api)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )

    };

    getSalerepAccountDetail(dataSend): Observable<IObjectSalerep> {
        let res_api = this.serverApiUrl.concat("salerep/account/id/" + dataSend);
        return this.http.get<IObjectSalerep>(res_api)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postSalerepAccountUpdate(dataSend): Observable<any> {
        let res_api = this.serverApiUrl.concat("salerep/account/update");
        return this.http.post<any>(res_api, dataSend)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postSalerepAccountCreate(dataSend): Observable<any> {
        let res_api = this.serverApiUrl.concat("salerep/account/create");
        return this.http.post<any>(res_api, dataSend)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }

}
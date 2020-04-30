import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { IRetailerResponse } from '@project/interfaces';

@Injectable({
    providedIn: 'root'
})

export class RetailAccountService {
    protected serverApiUrl = "https://api.gee-supply.com/v1-dealer/";

    private retailerDetail = new BehaviorSubject<any>(null);
    retailerDetail$ = this.retailerDetail.asObservable();


    constructor(private http: HttpClient) { }

    // Retailer List
    paramRetailerList = "cur_page=" + 1 + "&per_page=" + 100 + "&dealer_id=" + localStorage.getItem('id');
    retailerList$ = this.http.get<IRetailerResponse>(`${this.serverApiUrl}${'retail/account/lists?'}${this.paramRetailerList}`)
        .pipe(
            map(retailers => retailers.response_data),
            tap(data => console.log('retailers', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );

    // Retailer data detail
    dataRetailerDetail(data): void {
        console.log(data)
        this.retailerDetail.next(data);
    }


    getApi() {
        const function_ = {
            consoleLog(_function, _title, _data) {
                const _self = this;
                /* 
                    console.log(_function, " : ", _title, " : ", _data);
                */
            },
            buildUrlRequest(params, callback: (res) => any) {
                const _self = this;
                _self.consoleLog("getApi : buildUrlRequest : ", "params : ", params);
                const isArray = params instanceof Array;
                let res = "";
                if (!isArray && typeof params === 'object') {
                    let r = '', i = 0;
                    // tslint:disable-next-line: forin
                    for (const key in params) {
                        if (res.indexOf('?') === -1 && i <= 0) {
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
                        if (res.indexOf('?') === -1 && i <= 0) {
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
                const _self = this;
                _self.consoleLog("getApi : salerepAccountLists : ", "dataSend : ", dataSend);
                _self.buildUrlRequest(dataSend, buildUrlRequest => {
                    _self.consoleLog("getApi : salerepAccountLists : ", "buildUrlRequest : ", buildUrlRequest);
                    callback(_self, api.concat(buildUrlRequest));
                });
            }
        }
        return function_;
    };

    getRetailAccountLists(dataSend): Observable<any> {
        let res_api = this.serverApiUrl.concat("retail/account/lists");
        this.getApi().getData(res_api, dataSend, (_self, api) => {
            _self.consoleLog("getSellerLists : getData : ", "api : ", api);
            res_api = api
        });
        return this.http.get<any>(res_api)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )

    };

    getRetailAccountDetail(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("retail/account/id/" + dataSend);
        return this.http.get<any>(res_api)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postRetailAccountCreate(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("retail/account/create");
        return this.http.post<any>(res_api, dataSend)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postRetailAccountUpdate(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("retail/account/update");
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
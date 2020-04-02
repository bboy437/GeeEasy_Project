import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

@Injectable()

export class RetailProductService {
    protected serverApiUrl = "https://api.gee-supply.com/v1-dealer/";

    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
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


    getRetailProductLists(dataSend): Observable<any> {
        let res_api = this.serverApiUrl.concat("retail/product/lists");
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

    getRetailProductDetail(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("retail/product/id/" + dataSend);
        return this.http.get<any>(res_api)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postRetailProductCreate(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("retail/product/create");
        return this.http.post<any>(res_api, dataSend)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postRetailProductUpdate(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("retail/product/update");
        return this.http.post<any>(res_api, dataSend)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postRetailProductSave(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("retail/product/save");
        return this.http.post<any>(res_api, dataSend)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postRetailProductAdd(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("retail/product/add");
        return this.http.post<any>(res_api, dataSend)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postRetailProductRemove(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("retail/product/remove");
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
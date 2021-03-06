import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { ISellerResponse } from '@project/interfaces';

@Injectable({
    providedIn: 'root'
})


export class SellerService {
    protected serverApiUrl = "https://api.gee-supply.com/v1-dealer/";

    //Seller
    private dataSeller = new BehaviorSubject<any>(null);
    dataSeller$ = this.dataSeller.asObservable();

     //Seller Products
     private dataSellerProducts = new BehaviorSubject<any>(null);
     dataSellerProducts$ = this.dataSellerProducts.asObservable();

    constructor(private http: HttpClient) { }


    // Seller List
    paramSellerList = "cur_page=" + 1 + "&per_page=" + 100 + "&dealer_id=" + localStorage.getItem('id');
    sellerList$ = this.http.get<ISellerResponse>(`${this.serverApiUrl}${'seller/lists?'}${this.paramSellerList}`)
        .pipe(
            map(sellers => sellers.response_data),
            tap(data => console.log('sellers', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );

    // Seller Detail
    dataSellerDetail(data: any): void {
        this.dataSeller.next(data);
    }

    // Seller Product Detail
    dataSellerProductDetail(data: any): void {
        this.dataSellerProducts.next(data);
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

    getSellerLists(dataSend): Observable<any> {
        let res_api = this.serverApiUrl.concat("seller/lists");
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

    getSellerDetail(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("seller/id/" + dataSend);
        return this.http.get<any>(res_api)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getSellerProductDetail(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("seller/product/id/" + dataSend);
        return this.http.get<any>(res_api)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    };

    getSellerProduct(strUrl: string): Observable<any> {
        return this.http.get<any>(this.serverApiUrl + "seller/product/lists/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postSalerepAccountUpdate(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("salerep/account/update");
        return this.http.post<any>(res_api, dataSend)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postSellerCreate(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("seller/create");
        return this.http.post<any>(res_api, dataSend)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postSellerUpdate(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("seller/update");
        return this.http.post<any>(res_api, dataSend)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postProductCreate(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("seller/product/save");
        return this.http.post<any>(res_api, dataSend)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    postUpdateProduct(dataSend): Observable<any> {
        const res_api = this.serverApiUrl.concat("seller/product/update/");
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
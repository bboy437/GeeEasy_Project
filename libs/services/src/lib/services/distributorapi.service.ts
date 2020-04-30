import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { IObjectDistributor } from '@project/interfaces';

@Injectable({
    providedIn: 'root'
})

export class DistributorAPIService {

    //get
    protected ServerApiUrlSup = "https://api.gee-supply.com/v1-sup/";
    protected ServerApiUrlDist = "https://api.gee-supply.com/v1-dist/";
    //post
    protected ServerApiUrlAddWishList = "https://private-anon-7da3873a29-geeesyapiblueprint.apiary-mock.com/supplier/request_information/";
    protected ServerApiUrlAddRequest = "https://nwt0gw8wy8.execute-api.ap-southeast-1.amazonaws.com/Prod/supplier/request_information/submit";



    private myDistributorDetail = new BehaviorSubject<IObjectDistributor>(null);
    myDistributorDetail$ = this.myDistributorDetail.asObservable();

    private selectCategory = new BehaviorSubject<IObjectDistributor>(null);
    selectCategory$ = this.selectCategory.asObservable();


    constructor(private http: HttpClient) {
    }


    //distributor

    value = "cur_page=" + 1 + "&per_page=" + 100 + "&supplier_id=" + localStorage.getItem('id');
    myDistributorList$ = this.http.get<IObjectDistributor>(`${this.ServerApiUrlSup}${'distributor/lists?'}${this.value}`)
        .pipe(
            map(savelist => savelist.response_data),
            tap(data => console.log('savelistSupplier', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );



    dataMyDistributorDetail(data: IObjectDistributor) {
        this.myDistributorDetail.next(data);
    }

    dataSelectCategory(data) {
        this.selectCategory.next(data);
    }


    //get distributor


    getDisDetail(strUrl: string): Observable<IObjectDistributor> {
        return this.http.get<IObjectDistributor>(this.ServerApiUrlDist + "distributor/info/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getdDstributorCreate(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlSup + "distributor/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    getVerifiedDistList(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlSup + "distributor/verified/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    getFavoriteList(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlSup + "distributor/save_wishlists/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getDistList(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlSup + "distributor/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }




    //get Distrbutor Category
    getDistCate(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDist + "distributor/browse_by_product_category_id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }





    //Add Distributor

    addWishList(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlSup + "distributor/request_information/save_wishlist", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addRequest(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlSup + "supplier/request_information/reply", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addDistributor(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDist + "distributor/create", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    updateDistributor(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDist + "distributor/update", objbody)
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


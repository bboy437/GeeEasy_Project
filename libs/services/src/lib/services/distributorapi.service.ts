import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

@Injectable()

export class DistributorAPIService {

    //get
    protected ServerApiUrlSup = "https://api.gee-supply.com/v1-sup/";
    protected ServerApiUrlDist = "https://api.gee-supply.com/v1-dist/";
    //post
    protected ServerApiUrlAddWishList = "https://private-anon-7da3873a29-geeesyapiblueprint.apiary-mock.com/supplier/request_information/";
    protected ServerApiUrlAddRequest =  "https://nwt0gw8wy8.execute-api.ap-southeast-1.amazonaws.com/Prod/supplier/request_information/submit";

    data$: Observable<any>;
    private myMethodSubject = new Subject<any>();
    dataCategory$: Observable<any>;
    private myCategory = new Subject<any>();

    constructor(private http: HttpClient) {
        this.data$ = this.myMethodSubject.asObservable();
        this.dataCategory$ = this.myCategory.asObservable();
    }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            
        })
        
    }

    
    clickData(data) {
        this.myMethodSubject.next(data);
    }

    clickDataCategory(data) {
        this.myCategory.next(data);
    }




    //get distributor
    

    getDisDetail(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlDist + "distributor/info/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getdDstributorCreate(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlSup + "distributor/lists?"  + strUrl)
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

    getVerifiedCate(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlSup + "distributor/list_catalog_verified/" + strUrl)
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

   

    getWishlist(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlSup + "distributor/save_wishlists/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getRequestList(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrlSup + "supplier/request_information/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }
  
    getCatory(): Observable<any> {
        return this.http.get<any>("https://api.gee-supply.com/v1-sup/distributor/list_catalog")
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }




    //Add Distributor

    addWishList(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlSup + "distributor/request_information/save_wishlist" , objbody,)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addRequest(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlSup + "supplier/request_information/reply" , objbody,)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addDistributor(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDist + "distributor/create" , objbody,)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    updateDistributor(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrlDist + "distributor/update" , objbody,)
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


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap, map, switchMap, shareReplay } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { IObjectCategory, IObjectSupplier } from '@project/interfaces';

@Injectable({
    providedIn: 'root'
})

export class SupplierAPIService {


    protected ServerApiUrl = "https://api.gee-supply.com/v1-sup/";

    private tabData = new Subject<any>();
    tabData$ = this.tabData.asObservable();

    private categoryIDSelectedSubject = new BehaviorSubject<number>(null);
    categoryIDSelectedAction$ = this.categoryIDSelectedSubject.asObservable();

    private veririedCategorySelectedSubject = new BehaviorSubject<number>(null);
    veririedCategorySelectedAction$ = this.veririedCategorySelectedSubject.asObservable();

    constructor(private http: HttpClient) {
    }

    //get Supplier List
    valueSupplierList = "cur_page=" + 1 + "&per_page=" + 100 + "&search_text=" + "" + "&distributor_id=" + localStorage.getItem('id');
    supplierList$ = this.categoryIDSelectedAction$
        .pipe(
            tap(category => console.log('category', category)),
            switchMap((categorys) => this.http.get<IObjectSupplier>(`${this.ServerApiUrl}${'supplier/lists?'}${this.valueSupplierList}${'&product_category_id='}${categorys}`)),
            map((res) => res.response_data),
            tap(data => console.log('supplieList', data)),
            shareReplay(1),
        );

    //cate ของตังเอง ฝั่ง distributor
    supplierCate$ = this.http.get<IObjectCategory>(`${this.ServerApiUrl}${'supplier/product_category_my_supplier/'}${localStorage.getItem('id')}`)
        .pipe(
            map((res) => res.response_data),
            tap(data => console.log('supplierCate', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );


    //get Verifird Supplier List
    valueVerifiedSupplierList = "cur_page=" + 1 + "&per_page=" + 100 + "&search_text=" + "" + "&distributor_id=" + localStorage.getItem('id');
    verifiedSupplierList$ = this.veririedCategorySelectedAction$
        .pipe(
            tap(category => console.log('category', category)),
            switchMap((categorys) => this.http.get<IObjectSupplier>(`${this.ServerApiUrl}${'supplier/lists?'}${this.valueSupplierList}${'&product_category_id='}${categorys}`)),
            map((res) => res.response_data),
            tap(data => console.log('supplieList', data)),
            shareReplay(1),
        );


    //cate ของ Verified ฝั่ง distributor
    supplierVerifiedCate$ = this.http.get<IObjectCategory>(`${this.ServerApiUrl}${'supplier/product_category_verified_supplier/'}${localStorage.getItem('id')}`)
        .pipe(
            map((res) => res.response_data),
            tap(data => console.log('supplierVerifiedCate', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );




    // my supplier the selected category
    selectedCategorySupplier(categoryID: number): void {
        this.categoryIDSelectedSubject.next(categoryID);
    }

    // verified supplier  the selected category
    selectedCategoryVerifiesSupplier(categoryID: number): void {
        this.veririedCategorySelectedSubject.next(categoryID);
    }



    tabTitle(data) {
        this.tabData.next(data);
    }



    //get Supplier

    getSupID(strUrl: string): Observable<IObjectSupplier> {
        return this.http.get<IObjectSupplier>(this.ServerApiUrl + "supplier_account/id/" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }


    getVerifiedSupplieList(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "supplier/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

  

    //Add Supplier

    addWishList(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "supplier/request_information/save_wishlist", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addRequest(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "supplier/request_information/submit", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    addSupplier(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "supplier_account/create", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }



    updateSupplier(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "supplier_account/update", objbody)
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


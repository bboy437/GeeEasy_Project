import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { IObjectWarehouse, Iwarehouse } from '@project/interfaces';


@Injectable({
    providedIn: 'root'
})

export class WarehouseAPIService {

    protected ServerApiUrl = "https://api.gee-supply.com/v1/";

    private werehouseDetail = new BehaviorSubject<IObjectWarehouse>(null);
    werehouseDetail$ = this.werehouseDetail.asObservable();

    constructor(private http: HttpClient) {

    }

    // Warehouse List Supplier
    paramSupplierList = "&supplier_id=" + localStorage.getItem('id') + "&warehouse_type_id=" + 1;
    warehouseSupplierList$ = this.http.get<IObjectWarehouse>(`${this.ServerApiUrl}${'warehouse/lists?'}${this.paramSupplierList}`)
        .pipe(
            map(warehouses => warehouses.response_data),
            tap(data => console.log('warehouses', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );

    // Warehouse List Distributor
    paramDistributorList = "&distributor_id=" + localStorage.getItem('id') + "&warehouse_type_id=" + 2;
    warehouseDistributorList$ = this.http.get<IObjectWarehouse>(`${this.ServerApiUrl}${'warehouse/lists?'}${this.paramDistributorList}`)
        .pipe(
            map(warehouses => warehouses.response_data),
            tap(data => console.log('warehouses', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );


    // Warehouse List Dealer
    paramDealerList = "&dealer_id=" + localStorage.getItem('id') + "&warehouse_type_id=" + 3;
    warehouseDealerList$ = this.http.get<IObjectWarehouse>(`${this.ServerApiUrl}${'warehouse/lists?'}${this.paramDealerList}`)
        .pipe(
            map(warehouses => warehouses.response_data),
            tap(data => console.log('warehouses', data)),
            // shareReplay(1),
            catchError(this.handleError)
        );


    dataWarehouse(newData: IObjectWarehouse) {
        console.log(newData)
        this.werehouseDetail.next(newData);
    }



    getWarehouseList(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + "warehouse/lists?" + strUrl)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    getWarehouseDetail(strUrl: string): Observable<IObjectWarehouse> {
        return this.http.get<IObjectWarehouse>(this.ServerApiUrl + "warehouse/id/" + strUrl)
            .pipe(
                tap(data => console.log('getWarehouseDetail: ' + data)),
                catchError(this.handleError)
            )
    }


    addWarehouse(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "warehouse/create", objbody)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    updateWarehouse(objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + "warehouse/update", objbody)
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


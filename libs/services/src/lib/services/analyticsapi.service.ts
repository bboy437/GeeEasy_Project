import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class AnalyticsAPIService {

    protected ServerApiUrl = "http://localhost:3000/";

    constructor(private http: HttpClient) {
    }

    getHeaderContentTypeJson() {
        const headerDict = {
            'authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
        return headerDict;
    }

    get(strUrl: string): Observable<any> {
        return this.http.get<any>(this.ServerApiUrl + strUrl, { headers: this.getHeaderContentTypeJson() });
    }

    post(strUrl: string, objbody: any): Observable<any> {
        return this.http.post<any>(this.ServerApiUrl + strUrl, objbody, { headers: this.getHeaderContentTypeJson() });
    }

    update(strUrl: string, objbody: any): Observable<any> {
        return this.http.put<any>(this.ServerApiUrl + strUrl, objbody, { headers: this.getHeaderContentTypeJson() });
    }


}


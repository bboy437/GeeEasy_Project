import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/do";
import "rxjs/add/operator/delay";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { retry, catchError } from "rxjs/operators";
import { throwError, Subject } from "rxjs";

@Injectable()
export class UploadAPIService {
  constructor(private httpClient: HttpClient) {}

  protected ServerApiUrlDist = "https://api.gee-supply.com/v1-dist/";
  protected ServerApiUrl = "https://api.gee-supply.com/v1/";

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  options = {
    headers: new HttpHeaders({
      "Content-Type": "current_file.type"
    })
  };

  uploadImage() {
    const self = this;
    const _function = {
      consoleLog(_function_title, _title, _data) {
        const _self = this;
        console.log(_function_title, " : ", _title, " : ", _data);
      },
      getUrl(image_url, callback: (res) => any) {
        const _self = this;
        function Object() {
          this.image_status = "old";
          this.image_index = 0;
          this.image_name = "";
          this.image_type = "";
          this.image_url = image_url;
          this.image_event = "";
          /* main */
          this.title = "";
          this.note = "";
          this.status_id = 1;
          this.display_id = 1;
          this.create_time = ~~(Date.now() / 1000);
          this.create_time_string = new Date(Date.now()).toLocaleDateString();
          this.update_time = ~~(Date.now() / 1000);
          this.update_time_string = new Date(Date.now()).toLocaleDateString();
        }
        callback(new Object());
      },
      get(item, callback: (res) => any) {
        const _self = this;
        const _image = {
          index: item.index,
          title: item.title,
          note: item.note,
          name: "",
          type: "",
          result: item.image_url,
          event: ""
        };
        callback(_image);
      },
      format(item, callback: (res) => any) {
        const _self = this;
        function Object() {
          this.image_status = "old";
          this.image_index = item.image_index;
          this.image_name = item.image_name;
          this.image_type = item.image_type;
          this.image_url = item.image_url;
          this.image_event = item.image_event;
          /* main */
          this.title = item.title;
          this.note = item.note;
          this.status_id = item.status_id;
          this.display_id = item.display_id;
          this.create_time = item.create_time;
          this.create_time_string = item.create_time_string;
          this.update_time = item.update_time;
          this.update_time_string = item.update_time_string;
        }
        return new Object();
      },
      imageArray(image_array, callback: (res: any) => any) {
        const _self = this;
        const images = image_array
          .map((red: any) => _self.format(red))
          .sort((a, b) => (a.image_index > b.image_index ? 1 : -1));
        callback(images);
      },
      jsonStringify(dataSend, callback: (res) => any) {
        const _self = this;
        const res = JSON.stringify(dataSend);
        callback(res);
      },
      postImage(dataSend, _image, callback: (red) => any) {
        const _self = this;
        dataSend.file_name = _image.image_name;
        dataSend.file_type = _image.image_type;

        _self.jsonStringify(dataSend, red_dataSend => {
          _self.consoleLog("postImage", "red_dataSend", red_dataSend);
          self.uploadImg(red_dataSend).subscribe(red => {
            red.response_data.forEach(item => {
              self
                .uploadPut(item.file_upload_url, _image.image_event)
                .subscribe(uploadPut => {
                  callback(red);
                });
            });
          });
        });
      },
      getImageArrayState(image_url_array, callback: (red) => any) {
        const _self = this;
        const red = image_url_array.filter(res => res.title === "").length === 0;
        callback(red);
      },
      getImageArray(dataSend, image_url_array, callback: (red) => any) {
        const _self = this;
        _self.consoleLog(
          "getProductImageArray",
          "image_url_array",
          image_url_array
        );
        let image_array = [];
        if (image_url_array.length == 0) callback(image_array);
        image_url_array.forEach(item => {
          function Object() {
            this.image_status = item.image_status;
            this.image_index = item.image_index;
            this.image_name = item.image_name;
            this.image_type = item.image_type;
            this.image_url = item.image_url;
            this.image_event = item.image_event;
            /* main */
            this.title = item.title;
            this.note = item.note;
            this.status_id = item.status_id;
            this.display_id = item.display_id;
            this.create_time = item.create_time;
            this.create_time_string = item.create_time_string;
            this.update_time = item.update_time;
            this.update_time_string = item.update_time_string;
          }
          const image = new Object();
          if (image.image_status == "new") {
            _self.postImage(dataSend, image, red => {
              _self.consoleLog("getProductImageArray", "res", red);
              red.response_data.forEach((item_for: { file_url: any }) => {
                image.image_url = item_for.file_url;
                image_array.push(image);
                if (image_url_array.length === image_array.length)
                  callback(image_array);
              });
            });
          } else {
            image_array.push(image);
            if (image_url_array.length === image_array.length)
              callback(image_array);
          }
        });
      }
    };
    return _function;
  }

  //get

  getFileList(strUrl: string): Observable<any> {
    return this.httpClient
      .get<any>(this.ServerApiUrl + "any/document/file/lists?" + strUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getS3List(): Observable<any> {
    return this.httpClient
      .get<any>(this.ServerApiUrl + "s3/geeesy_attachfile/lists")
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getS3FileList(strUrl: string): Observable<any> {
    return this.httpClient
      .get<any>(this.ServerApiUrl + "s3/geeesy_attachfile/lists/" + strUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  //post

  generateUploadLink(objbody: any): Observable<any> {
    return this.httpClient
      .post<any>(this.ServerApiUrlDist + "server/document/endpoint", objbody)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  finishUploadLink(objbody: any): Observable<any> {
    return this.httpClient
      .post<any>(this.ServerApiUrlDist + "server/document/update", objbody)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  uploadImg(objbody: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.ServerApiUrl + "server/document/endpoint_by_type",
        objbody
      )
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  uploadPut(objbody: any, data: any): Observable<any> {
    return this.httpClient.put<any>(objbody, data).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  //add Doc

  addDoc(objbody: any): Observable<any> {
    return this.httpClient
      .post<any>(this.ServerApiUrl + "any/document/file/create", objbody)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  handleError(error) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}

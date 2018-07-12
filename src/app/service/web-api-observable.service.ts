import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { config } from './config';

@Injectable()
export class WebApiObservableService {
    headers: Headers;
    options: RequestOptions;
    serUrl = config.serverURL;

    constructor(private http: Http) {
         var token_val = sessionStorage.getItem("JWToken") ? sessionStorage.getItem("JWToken") : '';
         token_val = "Bearer " + token_val;
       this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json',Authorization :token_val});
      this.options = new RequestOptions({ headers: this.headers });
    }

    getService(url: string): Observable<any> {

        var token_val = sessionStorage.getItem("JWToken") ? sessionStorage.getItem("JWToken") : '';
        token_val = "Bearer " + token_val;
        this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json',Authorization :token_val});
        this.options = new RequestOptions({ headers: this.headers });
         // var token_val = sessionStorage.getItem("JWToken") ? sessionStorage.getItem("JWToken") : '';
        // token_val = "Bearer " + token_val;
        // console.log("Token_val is :" + token_val);
        // this.headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1IiwidXNlcklkIjoiMSIsInJvbGUiOiJBZG1pbiIsInBhc3N3b3JkIjoicCIsImlhdCI6MTUwODMyMTY0MywiZXhwIjoxNTA4MzIyMjQzfQ.4gLdBaiY30s3FELbUAL_iUmnX6-6c8ZwpGfBdzhonzfF7tiGHtZDQvJ-2VV-A2r-41aWfN3bAuEGaWnE2NoH1Q" });
        // this.options = new RequestOptions({ 'headers': this.headers });
        // console.log("this.options" + this.options);
        // console.log(this.options.headers);
        //let headers_1 = new Headers({'Content-Type': 'application/json', TestHeader: 1111, testtoken:1111});
        //..get(this.serUrl + url, new RequestOptions({headers: headers_1}))
        return this.http
            .get(this.serUrl + url, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getServiceWithDynamicQueryTerm(url: string, key: string, val: string): Observable<any> {
        return this.http
            .get(url + "/?" + key + "=" + val, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getServiceWithFixedQueryString(url: string, param: any): Observable<any> {
        this.options = new RequestOptions({ headers: this.headers, search: 'query=' + param });
        return this.http
            .get(url, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getServiceWithComplexObjectAsQueryString(url: string, param: any): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();
        for (var key in param) {
            if (param.hasOwnProperty(key)) {
                let val = param[key];
                params.set(key, val);
            }
        }
        this.options = new RequestOptions({ headers: this.headers, search: params });
        return this.http
            .get(url, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    createService(url: string, param: any): Observable<any> {
        let body = JSON.stringify(param);
//        console.log(this.options);
        return this.http
            .post(this.serUrl + url, body, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateService(url: string, param: any): Observable<any> {
        let body = JSON.stringify(param);
        return this.http
            .put(url, body, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    patchService(url: string, param: any): Observable<any> {
        let body = JSON.stringify(param);
        return this.http
            .patch(url, body, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteService(url: string, param: any): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();
        for (var key in param) {
            if (param.hasOwnProperty(key)) {
                let val = param[key];
                params.set(key, val);
            }
        }
        this.options = new RequestOptions({ headers: this.headers, search: params });
        return this.http
            .delete(url, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteServiceWithId(url: string, key: string, val: string): Observable<any> {
        return this.http
            .delete(url + "/?" + key + "=" + val, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);

        var errObj =JSON.parse(error.text())
        errObj['status']=error.status;
                return Observable.throw(errObj);
    }
}

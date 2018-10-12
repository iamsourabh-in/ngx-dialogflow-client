import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class DialogflowService {

  private baseURL: string = "https://api.dialogflow.com/v1/query?v=20150910";
  private token: string = 'b5833de0143640918029c8f6349ccd26';

  constructor(private http: Http) { }

  public getResponse(query: string) {
    const data = {
      query: query,
      lang: 'en',
      sessionId: '12345'
    };
    return this.http
      .post(`${this.baseURL}`, data, { headers: this.getHeaders() })
      .map(res => {
        return res.json();
      });
  }

  public getHeaders() {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${this.token}`);
    return headers;
  }
}


import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';



@Injectable()
export class DialogflowService {
  // private baseURL = 'https://dialogflow.googleapis.com/v2beta1/projects/healthapp-7e8f7/agent/sessions/12345:detectIntent';

  private baseURL: string =  'https://api.dialogflow.com/v1/query?v=20150910';
  //'https://cors-anywhere.herokuapp.com/' +



  // private baseURL: string = +'http://localhost:3000/dialogflow';


  private token = 'b5833de0143640918029c8f6349ccd26';

  constructor(private http: Http) { }

  public getResponse(query: string) {
    const data = {
      query: query,
      lang: 'en',
      sessionId: '12345'
    };
    return this.http
      .post(`${this.baseURL}`, data, { headers: this.getHeaders() }).pipe(
      map(res => {
        return res.json();
      }));
  }

  public getHeaders() {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${this.token}`);
    // headers.append('key', '78942ef2c1c98bf10fca09c808d718fa3734703e');
    return headers;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './data.service';
import { URLService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class ControllerAPIService {

  constructor(private http: HttpClient, private URLService: URLService, private dataService: DataService) { }

  // VerifyCaptcha(token: string): any{
  //   var body = {
  //     secret: this.dataService.captchaSecretKey,
  //     response: token
  //   };
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type':  'application/json'
  //     })
  //   }
  //   return this.http.post(this.URLService.captchaVerificationURL, body, httpOptions);
  // }

  CheckValidController(): any{
    var body = this.dataService.controllerData;
    return this.http.post(this.URLService.baseURL + this.URLService.checkValidController, body);
  }

  ControllerLogin(body: object): any{
    return this.http.post(this.URLService.baseURL + this.URLService.controllerLogin, body);
  }

  ExaminationInfo(): any{
    var body = this.dataService.controllerData;
    return this.http.post(this.URLService.baseURL + this.URLService.controllerLogin, body);
  }

  CheckOTP(otp: any): any{
    var body = this.dataService.controllerData;
    return this.http.post(this.URLService.baseURL + this.URLService.checkValidController, body);
  }

}

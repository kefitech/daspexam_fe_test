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

  RecaptchaVerification(body: any): any{
    return this.http.post(this.URLService.baseURL + this.URLService.recaptchaVerification, body);
  }

  CheckValidController(): any{
    var body = this.dataService.controllerData.value;
    return this.http.post(this.URLService.baseURL + this.URLService.checkValidController, body);
  }

  ControllerLogin(body: object): any{
    return this.http.post(this.URLService.baseURL + this.URLService.controllerLogin, body);
  }

  ExaminationInfo(): any{
    var body = this.dataService.controllerData;
    return this.http.post(this.URLService.baseURL + this.URLService.controllerLogin, body);
  }
  
  CheckOTP(body: any): any{
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.baseURL + this.URLService.controllerOTPVerification, body);
  }

  StudentSMPCheck(body: any): any{
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.baseURL + this.URLService.individualStudentSMP, body);
  }
  
  StudentSMPBlock(body: any): any{
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.baseURL + this.URLService.individualStudentSMPBlock, body);
  }

  TimePauseresume(body: any): any{
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.baseURL + this.URLService.individualStudentTimePauseResume, body);
  }

  SubmitExam(body: any): any{
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.baseURL + this.URLService.invigilatorExamSubmit, body);
  }

}

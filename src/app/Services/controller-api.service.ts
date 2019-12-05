import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './data.service';
import { URLService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class ControllerAPIService {

  constructor(private http: HttpClient, private URLService: URLService, private dataService: DataService) { }


  RecaptchaVerification(body: any): any{
    return this.http.post(this.URLService.cloudBaseURL + this.URLService.recaptchaVerificationURL, body);
  }

  CheckValidController(): any{
    var body = this.dataService.controllerData.value;
    return this.http.post(this.URLService.cloudBaseURL + this.URLService.checkValidControllerURL, body);
  }

  ControllerLogin(body: object): any{
    return this.http.post(this.URLService.cloudBaseURL + this.URLService.controllerLoginURL, body);
  }
  
  CheckOTP(body: any): any{
    body = Object.assign(body, this.dataService.controllerData.value);
    return this.http.post(this.URLService.cloudBaseURL + this.URLService.controllerOTPVerificationURL, body);
  }

  ExamFetchFromMainServer(): any{
    return this.http.post(this.URLService.baseURL + this.URLService.examFetchFormCloudServerURL, this.dataService.controllerData.value);
  }

  ExaminationInfo(): any{
    return this.http.post(this.URLService.baseURL + this.URLService.examStudentFetchURL, this.dataService.controllerData.value);
  }

  studentFaceRecognition(body): any{
    body = Object.assign(body, this.dataService.controllerData.value)
    return this.http.post(this.URLService.baseURL + this.URLService.studentFaceRecognitionURL, body);
  }

  SingleStudentVerification(body: object): any{
    body = Object.assign(body, this.dataService.controllerData.value)
    return this.http.post(this.URLService.baseURL + this.URLService.singleStudentVerifyURL, body);
  }

  SubmitAllExams(body: object): any{
    body = Object.assign(body, this.dataService.controllerData.value)
    return this.http.post(this.URLService.baseURL + this.URLService.submitAllExamsURL, body);
  }

  ExaminationInfoForVerifiedStudents(): any{
    return this.http.post(this.URLService.baseURL + this.URLService.examVerifiedStudentFetchURL, this.dataService.controllerData.value);
  }

  //------------------implemented-------------------

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

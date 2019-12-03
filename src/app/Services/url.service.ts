import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class URLService {

  // public captchaVerificationURL = "https://www.google.com/recaptcha/api/siteverify";

  public baseURL = "";
  public cloudBaseURL = "";
  public studentInfo = "api/student_info";
  public hallTicketVerification = "api/conduct_exam/student_login";
  public examDetails = "api/student_exam_info";
  public questionFetch = "api/student_question_fetch";

  //Controller verification
  public checkValidControllerURL = "api/exam/session_verification";

  //Controller login
  public controllerLoginURL = "api/exam/invigilator_login";
  public controllerOTPVerificationURL = "api/exam/invigilator_otp_verification";
  public recaptchaVerificationURL = "api/exam/reCaptcha_verify";

  //Controller Exam Fetch
  public examFetchFormCloudServerURL = "api/conduct_exam/exam_fetch";
  //Controller student fetch
  public examStudentFetchURL = "api/conduct_exam/student_data_fetch";

  public studentFaceRecognitionURL = "api/conduct_exam/face_recognition";

  public individualStudentSMP = "api/exam/smp_verify";
  public individualStudentSMPBlock = "api/exam/smp_block";
  public individualStudentTimePauseResume = "api/exam/time-pause-resume";
  public invigilatorExamSubmit = "api/exam/invigilator_exam_submit";



  public headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

  constructor(private http: HttpClient) {
    this.setBaseURL();
    this.url.subscribe(response => {
      if (response) {
        this.baseURL = response["URL"];
        this.cloudBaseURL = response["CLOUD_URL"];
      }
      else{
        console.log("Unable to set Base URL");
      }
    })
  }
  private url = new BehaviorSubject<object>(null);

  setBaseURL(): any {
    return this.http.get('../../assets/json/baseURL.json').subscribe(
      data => {
        this.url.next(data);
      },
      error => {
        console.log(error);
        
        console.log("Base URL error");
      }
    );
  }

}

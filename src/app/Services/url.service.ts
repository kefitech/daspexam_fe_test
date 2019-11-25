import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class URLService {

  constructor(private http: HttpClient) { 
    this.setBaseURL();
    this.url.subscribe(response => {
      this.baseURL = response;
    })
  }

  // public captchaVerificationURL = "https://www.google.com/recaptcha/api/siteverify";

  public baseURL = "";
  public studentInfo = "api/student_info";
  public hallTicketVerification = "api/hall_ticket_verification";
  public examDetails = "api/student_exam_info";
  public questionFetch = "api/student_question_fetch";

  //Controller verification
  public checkValidController = "api/exam/session_verification";

  //Controller login
  public controllerLogin = "api/exam/invigilator_login";
  public controllerOTPVerification = "api/exam/invigilator_otp_verification";
  public recaptchaVerification = "api/exam/reCaptcha_verify";

  //Controller Exam
  public individualStudentSMP = "api/exam/smp_verify";
  public individualStudentSMPBlock = "api/exam/smp_block";
  public individualStudentTimePauseResume = "api/exam/time-pause-resume";
  public invigilatorExamSubmit = "api/exam/invigilator_exam_submit";

  private url = new BehaviorSubject<string>('');

  public headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});

  setBaseURL(): any {
    return this.http.get('.././assets/json/baseURL.json').subscribe(
      data => {
        this.url.next(data["URL"]);
      },
      error => {
      }
    );
  }

}

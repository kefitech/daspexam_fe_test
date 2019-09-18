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

  public baseURL = "";
  public studentInfo = "api/student_info";
  public hallTicketVerification = "api/hall_ticket_verification";
  public examDetails = "api/student_exam_info";
  public questionFetch = "api/student_question_fetch";

  private url = new BehaviorSubject<string>('');

  public headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});

  setBaseURL(): any {
    return this.http.get('.././assets/json/baseURL.json').subscribe(
      data => {
        this.url.next(data["URL"]);
      },
      error => {
        console.log(error);
      }
    );
  }

}

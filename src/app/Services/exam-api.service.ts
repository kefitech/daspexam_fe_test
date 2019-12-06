import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { URLService } from './url.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamAPIService {

  constructor(private http: HttpClient, private URLService: URLService, private dataService: DataService) { }

  // examDetails(data: any): any{
  //   data["userId"] = this.dataService.body["userId"];
  //   data["sessionId"] = this.dataService.body["sessionId"];
  //   return this.http.post(this.URLService.baseURL + this.URLService.examDetails, data);
  // }

}

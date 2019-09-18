import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { URLService } from './url.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient, private URLService: URLService, private dataService: DataService) { }

  questionFetch(): any{
    var body = this.dataService.body;
    debugger
    this.dataService.studentData.subscribe()
    body["batchId"] = this.dataService.studentData.value["batchId"];
    body["programmeId"] = this.dataService.studentData.value["programmeId"];
    body["courseId"] = this.dataService.studentData.value["courseId"];
    return this.http.post(this.URLService.baseURL + this.URLService.questionFetch, body);
  }

}

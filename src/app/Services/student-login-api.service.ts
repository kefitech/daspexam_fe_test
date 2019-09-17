import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLService } from './url.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class StudentLoginAPIService {

  constructor(private http: HttpClient, private URLService: URLService, private dataService: DataService) { }

  studentDetailData(): any{
    return this.http.post(this.URLService.baseURL + this.URLService.studentInfo, this.dataService.body);
  }

  hallticketValidation(hallticket: string): any{
    return this.http.get(this.URLService.baseURL + `todos/1`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { URLService } from './url.service';

@Injectable({
  providedIn: 'root'
})
export class ControllerAPIService {

  constructor(private http: HttpClient, private URLService: URLService, private dataService: DataService) { }

  CheckValidController(): any{
    var body = this.dataService.controllerCredentials;
    return this.http.post(this.URLService.baseURL + this.URLService.checkValidController, body);
  }

  ControllerLogin(body: object): any{
    return this.http.post(this.URLService.baseURL + this.URLService.controllerLogin, body);
  }

  ExaminationInfo(): any{
    var body = this.dataService.controllerCredentials;
    return this.http.post(this.URLService.baseURL + this.URLService.controllerLogin, body);
  }

}

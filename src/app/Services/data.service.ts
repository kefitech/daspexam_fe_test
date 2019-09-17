import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { 
  }

  public body = {};

  public loader = false;

  public studentData = new BehaviorSubject<object>(null);

  public warning = new BehaviorSubject<boolean>(false);

  public isNotLoginScreen = new BehaviorSubject<boolean>(false);

  public examData = new BehaviorSubject<any>([]);

  public sideNav = new BehaviorSubject<boolean>(true);

  toggleFullScreen() {
    let elem =  docElmWithBrowsersFullScreenFunctions; 
    let methodToBeInvoked = elem.requestFullscreen || 
     elem.webkitRequestFullscreen || elem['mozRequestFullscreen'] || 
     elem['msRequestFullscreen']; 
    if(methodToBeInvoked) methodToBeInvoked.call(elem);
}

}

const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
  mozRequestFullScreen(): Promise<void>;
  webkitRequestFullscreen(): Promise<void>;
  msRequestFullscreen(): Promise<void>;
};

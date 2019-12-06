import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() {
  }

  public PATTERN = {
    email: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$",
    mobilePattern: '[6-9]\\d{9}',
    telephonePattern: '\\s*(?:\\+?\\d{1,3})?[- (]*\\d{3}(?:[- )]*\\d{3})?[- ]*\\d{1,6}(?: *[x/#]\\d+)?\\s*$'
  }

  public encrypetionToken = "DASTP@mgu@*1234*";

  //common

  public sideNav = new BehaviorSubject<boolean>(true);

  public sideNavButton = new BehaviorSubject<boolean>(false);

  //Invigilator

  public controllerLogin = new BehaviorSubject<boolean>(false);

  public controllerData = new BehaviorSubject<any>(null);

  public captchaSecretKey = '6LcQosIUAAAAAL7Nz-WSiW1EgrxmvPDHEnKdGAM9';

  //student

  public studentCredentials = new BehaviorSubject<any>({});

  public studentData = new BehaviorSubject<any>(null);

  public warning = new BehaviorSubject<boolean>(null);

  public isNotLoginScreen = new BehaviorSubject<boolean>(false);

  public questionsData = new BehaviorSubject<any>([]);

  public timer = new BehaviorSubject<number>(null);

  public examStartAndTimer = new BehaviorSubject<any>(null);

  //Exam result - Student
  public examStatus = {};

  toggleFullScreen() {
    let elem = docElmWithBrowsersFullScreenFunctions;
    let methodToBeInvoked = elem.requestFullscreen ||
      elem.webkitRequestFullscreen || elem['mozRequestFullscreen'] ||
      elem['msRequestFullscreen'];
    if (methodToBeInvoked) methodToBeInvoked.call(elem);
  }

  NumberOnly(event: any) {
    const pattern = /^[0-9]*$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();

    }
  }


  RemoveMatTableSource(tableSource: any, tableSourceField: Array<string>): any {
    var table = Object.assign([], tableSource);

    tableSourceField.forEach(elementField => {
      table.forEach(element => {
        element[elementField] = element[elementField]['data'];
      });
    });

    return table;
  }

}

const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
  mozRequestFullScreen(): Promise<void>;
  webkitRequestFullscreen(): Promise<void>;
  msRequestFullscreen(): Promise<void>;
};


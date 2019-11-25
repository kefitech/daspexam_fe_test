import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ControllerAuthService } from 'src/app/Services/controller-auth.service';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, AfterViewInit {

  constructor(private dataService: DataService, private router: Router,
    private deviceService: DeviceDetectorService, private auth: ControllerAuthService, private service: ControllerAPIService,
    private ngxLoader: NgxUiLoaderService, private toastrService: ToastrService) { }

  logo: object = {
    img: "../../../assets/Images/Logo.png",
    alt: "logo"
  }
  user: object;


  ngOnInit() {
    this.dataService.controllerData.next({
      email: localStorage.getItem("email"),
      userId: localStorage.getItem("userId"),
      sessionId: localStorage.getItem("sessionId")
    })
    this.dataService.sideNavButton.next(false);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkValidUser();
    }, 10);
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  // fullScreen(): void {
  //   // Trigger fullscreen
  //   const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
  //     mozRequestFullScreen(): Promise<void>;
  //     webkitRequestFullscreen(): Promise<void>;
  //     msRequestFullscreen(): Promise<void>;
  //   };

  //   if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen && this.deviceService.browser.toLowerCase() == "firefox") { /* Firefox */
  //     docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
  //   } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen && this.deviceService.browser.toLowerCase() == "chrome") { /* Chrome, Safari and Opera */
  //     docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
  //   } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen && this.deviceService.browser.toLowerCase() == "edge") { /* IE/Edge */
  //     docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
  //   }
  //   this.dataService.warning.next(false);
  // }

  //   toggleFullScreen() {
  //    this.dataService.toggleFullScreen()
  //     this.dataService.warning.next(false);
  // }

  // @HostListener('window:resize', ['$event'])
  //   onResize(event){
  //    event.preventDefault();
  //   }

  sideNavToggle(): void {
    this.dataService.sideNav.next(true);
  }

  checkValidUser(): void {
    try {
      this.ngxLoader.start();
      var acceptInstruction = localStorage.getItem('AcceptInstruction');
      var controllerStartExam = localStorage.getItem('controllerExamStart');
      if (localStorage.getItem("userId") && !acceptInstruction && !controllerStartExam) {
        try {
          this.ngxLoader.start();
          this.service.CheckValidController().subscribe(response => {
            if (response.success) {
              var controller = {
                userId: localStorage.getItem("userId"),
                sessionId: localStorage.getItem("sessionId"),
                email: localStorage.getItem("email")
              }
              this.dataService.controllerLogin.next(true);
              this.dataService.controllerData.next(controller);
              this.auth.controllerLoginAuth();
              this.ngxLoader.stop();
              this.router.navigate(["/landing/controller/instruction"]);
            }
            else {
              this.router.navigate(["/landing/controller/login"]);
              this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/controller/login"]);
            this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/controller/login"]);
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else if (localStorage.getItem("userId") && (acceptInstruction && acceptInstruction == 'true')
        && !controllerStartExam) {
        try {
          this.ngxLoader.start();
          this.service.CheckValidController().subscribe(response => {
            if (response.success) {
              var controller = {
                userId: localStorage.getItem("userId"),
                sessionId: localStorage.getItem("sessionId"),
                email: localStorage.getItem("email"),
              }
              this.dataService.controllerLogin.next(true);
              this.dataService.controllerData.next(controller);
              this.auth.controllerLoginAuth();
              this.ngxLoader.stop();
              this.router.navigate(["/landing/controller/dashboard"]);
            }
            else {
              this.router.navigate(["/landing/controller/login"]);
              this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/controller/login"]);
            this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/controller/login"]);
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else if (localStorage.getItem("userId") && (acceptInstruction && acceptInstruction == 'true')
        && (controllerStartExam && controllerStartExam == 'true')) {
        try {
          this.ngxLoader.start();
          this.service.CheckValidController().subscribe(response => {
            if (response.success) {
              var controller = {
                userId: localStorage.getItem("userId"),
                sessionId: localStorage.getItem("sessionId"),
                email: localStorage.getItem("email"),
              }
              this.dataService.controllerLogin.next(true);
              this.dataService.controllerData.next(controller);
              this.auth.controllerLoginAuth();
              this.ngxLoader.stop();
              this.router.navigate(["/landing/controller/examstart"]);
            }
            else {
              this.router.navigate(["/landing/controller/login"]);
              this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/controller/login"]);
            this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/controller/login"]);
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else{
        this.router.navigate(["/landing/controller/login"]);
        this.ngxLoader.stop();
      }
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  LogoutController(): void {
    localStorage.removeItem("userId");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("email");
    localStorage.removeItem("AcceptInstruction");
    localStorage.removeItem("questionShuffled");
    localStorage.removeItem('controllerExamStart');
    this.dataService.controllerLogin.next(false);
    this.dataService.controllerData.next(null);
    this.auth.controllerLogoutAuth();
    this.router.navigate(["/landing/controller/login"]);
    // window.location.reload();
  }


}

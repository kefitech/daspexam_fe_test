import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/Services/data.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { ControllerAuthService } from 'src/app/Services/controller-auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { InvigilatorOTPPopupComponent } from 'src/app/Popup/invigilator-otppopup/invigilator-otppopup.component';

@Component({
  selector: 'app-controller-login',
  templateUrl: './controller-login.component.html',
  styleUrls: ['./controller-login.component.scss']
})
export class ControllerLoginComponent implements OnInit, AfterViewInit {

  constructor(private formbuilder: FormBuilder, private dataService: DataService, private ngxLoader: NgxUiLoaderService,
    private toastrService: ToastrService, private service: ControllerAPIService,
    private auth: ControllerAuthService, private router: Router, private dialog: MatDialog) { }

  @ViewChild('recaptcha', { static: true }) recaptchaElement: ElementRef;

  showPass: boolean = false;
  passIcon: string = "visibility_off";

  captchaValid: boolean = false;

  loginForm: FormGroup;
  loginFormCaption: object = {
    caption1: "Email",
    caption2: "Password"
  };
  loginFormData: object = {
    email: ['', [Validators.required, Validators.pattern(this.dataService.PATTERN.email)]],
    password: ['', [Validators.required]]
  };
  ERROR: object = {
    required: "Please fill out this!",
    emailPattern: "Please enter valid email!"
  };

  ngOnInit() {
    this.loginForm = this.formbuilder.group(this.loginFormData);
    this.addRecaptchaScript();
  }

  ngAfterViewInit(){

  }

  togglePass() {
    this.showPass = !this.showPass;
    if (this.showPass)
      this.passIcon = "visibility";
    else
      this.passIcon = "visibility_off";
  };

  Submit(): void {
    try {
      this.ngxLoader.start();
      if (this.loginForm.valid && this.captchaValid) {
        // this.service.ControllerLogin(this.loginForm.value).subscribe(response => {
        //   if(response.success){
        //     localStorage.setItem("controllerId", "1");
        //     localStorage.setItem("controllerSessionId", "abcde");
        //     this.auth.controllerLogin();
        //     this.router.navigate(["/landing/controller/dashboard"]);
        //   }
        //   else{

        //   }
        // }, error => {
        //   this.toastrService.error(error.message);
        //   this.ngxLoader.stop();
        // })
        this.dataService.controllerData.next({
          controllerMail: this.loginForm.value.email,
          controllerId: 1,
          controllerSessionId: "abcde"
        });
        localStorage.setItem("controllerMail", this.loginForm.value.email);
        localStorage.setItem("controllerId", "1");
        localStorage.setItem("controllerSessionId", "abcde");
        this.ngxLoader.stop();
        this.OpenOTPPopup();
        // this.router.navigate(["/landing/controller/dashboard"]);
      }
      else if(this.loginForm.invalid){
        this.toastrService.error("Mandatory data missing!");
        this.ngxLoader.stop();
      }
      else if(!this.captchaValid){
        this.toastrService.error("Captcha not valid!");
        this.ngxLoader.stop();
      }
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  OpenOTPPopup(): void {
    const dialogRef = this.dialog.open(InvigilatorOTPPopupComponent, {
      minWidth: '20%'
    })
    dialogRef.afterClosed().subscribe(response => {
      var isSubmit = dialogRef.componentInstance.isSubmit;
      var otp = dialogRef.componentInstance.otpForm.value.otp;
      if (isSubmit)
        this.CheckOTP(otp);
    })
  }

  addRecaptchaScript() {

    window['grecaptchaCallback'] = () => {
      this.renderReCaptcha();
    }

    (function (d, s, id, obj) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'recaptcha-jssdk', this));

  }

  renderReCaptcha() {
    window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
      'sitekey': this.dataService.captchaSecretKey,
      'callback': (response) => {
          this.captchaValid = true;
      },
      'expired-callback': (response) => {
        this.captchaValid = false;
      }
    });
  }

  CheckOTP(otp: number): void {
    try {
      this.ngxLoader.start();
      // this.service.CheckOTP(otp).subscribe(response => {
      //   if (response.success) {
          this.dataService.controllerLogin.next(true);
          this.auth.controllerLoginAuth();
          this.router.navigate(["/landing/controller/instruction"]);
        // }
        // else {
        //   this.toastrService.error(response.message);
          this.ngxLoader.stop();
        // }
      // }, error => {
      //   this.toastrService.error(error.message);
      //   this.ngxLoader.stop();
      // })
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  // VerifyCaptcha(token: string): void{
  //   try{
  //     this.ngxLoader.start();
  //     this.service.VerifyCaptcha(token).subscribe(response => {
  //       console.log(response);

  //       this.captchaValid = response;
  //     }, error => {
  //       this.toastrService.error(error.message);
  //     this.ngxLoader.stop();
  //     })
  //   }
  //   catch (e){
  //     this.toastrService.error(e);
  //     this.ngxLoader.stop();
  //   }
  // }

}

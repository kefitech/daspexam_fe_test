import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/Services/data.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { ControllerAuthService } from 'src/app/Services/controller-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-controller-login',
  templateUrl: './controller-login.component.html',
  styleUrls: ['./controller-login.component.scss']
})
export class ControllerLoginComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private dataService: DataService, private ngxLoader: NgxUiLoaderService,
    private toastrService: ToastrService, private service: ControllerAPIService,
    private auth: ControllerAuthService, private router: Router) { }

  showPass: boolean = false;
  passIcon: string = "visibility_off";

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
      if (this.loginForm.valid) {
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
      this.dataService.controllerLogin.next(true);
      this.dataService.controllerData.next({
        controllerMail: this.loginForm.value.email,
        controllerId: 1,
        controllerSessionId: "abcde"
      });
        localStorage.setItem("controllerMail", this.loginForm.value.email);
        localStorage.setItem("controllerId", "1");
        localStorage.setItem("controllerSessionId", "abcde");
        this.auth.controllerLoginAuth();
        this.ngxLoader.stop();
        this.router.navigate(["/landing/controller/dashboard"]);
      }
      else {
        this.toastrService.error("Mandatory data missing!");
        this.ngxLoader.stop();
      }
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

}

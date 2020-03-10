import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ExamAPIService } from 'src/app/Services/exam-api.service';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit {

  constructor(private dialogScreen: MatDialogRef<WarningComponent>, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private toastrService: ToastrService,
    private router: Router, private ngxLoader: NgxUiLoaderService, private apiService: ExamAPIService) { }

  formCaption: string = "Enter the Key";
  lockForm: FormGroup;
  error: object = {
    required: "Please fill out this!"
  };

  inputType: string = "abc";

  numKeyboard: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  lowerCaseCharactersKeyboard: any = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  upperCaseCharactersKeyboard: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  keyboardValue: any;

  upperCase: boolean = false;

  ngOnInit() {
    this.keyboardValue = this.numKeyboard;
    this.formSetup();
  }

  formSetup(): void {
    this.lockForm = this.formBuilder.group({
      smpOtp: ['', [Validators.required]]
    })
  }

  Submit(): void {
    try {
      if (this.lockForm.valid) {
        try {
          this.apiService.UnlockStudentSMP(this.lockForm.value).subscribe(response => {
            if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
              this.dataService.LogOut();
            }
            else if (response.success) {
              this.dataService.isNotLoginScreen.next(false);
              this.dataService.sideNavButton.next(false);
              this.dataService.warning.next(false);
              // this.dataService.toggleFullScreen();
              localStorage.removeItem('SMP');
              sessionStorage.removeItem('studentExamStart');
              this.dialogScreen.close();
              this.toastrService.success(response.message);
              sessionStorage.setItem('instruction', 'normal');
              // this.router.navigate(['/landing/student']);
            }
            else {
              this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else {
        this.toastrService.error("Mandatory data missing!");
      }
    }
    catch (e) {
      this.toastrService.error(e.message);
    }
  }

  KeyboardTypeChange(): void {
    if (this.inputType == "abc") {
      this.upperCase = false;
      this.inputType = "123";
      this.keyboardValue = this.lowerCaseCharactersKeyboard;
    }
    else if (this.inputType == "123") {
      this.inputType = "abc";
      this.keyboardValue = this.numKeyboard;
    }
  }

  InputChange(value: string, event: any): void {
    this.lockForm.controls['smpOtp'].setValue(this.lockForm.value.smpOtp + value);
  }

  LowerUperCaseChange(value: string): void {
    this.upperCase = !this.upperCase;
    if (!this.upperCase) {
      this.keyboardValue = this.lowerCaseCharactersKeyboard;
    }
    else if (this.upperCase) {
      this.keyboardValue = this.upperCaseCharactersKeyboard;
    }
  }

  Space(): void {
    this.lockForm.controls['smpOtp'].setValue(this.lockForm.value.smpOtp + ' ');
  }

  Backspace(): void {
    if (this.lockForm.value.smpOtp)
      this.lockForm.controls['smpOtp'].setValue(this.lockForm.value.smpOtp.slice(0, -1));
  }

  Clear(): void{
    this.lockForm.controls['smpOtp'].setValue('');
  }

  ResetMenu(): void{
    this.keyboardValue = this.numKeyboard;
    this.upperCase = false;
    this.inputType = "abc";
  }

}

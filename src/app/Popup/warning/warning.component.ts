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

  ngOnInit() {
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
            if (response.success) {
              this.dataService.isNotLoginScreen.next(false);
              this.dataService.sideNavButton.next(false);
              this.dataService.warning.next(false);
              // this.dataService.toggleFullScreen();
              localStorage.removeItem('SMP');
              this.dialogScreen.close();
              this.toastrService.success(response.message);
              this.router.navigate(['/landing/student']);
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

}

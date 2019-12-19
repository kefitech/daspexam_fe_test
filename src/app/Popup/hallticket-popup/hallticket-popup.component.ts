import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StudentLoginAPIService } from 'src/app/Services/student-login-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hallticket-popup',
  templateUrl: './hallticket-popup.component.html',
  styleUrls: ['./hallticket-popup.component.scss'],
  providers: [
    DatePipe
  ]
})
export class HallticketPopupComponent implements OnInit, AfterViewInit {

  constructor(private dialogScreen: MatDialogRef<HallticketPopupComponent>, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private toastrService: ToastrService, private formBuilder: FormBuilder,
    private service: StudentLoginAPIService, private ngxLoader: NgxUiLoaderService, private datePipe: DatePipe) { }

  maxDate: Date = new Date();

  formCaption: object = {
    caption1: "Enter your hallticket number",
    caption2: "Choose your Date of Birth"
  };
  hallticketForm: FormGroup;
  error: object = {
    required: "Please fill out this!"
  };
  submit: boolean = false;

  studentData: any;

  ngOnInit() {
    this.formSetup();
  }

  ngAfterViewInit() {
    var today = new Date();
    var currentYear = today.getFullYear();
    var minimizedYear = currentYear - 15;
    this.maxDate = new Date("12-31-" + minimizedYear);
  }

  formSetup(): void {
    this.hallticketForm = this.formBuilder.group({
      hallTicketNumber: ['', [Validators.required]],
      birthDate: ['', [Validators.required]]
    })
  }

  Submit(): void {
    try {
      this.ngxLoader.start();
      var body = this.hallticketForm.value;
      body['birthDate'] = this.datePipe.transform(this.hallticketForm.value.birthDate, "yyyy-MM-dd");
      if (this.hallticketForm.valid) {
        this.service.hallTicketVerification(this.hallticketForm.value).subscribe(response => {
          if (response.success) {
            this.studentData = response;
            this.dataService.studentCredentials.next({
              examStudentId: response.data.examStudentId
            })
            this.dataService.studentData.next(response.data)
            sessionStorage.setItem('Token', response.data.token);
            sessionStorage.setItem('examStudentId', response.data.examStudentId);
            this.submit = true;
            this.ngxLoader.stop();
            this.dialogScreen.close();
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
      else {
        this.toastrService.error("Mandatory data missing!");
        this.ngxLoader.stop();
      }
    }
    catch (e) {
      this.toastrService.error("Mandatory data missing!");
      this.ngxLoader.stop();
    }
  }


  _keyPress(event: any) {
    this.dataService.NumberOnly(event);
  }

}

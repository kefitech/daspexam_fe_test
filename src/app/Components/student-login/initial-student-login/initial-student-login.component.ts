import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { StudentLoginAPIService } from 'src/app/Services/student-login-api.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { HallticketAuthService } from 'src/app/Services/hallticket-auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HallticketPopupComponent } from 'src/app/Popup/hallticket-popup/hallticket-popup.component';
import { EncryptionService } from 'src/app/Services/encryption.service';

@Component({
  selector: 'app-initial-student-login',
  templateUrl: './initial-student-login.component.html',
  styleUrls: ['./initial-student-login.component.scss']
})
export class InitialStudentLoginComponent implements OnInit, AfterViewInit {

  constructor(private dataService: DataService, private apiService: StudentLoginAPIService,
    private dialog: MatDialog, private route: ActivatedRoute, private formBuilder: FormBuilder,
    private router: Router, private auth: HallticketAuthService, private toastrService: ToastrService,
    private ngxLoader: NgxUiLoaderService, private encryptionService: EncryptionService) { }

  caption: object;
  studentData: object;
  int: any;

  valid: boolean = false;

  ngOnInit() {
    // this.showPopup();
    // this.Interval();
    this.dataService.studentData.next(null);
  }

  ngAfterViewInit() {
    var studentData = localStorage.getItem('studentData');
    if (studentData) {
      var dec = this.encryptionService.decryptUsingAES256(studentData);
      this.studentData = JSON.parse(JSON.parse(dec));
    }
    else
      this.EnterHallticket();
    this.loadData();
  }

  loadData(): void {
    this.caption = {
      examName: "Examination Name",
      examDate: "Examination Date",
      examTime: "Exam Time",
      programmeName: "Programme Name",
      batchName: "Batch Name",
      courseName: "Course Name",
      studentName: "Student Name",
      studyCentre: "Exam Center",
      duration: "Exam Duration",
      hallTicketNumber: "Hall Ticket",
      studyCentreCode: "Exam Centre Code"
    };
  }

  Submit(): void {
    try {
      this.auth.hallTicketValid();
      this.dataService.toggleFullScreen();
      this.dataService.isNotLoginScreen.next(true);
      this.router.navigate(['/landing/student/exam']);
      this.ngxLoader.stop();
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }


  EnterHallticket(): void {
    const dialog = this.dialog.open(HallticketPopupComponent,
      {
        minWidth: '25%',
        disableClose: true
      });
    dialog.afterClosed().subscribe(response => {
      this.valid = dialog.componentInstance.submit;
      if (this.valid) {
        var studentLoginResponse = dialog.componentInstance.studentData;
        this.toastrService.success(studentLoginResponse.message);
        this.studentData = studentLoginResponse.data.examInfo[0];
        var stringifyStudentData = JSON.stringify(this.studentData);
        var encryptedStudentData = this.encryptionService.encryptUsingAES256(stringifyStudentData);
        localStorage.setItem('studentData', encryptedStudentData);
        this.studentData["duration"] = this.studentData["duration"] + " Minutes";
        this.dataService.studentData.next(this.studentData);
        localStorage.setItem("loginUser", 'student');
      }
    }, error => {
      this.toastrService.error(error);
    })
  }

}

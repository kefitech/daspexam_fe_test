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

@Component({
  selector: 'app-initial-student-login',
  templateUrl: './initial-student-login.component.html',
  styleUrls: ['./initial-student-login.component.scss']
})
export class InitialStudentLoginComponent implements OnInit, AfterViewInit {

  constructor(private dataService: DataService, private apiService: StudentLoginAPIService,
    private dialog: MatDialog, private route: ActivatedRoute, private formBuilder: FormBuilder,
    private router: Router, private auth: HallticketAuthService, private toastrService: ToastrService,
    private ngxLoader: NgxUiLoaderService) { }

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
    this.EnterHallticket();
    this.loadData();
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.route.params.subscribe(params => {
  //       var uid = params["uid"];
  //       var sessionId = params["sessionid"];
  //       var examId = params["examid"];
  //       localStorage.setItem("userId", uid);
  //       localStorage.setItem("sessionId", sessionId);
  //       localStorage.setItem("examId", examId);
  //       this.dataService.body["userId"] = uid;
  //       this.dataService.body["sessionId"] = sessionId;
  //       this.dataService.body["examId"] = examId;

  //       if (params)
  //         this.studentDetails();
  //     });
  //   }, 100);
  // }



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

  // studentDetails(): void {
  //   try {
  //     this.ngxLoader.start();
  //     this.apiService.studentDetailData().subscribe(response => {
  //       if (response.success) {
  //         this.ngxLoader.stop();
  //         this.studentData = response.data.examList[0];
  //         // this.studentData = {
  //         //   exam: "Certificate in water management",
  //         //   examName: "Water management exam",
  //         //   examDate: "12-02-2018",
  //         //   examTime: "11:15 A.M",
  //         //   examDuration: "240",
  //         //   programmeName: "Certificate in water harvesting",
  //         //   batchName: "BH08767",
  //         //   courseName: "Environmental studies",
  //         //   studyCenter: "Block1",
  //         //   fullName: "Watson T",
  //         //   photo: "https://homepages.cae.wisc.edu/~ece533/images/monarch.png",
  //         //   address1: "Hall Street",
  //         //   address2: "West-Nagercoil",
  //         //   city: "Nagercoil",
  //         //   state: "Tamil Nadu",
  //         //   country: "India",
  //         //   semesterType: "Semester",
  //         //   semester: "2"
  //         // }
  //         this.studentData["examDuration"] = this.studentData["examDuration"] + " Minutes";
  //         this.dataService.studentData.next(this.studentData);
  //       }
  //       else {
  //         this.toastrService.error(response.message);
  //         this.ngxLoader.stop();
  //       }
  //     }, error => {
  //       this.toastrService.error(error.message);
  //       this.ngxLoader.stop();
  //     })
  //   }
  //   catch (e) {
  //     this.toastrService.error(e);
  //     this.ngxLoader.stop();
  //   }
  // }

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
        this.studentData["duration"] = this.studentData["duration"] + " Minutes";
        this.dataService.studentData.next(this.studentData);
        localStorage.setItem("loginUser", 'student');
      }
    }, error => {
      this.toastrService.error(error);
    })
  }

}

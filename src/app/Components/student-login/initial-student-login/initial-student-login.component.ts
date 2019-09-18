import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { StudentLoginAPIService } from 'src/app/Services/student-login-api.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { HallticketAuthService } from 'src/app/Services/hallticket-auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-initial-student-login',
  templateUrl: './initial-student-login.component.html',
  styleUrls: ['./initial-student-login.component.scss']
})
export class InitialStudentLoginComponent implements OnInit {

  constructor(private dataService: DataService, private apiService: StudentLoginAPIService,
    private dialog: MatDialog, private route: ActivatedRoute, private formBuilder: FormBuilder,
    private router: Router, private auth: HallticketAuthService, private toastrService: ToastrService,
    private ngxLoader: NgxUiLoaderService) { }

  caption: object;
  studentData: object;
  int: any;

  formCaption: string = "Enter the hallticket number";
  hallticketForm: FormGroup;
  error: object = {
    required: "Please fill out this!"
  };

  ngOnInit() {
    // this.showPopup();
    this.loadData();
    this.formSetup();
    // this.Interval();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.route.params.subscribe(params => {
        var uid = params["uid"];
        var sessionId = params["sessionid"];
        var examId = params["examid"];
        localStorage.setItem("userId", uid);
        localStorage.setItem("sessionId", sessionId);
        localStorage.setItem("examId", examId);
        this.dataService.body["userId"] = uid;
        this.dataService.body["sessionId"] = sessionId;
        this.dataService.body["examId"] = examId;

        if (params)
          this.studentDetails();
      });
    }, 100);
  }

  formSetup(): void {
    this.hallticketForm = this.formBuilder.group({
      hallticket: ['', [Validators.required]]
    })
  }

  loadData(): void {
    this.caption = {
      exam: "Examination Name: ",
      examDate: "Examination Date: ",
      examTime: "Exam Time: ",
      programme: "Programme Name: ",
      batchName: "Batch Name: ",
      course: "Course Name: ",
      studentName: "Student Name",
      studyCenter: "Study Center: ",
      examDuration: "Exam Duration: "
    };
  }

  studentDetails(): void {
    try {
      this.ngxLoader.start();
      this.apiService.studentDetailData().subscribe(response => {
        if (response.success) {
          this.ngxLoader.stop();
          this.studentData = response.data.examList[0];
          this.studentData["examDuration"] = this.studentData["examDuration"] + " Minutes";
          this.dataService.studentData.next(this.studentData);
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

  // Interval(): void{
  //  this.int = setInterval(() => {
  //     this.studentDetails();
  //   }, 1000);

  // }

  Submit(): void {
    try {
      // this.auth.hallTicketValid();
      //     this.dataService.toggleFullScreen();
      //     this.dataService.isNotLoginScreen.next(true);
      //     this.router.navigate(['/landing/student/exam']);
      this.ngxLoader.start();
      if (this.hallticketForm.valid && this.studentData) {
        var body = this.dataService.body;
        body["batchId"] = this.studentData["batchId"];
        body["programmeId"] = this.studentData["programmeId"];
        body["registerNo"] = parseInt(this.hallticketForm.value.hallticket);

        this.apiService.hallTicketVerification(body).subscribe(response => {
          if (response.success) {
            this.auth.hallTicketValid();
            this.dataService.toggleFullScreen();
            this.dataService.isNotLoginScreen.next(true);
            this.router.navigate(['/landing/student/exam']);
            this.ngxLoader.stop();
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
      else if (this.hallticketForm.invalid) {
        this.toastrService.error("Mandatory data missing");
        this.ngxLoader.stop();
      }
      else if (!this.studentData) {
        this.toastrService.error("Student data not available");
        this.ngxLoader.stop();
      }
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  _keyPress(event: any) {
    this.dataService.NumberOnly(event);
  }

}

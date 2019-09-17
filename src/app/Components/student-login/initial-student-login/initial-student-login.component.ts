import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { StudentLoginAPIService } from 'src/app/Services/student-login-api.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { HallticketAuthService } from 'src/app/Services/hallticket-auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-initial-student-login',
  templateUrl: './initial-student-login.component.html',
  styleUrls: ['./initial-student-login.component.scss']
})
export class InitialStudentLoginComponent implements OnInit {

  constructor(private dataService: DataService, private apiService: StudentLoginAPIService,
    private dialog: MatDialog, private route: ActivatedRoute, private formBuilder: FormBuilder,
    private router: Router, private auth: HallticketAuthService, private toastrService: ToastrService) { }

  caption: object;
  studentData: object;
  int: any;

  formCaption: string = "Enter the hallticket number";
  hallticketForm: FormGroup;
  error: object = {
    required: "Please fill out this!"
  };

  ngOnInit() {
    this.dataService.loader = true;
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
        console.log(this.dataService.body);
        
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
      programme: "Programme Name: ",
      course: "Course Name: ",
      studentName: "Student Name",
      examCenter: "Exam Center: ",
      examDuration: "Exam Duration: "
    };
  }

  studentDetails(): void {
    try {
      this.apiService.studentDetailData().subscribe(response => {
        if (response.success) {
          this.dataService.loader = false;
          this.studentData = response.data;
          this.dataService.studentData.next(this.studentData);
        }
        else {
          this.toastrService.error(response.message);
          this.dataService.loader = false;
        }
      }, error => {
        this.toastrService.error(error.message);
        this.dataService.loader = false;
      })
    }
    catch (e) {
      this.toastrService.error(e);
      this.dataService.loader = false;
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
      this.dataService.loader = true;
      if (this.hallticketForm.valid && this.studentData) {
        this.apiService.studentDetailData().subscribe(response => {
          this.dataService.loader = false;
          this.auth.hallTicketValid();
          this.dataService.toggleFullScreen();
          this.dataService.isNotLoginScreen.next(true);
          this.router.navigate(['/landing/student/exam']);
        }, error => {
          this.toastrService.error(error.message);
          this.dataService.loader = false;
        })
      }
      else if (this.hallticketForm.invalid) {
        this.toastrService.error("Mandatory data missing");
        this.dataService.loader = false;
      }
      else if (!this.studentData) {
        this.toastrService.error("Student data not available");
        this.dataService.loader = false;
      }
    }
    catch (e) {
      this.toastrService.error(e);
      this.dataService.loader = false;
    }
  }

}

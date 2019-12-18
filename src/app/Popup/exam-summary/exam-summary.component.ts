import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-exam-summary',
  templateUrl: './exam-summary.component.html',
  styleUrls: ['./exam-summary.component.scss']
})
export class ExamSummaryComponent implements OnInit, AfterViewInit {

  constructor(private dialogScreen: MatDialogRef<ExamSummaryComponent>, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private examService: ExamAPIService,
    private toastrService: ToastrService, private ngxLoader: NgxUiLoaderService) { }

  result: any;

  ngOnInit() {
  }

  ngAfterViewInit() {
    try {
      this.ngxLoader.start();
      this.examService.StudentExamSummary().subscribe(response => {
        if (response.success) {
          this.result = response.data;
          localStorage.removeItem("loginUser");
          localStorage.removeItem("Token");
          localStorage.removeItem("studentData");
          localStorage.removeItem("studentSubjectSpecificInstruction");
          localStorage.removeItem("questionFetch");
          localStorage.removeItem("examStudentId");
          localStorage.removeItem("studentCommonInstruction");
          localStorage.removeItem('studentExamStart');
          this.dataService.studentCredentials.next({});
          this.dataService.studentData.next({});
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
    catch (e) {
      this.toastrService.error(e.message);
      this.ngxLoader.stop();
    }
  }

  Done(): void {
    this.router.navigate(["/landing/student/initial"]);
    this.dialogScreen.close();
    // setTimeout(() => {
    //   window.location.reload();
    // }, 100);
  }

}

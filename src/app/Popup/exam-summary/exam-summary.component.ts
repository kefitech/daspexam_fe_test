import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-summary',
  templateUrl: './exam-summary.component.html',
  styleUrls: ['./exam-summary.component.scss']
})
export class ExamSummaryComponent implements OnInit {

  constructor(private dialogScreen: MatDialogRef<ExamSummaryComponent>, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) { }

  result: any;

  ngOnInit() {
    debugger
    this.result = this.dataService.examStatus;
  }

  MoveToMarkList(): void{
    this.router.navigate(["/landing/student/exam/marklist"]);
    this.dialogScreen.close();
  }

}

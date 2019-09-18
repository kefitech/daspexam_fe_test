import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam-summary',
  templateUrl: './exam-summary.component.html',
  styleUrls: ['./exam-summary.component.scss']
})
export class ExamSummaryComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  Submit(): void{
    this.router.navigate(["landing/student/exam/marklist"]);
  }

}

import { Component, OnInit, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material';
import { ExamSummaryComponent } from 'src/app/Popup/exam-summary/exam-summary.component';

@Component({
  selector: 'app-exam-start',
  templateUrl: './exam-start.component.html',
  styleUrls: ['./exam-start.component.scss']
})
export class ExamStartComponent implements OnInit {

  constructor(private toastrService: ToastrService, private router: Router, private dataService: DataService,
    private ngxLoader: NgxUiLoaderService, private dialog: MatDialog) { }
  timerConfig: any;
  time: number;
  sideNav: boolean = false;
  examinationData: any;
  activeIndex: number = 0;
  answers: any = [];

  ngOnInit() {
    this.dataService.sideNavButton.next(true);

    this.dataService.studentData.subscribe(response => {
      var time = response["examDuration"].replace('Minutes', '');
      this.time = parseInt(time);
      this.timerConfig = { leftTime: this.time * 60, notify: [2 * 60, 9 * 60] };
    })

    // var time = new Date("09-13-2019 18:00:00");
    // var now = new Date();
    // var diff = Math.round(now.valueOf() - time.valueOf())/1000;
    window.onpopstate = function (e) { window.history.forward(); }

    this.dataService.sideNav.subscribe(response => {
      this.sideNav = !this.sideNav;
    })

    this.questionFetch();
  }

  questionFetch(): void {

    // 0 not visited
    // 1 Visited but not answered
    // 2 Answered
    // 3 Review

    this.dataService.questionsData.subscribe(response => {
      this.examinationData = response;
      var checkFirstQuestion = this.examinationData.filter(m => m.question.status != 0);
      console.log(checkFirstQuestion);
      
      if (checkFirstQuestion.length == 0)
        this.examinationData[0]["question"]["status"] = 1;
      else{
        for(var i=0; i<checkFirstQuestion.length; i++){
          var option = checkFirstQuestion[i].options.filter(op => op.marked == true);
          this.answers.push({questionId: checkFirstQuestion[i].question.questionId, 
            status: checkFirstQuestion[i].question.status, option: option.length != 0?option[0].option: "" });
        }
      }
    })
  }

  handleEvent(event): void {
    console.log(event);
    var timeLeft = event.left / 60000
    if (event.action == "start") {
      this.toastrService.success("Examination started");
    }
    else if (event.action == "notify") {
      this.toastrService.warning("You have " + timeLeft + " minutes left");
    }
    else if (event.action == "done") {
      this.toastrService.success("Examination completed");
      this.router.navigate(["landing/student/initial/" +
        localStorage.getItem("userId") + "/" +
        localStorage.getItem("sessionId") + "/" +
        localStorage.getItem("examId")]);
    }
  }

  GotoQuestion(index: number): void {
    this.activeIndex = index;
    if (this.examinationData[index]["question"]["status"] == 0)
      this.examinationData[index]["question"]["status"] = 1;
    var exists = this.answers.filter(q => q.questionId == this.examinationData[index]["question"].questionId);
    if(exists.length == 0){
      this.answers.push({questionId: this.examinationData[index]["question"]["questionId"], 
      status: this.examinationData[index]["question"]["status"], option: ""});
    }
    else{
      var optIndex = this.answers.findIndex(q => q.questionId == exists[0].questionId);
      this.answers[optIndex]["status"] = this.examinationData[index]["question"]["status"];
    }
  }

  Answer(Qindex: number, Aindex: number, questionId: number, answer: string, event: any): void {
    for (var i = 0; i < this.examinationData[Qindex]["options"].length; i++) {
      this.examinationData[Qindex]["options"][i]["marked"] = false;
    }
    this.examinationData[Qindex]["options"][Aindex]["marked"] = event.source.checked;
    this.examinationData[Qindex]["question"]["status"] = 2;

    var exists = this.answers.filter(q => q.questionId == questionId)
    if(exists.length == 0){
      this.answers.push({questionId: questionId, status: this.examinationData[Qindex]["question"]["status"], option: answer});
    }
    else{
      var index = this.answers.findIndex(q => q.questionId == questionId);
      this.answers[index]["status"] = this.examinationData[Qindex]["question"]["status"];
      this.answers[index]["option"] = answer;
    }
  }

  MarkASReview(index: number, status: number): void {
    if (status == 3)
      this.examinationData[index]["question"]["status"] = 2;
    else
      this.examinationData[index]["question"]["status"] = 3;

    var exists = this.answers.filter(q => q.questionId == this.examinationData[index]["question"].questionId);
    if(exists.length == 0){
      this.answers.push({questionId: this.examinationData[index]["question"]["questionId"], 
      status: this.examinationData[index]["question"]["status"], option: ""});
    }
    else{
      var optIndex = this.answers.findIndex(q => q.questionId == exists[0].questionId);
      this.answers[optIndex]["status"] = this.examinationData[index]["question"]["status"];
    }
  }

  Navigate(type: string, index: number, first: boolean, last: boolean): void {
    if (!last && type.toLowerCase() == 'next') {
      index = index + 1;
      this.activeIndex = index;
      if (this.examinationData[index]["question"]["status"] == 0)
        this.examinationData[index]["question"]["status"] = 1;
    }
    else if (!first && type.toLowerCase() == 'previous') {
      index = index - 1;
      this.activeIndex = index;
      if (this.examinationData[index]["question"]["status"] == 0)
        this.examinationData[index]["question"]["status"] = 1;
    }

  var exists = this.answers.filter(q => q.questionId == this.examinationData[index]["question"].questionId);
  if(exists.length == 0){
    this.answers.push({questionId: this.examinationData[index]["question"]["questionId"], 
    status: this.examinationData[index]["question"]["status"], option: ""});
  }
  else{
    var optIndex = this.answers.findIndex(q => q.questionId == exists[0].questionId);
    this.answers[optIndex]["status"] = this.examinationData[index]["question"]["status"];
  }

  }

  Submit(): void {
    var notVisited = this.examinationData.filter(nv => nv.question.status == 0);
    var visitedNotAnswered = this.examinationData.filter(nv => nv.question.status == 1);
    var answered = this.examinationData.filter(nv => nv.question.status == 2);
    var reviewed = this.examinationData.filter(nv => nv.question.status == 3);

    this.dataService.examStatus["notVisited"] = notVisited.length;
    this.dataService.examStatus["visitedNotAnswered"] = visitedNotAnswered.length;
    this.dataService.examStatus["answered"] = answered.length;
    this.dataService.examStatus["reviewed"] = reviewed.length;

    this.router.navigate(['/initial/' + 
    localStorage.getItem("userId") + "/" +
    localStorage.getItem("sessionId") + "/" +
    localStorage.getItem("examId")]);
    this.dialog.open(ExamSummaryComponent, 
      { 
        minWidth: '35%',
        disableClose: true
      });
  }


}

import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material';
import { ExamSummaryComponent } from 'src/app/Popup/exam-summary/exam-summary.component';
import { CountdownComponent } from 'ngx-countdown';
import { ExamSubmitComponent } from 'src/app/Popup/exam-submit/exam-submit.component';
import { Subscription } from 'rxjs';
import { EncryptionService } from 'src/app/Services/encryption.service';

@Component({
  selector: 'app-exam-start',
  templateUrl: './exam-start.component.html',
  styleUrls: ['./exam-start.component.scss']
})
export class ExamStartComponent implements OnInit, OnDestroy {

  constructor(private toastrService: ToastrService, private router: Router, private dataService: DataService,
    private dialog: MatDialog, private encryptionService: EncryptionService) { }
  timerConfig: any;
  // time: number;
  sideNav: boolean = false;
  examinationData: any = [];
  activeIndex: number = 0;
  answers: any = [];

  submitDisable: boolean = true;

  warningSubscription: Subscription;
  questionSubscription: Subscription;
  timerSubscription: Subscription;
  sideNavSubscription: Subscription;

  @ViewChild('cd1', { static: false }) private countdown: CountdownComponent;

  ngOnInit() {
    localStorage.setItem('studentExamStart', 'true');
    this.dataService.sideNavButton.next(true);

    this.timerSubscription = this.dataService.examStartAndTimer.subscribe(response => {
      if (response) {
        response['time']['leftTime'] = response['time']['leftTime'] * 60;
        this.timerConfig = response["time"]; //, notify: [2 * 60, 9 * 60] 
      }
    })

    this.questionSubscription = this.dataService.questionsData.subscribe(response => {
      if (response.length>0) {
        console.log(response);
        this.examinationData = this.encryptionService.DecryptEncryption(response, ['question'], ['option']);
        console.log(this.examinationData);
        var checkFirstQuestion = this.examinationData.every(m => m.status == 0);

        if (checkFirstQuestion)
          this.examinationData[0]["status"] = 1;
        else {
          // for (var i = 0; i < checkFirstQuestion.length; i++) {
          //   var option = checkFirstQuestion[i].options.filter(op => op.marked == true);
          //   this.answers.push({
          //     questionId: checkFirstQuestion[i].question.questionId,
          //     status: checkFirstQuestion[i].question.status, option: option.length != 0 ? option[0].option : ""
          //   });
          // }
        }
      }
    })

    this.warningSubscription = this.dataService.warning.subscribe(response => {

      if (response != null) {
        if (response) {
          localStorage.setItem("freq", this.countdown["left"])
        }
        // else if (!response) {
        //   this.dataService.studentData.value["examDuration"] = parseInt(localStorage.getItem("freq")) / 60000 + " Minutes";
        // }
      }

    })

    // var time = new Date("09-13-2019 18:00:00");
    // var now = new Date();
    // var diff = Math.round(now.valueOf() - time.valueOf())/1000;
    window.onpopstate = function (e) { window.history.forward(); }

    this.sideNavSubscription = this.dataService.sideNav.subscribe(response => {
      this.sideNav = !this.sideNav;
    })

    // this.questionFetch();
  }



  // questionFetch(): void {

  //   // 0 not visited
  //   // 1 Visited but not answered
  //   // 2 Answered
  //   // 3 Review

  //   this.dataService.questionsData.subscribe(response => {
  //     this.examinationData = response;
  //     var checkFirstQuestion = this.examinationData.filter(m => m.question.status != 0);

  //     if (checkFirstQuestion.length == 0)
  //       this.examinationData[0]["question"]["status"] = 1;
  //     else {
  //       for (var i = 0; i < checkFirstQuestion.length; i++) {
  //         var option = checkFirstQuestion[i].options.filter(op => op.marked == true);
  //         this.answers.push({
  //           questionId: checkFirstQuestion[i].question.questionId,
  //           status: checkFirstQuestion[i].question.status, option: option.length != 0 ? option[0].option : ""
  //         });
  //       }
  //     }
  //   })
  // }

  handleEvent(event): void {
    if (this.timerConfig) {
      var timeLeft = event.left / 60000
      if (event.action == "start") {
        this.toastrService.success("Examination started");
      }
      else if (event.action == "notify") {
        this.toastrService.warning("You have " + timeLeft + " minutes left");
      }
      else if (event.action == "done") {
        this.submitDisable = true;
        this.toastrService.success("Examination completed");
        this.examSubmit();
      }
    }
  }

  GotoQuestion(index: number): void {
    this.activeIndex = index;
    if (this.examinationData[index]["status"] == 0)
      this.examinationData[index]["status"] = 1;
    var exists = this.answers.filter(q => q.questionId == this.examinationData[index].questionId);
    if (exists.length == 0) {
      this.answers.push({
        questionId: this.examinationData[index]["questionId"],
        status: this.examinationData[index]["status"], option: ""
      });
    }
    else {
      var optIndex = this.answers.findIndex(q => q.questionId == exists[0].questionId);
      this.answers[optIndex]["status"] = this.examinationData[index]["status"];
    }
  }

  Answer(Qindex: number, Aindex: number, questionId: number, answer: string, event: any): void {
    for (var i = 0; i < this.examinationData[Qindex]["options"].length; i++) {
      this.examinationData[Qindex]["options"][i]["marked"] = false;
    }
    this.examinationData[Qindex]["options"][Aindex]["marked"] = event.source.checked;
    this.examinationData[Qindex]["status"] = 2;

    var exists = this.answers.filter(q => q.questionId == questionId)
    if (exists.length == 0) {
      this.answers.push({ questionId: questionId, status: this.examinationData[Qindex]["status"], option: answer });
    }
    else {
      var index = this.answers.findIndex(q => q.questionId == questionId);
      this.answers[index]["status"] = this.examinationData[Qindex]["status"];
      this.answers[index]["option"] = answer;
    }
  }

  MarkASReview(index: number, status: number): void {
    if (status == 3)
      this.examinationData[index]["status"] = 2;
    else
      this.examinationData[index]["status"] = 3;

    var exists = this.answers.filter(q => q.questionId == this.examinationData[index].questionId);
    if (exists.length == 0) {
      this.answers.push({
        questionId: this.examinationData[index]["questionId"],
        status: this.examinationData[index]["status"], option: ""
      });
    }
    else {
      var optIndex = this.answers.findIndex(q => q.questionId == exists[0].questionId);
      this.answers[optIndex]["status"] = this.examinationData[index]["status"];
    }
  }

  Navigate(type: string, index: number, first: boolean, last: boolean): void {
    if (!last && type.toLowerCase() == 'next') {
      index = index + 1;
      this.activeIndex = index;
      if (this.examinationData[index]["status"] == 0)
        this.examinationData[index]["status"] = 1;
    }
    else if (!first && type.toLowerCase() == 'previous') {
      index = index - 1;
      this.activeIndex = index;
      if (this.examinationData[index]["status"] == 0)
        this.examinationData[index]["status"] = 1;
    }

    var exists = this.answers.filter(q => q.questionId == this.examinationData[index].questionId);
    if (exists.length == 0) {
      this.answers.push({
        questionId: this.examinationData[index]["questionId"],
        status: this.examinationData[index]["status"], option: ""
      });
    }
    else {
      var optIndex = this.answers.findIndex(q => q.questionId == exists[0].questionId);
      this.answers[optIndex]["status"] = this.examinationData[index]["status"];
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

    this.router.navigate(['/initial']);
    this.dialog.open(ExamSummaryComponent,
      {
        minWidth: '35%',
        disableClose: true
      });
  }

  examSubmit(): void {
    this.dialog.open(ExamSubmitComponent,
      {
        minWidth: '35%',
        disableClose: true
      });
  }

  ngOnDestroy() {
    this.sideNavSubscription.unsubscribe();
    this.timerSubscription.unsubscribe();
    this.questionSubscription.unsubscribe();
    this.warningSubscription.unsubscribe();
  }


}

import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material';
import { ExamSummaryComponent } from 'src/app/Popup/exam-summary/exam-summary.component';
import { CountdownComponent } from 'ngx-countdown';
import { Subscription } from 'rxjs';
import { EncryptionService } from 'src/app/Services/encryption.service';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { QuestionService } from 'src/app/Services/question.service';
import { StudentInstructionPopupComponent } from 'src/app/Popup/student-instruction-popup/student-instruction-popup.component';
import { WarningComponent } from 'src/app/Popup/warning/warning.component';
import { StudentEarlyExamSubmitPopupComponent } from 'src/app/Popup/student-early-exam-submit-popup/student-early-exam-submit-popup.component';

// 0 not visited
//   // 1 Visited but not answered
//   // 2 Answered
//   // 3 Review

@Component({
  selector: 'app-exam-start',
  templateUrl: './exam-start.component.html',
  styleUrls: ['./exam-start.component.scss']
})
export class ExamStartComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private toastrService: ToastrService, private router: Router, private dataService: DataService,
    private dialog: MatDialog, private encryptionService: EncryptionService, private examService: ExamAPIService,
    private ngxLoader: NgxUiLoaderService, private questionService: QuestionService) { }
  timerConfig: any;
  // time: number;
  sideNav: boolean = false;
  examinationData: any = [];
  // examinationDataCopy: any = [];
  activeIndex: number = 0;
  answers: any = [];

  submitDisable: boolean = true;

  // warningSubscription: Subscription;
  questionSubscription: Subscription;
  timerSubscription: Subscription;
  sideNavSubscription: Subscription;

  status: any = {};

  @ViewChild('cd1', { static: false }) private countdown: CountdownComponent;

  private statusInitInterval: any = null;

  fullScr: boolean = false;
  winHeight: number;

  ngOnInit() {
    sessionStorage.setItem('studentExamStart', 'true');
    this.dataService.sideNavButton.next(true);

    this.sendWarning();
    // }
    this.fullScr = true;
    this.winHeight = window.innerHeight;

    this.timerSubscription = this.dataService.examStartAndTimer.subscribe(response => {
      if (response) {
        response['time']['leftTime'] = response['time']['leftTime'] * 60;
        this.timerConfig = response["time"]; //, notify: [2 * 60, 9 * 60] 
      }
    })

    this.questionSubscription = this.dataService.questionsData.subscribe(response => {
      if (response.length > 0) {
        this.examinationData = this.encryptionService.DecryptEncryption(response, ['question'], ['option']);
        this.examinationData = this.examinationData.map(({ shuffleStatus, options, ...rest }) =>
          ({ shuffleStatus: shuffleStatus, options: shuffleStatus ? this.dataService.shuffle(options) : options, ...rest }));

        var checkFirstQuestion = this.examinationData.every(m => m.status == 0);

        if (checkFirstQuestion) {
          this.examinationData[0]["status"] = 1;
          this.answers.push({
            std_res_id: this.examinationData[0]["studentResponseId"],
            status: this.examinationData[0]["status"],
            option_id: this.examinationData[0]["answeredOption"]
          })
        }
        else {
          var answeredQuestions = this.examinationData.filter(f => f.answeredOption != 0);
          answeredQuestions.forEach(element => {
            this.answers.push({
              std_res_id: element["studentResponseId"],
              status: element["status"],
              option_id: element["answeredOption"]
            })
          });
        }
        this.status = {
          notVisited: this.examinationData.filter(d => d.status == 0).length,
          visited: this.examinationData.filter(d => d.status == 1).length,
          answered: this.examinationData.filter(d => d.status == 2).length,
          reviewed: this.examinationData.filter(d => d.status == 3).length
        }
      }
    })
    window.onpopstate = function (e) { window.history.forward(); }

    this.sideNavSubscription = this.dataService.sideNav.subscribe(response => {
      this.sideNav = !this.sideNav;
    })
  }

  ngAfterViewInit() {
    // this.statusInitInterval = setInterval(() => {
    this.EarlyExamStatusCheck();
    // }, 3600)
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    event.returnValue = false;
    event.preventDefault();
    if (this.winHeight < window.innerHeight)
      this.winHeight = window.innerHeight;
    // var alreadyMarked = localStorage.getItem('SMP');
    // if (window.innerHeight != this.winHeight && alreadyMarked != 'true') {
    if (window.innerHeight != this.winHeight) {

      this.MarkSMP();
    }
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.returnValue = false;
    event.preventDefault();
  }


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
        clearInterval(this.statusInitInterval);
        this.submitDisable = false;
        this.toastrService.success("Examination completed");
        this.Submit();
        // this.examSubmit();
      }
    }
  }

  GotoQuestion(index: number): void {
    this.activeIndex = index;
    if (this.examinationData[index]["status"] == 0)
      this.examinationData[index]["status"] = 1;
    var exists = this.answers.filter(q => q.std_res_id == this.examinationData[index].studentResponseId);
    if (exists.length == 0) {
      this.answers.push({
        std_res_id: this.examinationData[index]["studentResponseId"],
        status: this.examinationData[index]["status"],
        option_id: 0
      });
    }
    else {
      var optIndex = this.answers.findIndex(q => q.std_res_id == exists[0].std_res_id);
      this.answers[optIndex]["status"] = this.examinationData[index]["status"];
    }
    this.StudentResponseSubmit();
  }

  Answer(Qindex: number, Aindex: number, studentResponseId: number, event: any): void {
    // for (var i = 0; i < this.examinationData[Qindex]["options"].length; i++) {
    this.examinationData[Qindex]["answeredOption"] = 0;
    // }
    this.examinationData[Qindex]["answeredOption"] = event.value;
    if (this.examinationData[Qindex]["status"] != 3)
      this.examinationData[Qindex]["status"] = 2;

    var exists = this.answers.filter(q => q.std_res_id == studentResponseId)
    if (exists.length == 0) {
      this.answers.push({ std_res_id: studentResponseId, status: this.examinationData[Qindex]["status"], option_id: event.value });
    }
    else {
      var index = this.answers.findIndex(q => q.std_res_id == studentResponseId);
      this.answers[index]["status"] = this.examinationData[Qindex]["status"];
      this.answers[index]["option_id"] = event.value;
    }
    this.StudentResponseSubmit();
  }

  MarkASReview(index: number, status: number): void {
    if (status == 3) {
      if (this.examinationData[index]['answeredOption'] != 0)
        this.examinationData[index]["status"] = 2;
      else
        this.examinationData[index]["status"] = 1;
    }
    else
      this.examinationData[index]["status"] = 3;

    var exists = this.answers.filter(q => q.std_res_id == this.examinationData[index].studentResponseId);
    if (exists.length == 0) {
      this.answers.push({
        std_res_id: this.examinationData[index]["studentResponseId"],
        status: this.examinationData[index]["status"],
        option_id: 0
      });
    }
    else {
      var optIndex = this.answers.findIndex(q => q.std_res_id == exists[0].std_res_id);
      this.answers[optIndex]["status"] = this.examinationData[index]["status"];
    }

    this.StudentResponseSubmit();
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

    var exists = this.answers.filter(q => q.std_res_id == this.examinationData[index].studentResponseId);
    if (exists.length == 0) {
      this.answers.push({
        std_res_id: this.examinationData[index]["studentResponseId"],
        status: this.examinationData[index]["status"],
        option_id: 0
      });
    }
    else {
      var optIndex = this.answers.findIndex(q => q.std_res_id == exists[0].std_res_id);
      this.answers[optIndex]["status"] = this.examinationData[index]["status"];
    }
    this.StudentResponseSubmit();



  }

  Submit(): void {
    try {
      this.ngxLoader.start();
      this.examService.StudentExamSubmit().subscribe(response => {
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else if (response.success) {
          sessionStorage.removeItem('studentExamStart');

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

  GoToSummary(): void {
    this.router.navigate(['/initial']);
    this.dialog.open(ExamSummaryComponent,
      {
        minWidth: '35%',
        disableClose: true
      });
  }


  ClearResponse(index: number): void {
    var exists = this.answers.filter(q => q.std_res_id == this.examinationData[index].studentResponseId);
    this.examinationData[index]["answeredOption"] = 0;
    this.examinationData[index]["status"] = 1;
    if (exists.length > 0) {
      var optIndex = this.answers.findIndex(q => q.std_res_id == exists[0].std_res_id);
      this.answers[optIndex]["option_id"] = 0;
      this.answers[optIndex]["status"] = 1;
    }
    else {
      this.answers.push({
        std_res_id: this.examinationData[index]["studentResponseId"],
        status: this.examinationData[index]["status"],
        option_id: 0
      });
    }
    this.StudentResponseSubmit();
  }

  StudentResponseSubmit(): void {
    try {
      this.examService.StudentResponseSubmit(this.answers).subscribe(response => {
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else if (response.success) {
          //each and every response submit success
          this.status = {
            notVisited: this.examinationData.filter(d => d.status == 0).length,
            visited: this.examinationData.filter(d => d.status == 1).length,
            answered: this.examinationData.filter(d => d.status == 2).length,
            reviewed: this.examinationData.filter(d => d.status == 3).length
          }
        }
        else {
          this.toastrService.error(response.message);
        }
      }, error => {
        this.toastrService.error(error.message);
      })
    }
    catch (e) {
      this.toastrService.error(e.message);
    }
  }

  FilterQuestions(value: number): void {
    // if (value)
    // this.examinationData = this.examinationData.filter(d => d.status == value);
  }

  CheckStatus(): void {
    try {
      this.questionService.CheckExamStarts().subscribe(response => {
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else if (response.success) {
        }
        else {
          sessionStorage.setItem('instruction', 'normal');
          // clearInterval(this.statusInitInterval);
          this.router.navigate(["/landing/student/exam"]);
          sessionStorage.removeItem('studentExamStart');
          this.toastrService.error(response.message);
        }
      }, error => {
        this.CheckStatus();
        this.toastrService.error(error.message);
      })
    }
    catch (e) {
      this.CheckStatus();
      this.toastrService.error(e.message);
    }
  }

  GoToInstructions(): void {
    sessionStorage.setItem('instruction', 'popup');
    this.dialog.open(StudentInstructionPopupComponent,
      {
        width: '80%',
        height: '80%'
      });
  }

  sendWarning(): void {
    try {
      this.examService.CheckStudentSMP().subscribe(response => {
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else if (response.success) {
          if (response.data.isSMP) {
            // localStorage.setItem('SMP', 'true');
            this.dataService.warning.next(true);
            this.router.navigate(['/landing/student/initial']);
            this.dialog.open(WarningComponent,
              {
                minWidth: '35%',
                disableClose: true
              });
          }
        }
        else {
          this.toastrService.error(response.message);
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

  MarkSMP(): void {
    try {
      this.ngxLoader.start();
      // localStorage.setItem('SMP', 'true');
      this.dataService.warning.next(true);
      this.router.navigate(['/landing/student/initial']);
      this.examService.MarkStudentSMP().subscribe(response => {
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.ngxLoader.stop();
          this.toastrService.success(response.message);
          this.dialog.open(WarningComponent,
            {
              minWidth: '35%',
              disableClose: true
            });
        }
        else {
          this.toastrService.error(response.message);
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

  RequestSummary(): void {
    try {
      this.ngxLoader.start();
      this.examService.StudentEarlyExamSubmit().subscribe(response => {
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.countdown.pause();
          const dialogref = this.dialog.open(StudentEarlyExamSubmitPopupComponent,
            {
              minWidth: '35%',
              disableClose: true
            });
          dialogref.afterClosed().subscribe(response => {
            if (response) {
              if (response == 3) {
                this.Submit();
                this.submitDisable = false;
              }
              else{
                this.countdown.resume();
              }
              // else if(response == 1)
              // this.submitDisable = false;
            }
            // else{
            //   this.submitDisable = true;
            // }
          })
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

  EarlyExamStatusCheck(): void {
    try {
      this.ngxLoader.start();
      this.examService.CheckStudentEarlyExamSubmitStatus().subscribe(response => {
        if (response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)) {
          this.dataService.LogOut();
        }
        else if (response.success) {
          if (response.data.earlySubmissionStatus == 2) {
            this.RequestSummary();
          }
          // else if (response.data.earlySubmissionStatus == 3) {
          //   this.Submit();
          //   this.submitDisable = false;
          // }
          else {
            this.CheckStatus();
          }
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

  ngOnDestroy() {
    this.sideNavSubscription.unsubscribe();
    this.timerSubscription.unsubscribe();
    this.questionSubscription.unsubscribe();
    // clearInterval(this.statusInitInterval);
  }


}

import { Component, OnInit, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { QuestionService } from 'src/app/Services/question.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-common-instructions',
  templateUrl: './common-instructions.component.html',
  styleUrls: ['./common-instructions.component.scss']
})
export class CommonInstructionsComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private router: Router, private toastrService: ToastrService,
    private ngxLoader: NgxUiLoaderService, private apiService: QuestionService, private dataService: DataService) { }


  private pageInitInterval: any = null;

  showNextButton: boolean = true;

  user: object;

  subscription: Subscription;

  ngOnInit() {
    var instructionType = sessionStorage.getItem('instruction');
    instructionType == 'popup'?this.showNextButton = false: this.showNextButton = true;
    this.subscription = this.dataService.studentData.subscribe(response => {
      if (response) {
        console.log(response);
        
        this.user = response;
      }
    })
  }

  ngAfterViewInit() {
    sessionStorage.setItem('studentCommonInstruction', 'true');
    setTimeout(() => {
      // this.pageInitInterval = setInterval(() => {
        this.dataService.examStartAndTimer.next('');
        this.fetchQuestions();
        this.CheckExamStarts();
      // }, 3600)
    }, 10);
  }

  fetchQuestions(): void {
    try {
      this.apiService.questionFetch().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          sessionStorage.setItem('questionFetch', 'true');
          this.dataService.questionsData.next(response.data.questionList);
          this.dataService.questionFetch.next(true);
          // this.CheckExamStarts();
          // this.CheckExamStarts();
        }
        else {
          this.fetchQuestions();
          // this.toastrService.error(response.message);
        }
      }, error => {
        this.fetchQuestions();
        this.toastrService.error(error.message);
      })
    }
    catch (e) {
      this.fetchQuestions();
      this.toastrService.error(e.message);
    }
  }

  CheckExamStarts(): void {
    try {
      this.apiService.CheckExamStarts().subscribe(response => {
        if(response.errorCode && (response.errorCode == this.dataService.unAuthorizedCode)){
          this.dataService.LogOut();
        }
        else if (response.success) {
          this.dataService.examStartAndTimer.next(response.data);
          // clearInterval(this.pageInitInterval);
        }
        else {
          // this.toastrService.error(response.message);
          this.CheckExamStarts();
        }
      }, error => {
        this.CheckExamStarts();
        this.toastrService.error(error.message);
      })
    }
    catch (e) {
      this.CheckExamStarts();
      this.toastrService.error(e.message);
    }
  }

  Next(): void {
    this.router.navigate(['/landing/student/exam/subjectspecificinstructions']);
  }

  ngOnDestroy() {
    // clearInterval(this.pageInitInterval);
    // this.subscription.unsubscribe();
  }
}

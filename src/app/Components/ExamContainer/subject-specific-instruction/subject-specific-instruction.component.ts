import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { QuestionService } from 'src/app/Services/question.service';
import { StudentLoginAPIService } from 'src/app/Services/student-login-api.service';

@Component({
  selector: 'app-subject-specific-instruction',
  templateUrl: './subject-specific-instruction.component.html',
  styleUrls: ['./subject-specific-instruction.component.scss']
})
export class SubjectSpecificInstructionComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private dataService: DataService, private router: Router, private toastrService: ToastrService,
    private ngxLoader: NgxUiLoaderService, private apiService: StudentLoginAPIService) { }

  user: object;

  subscription: Subscription;

  ngOnInit() {
    localStorage.setItem('studentSubjectSpecificInstruction', 'true');
    this.subscription = this.dataService.studentData.subscribe(response => {
      if (response) {
        this.user = response;
      }
    })
  }

  ngAfterViewInit() {

  }

  Previous(): void {
    this.router.navigate(["/landing/student/exam/commoninstructions"]);
  }

  Proceed(): void {
    try {
      this.ngxLoader.start();
      this.apiService.StudentStartExam().subscribe(response => {
        if (response.success) {
          this.dataService.toggleFullScreen();
          this.router.navigate(["/landing/student/exam/progress"]);
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
      this.toastrService.error("Mandatory data missing!");
      this.ngxLoader.stop();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ControllerAuthService } from 'src/app/Services/controller-auth.service';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { StudentLoginAPIService } from 'src/app/Services/student-login-api.service';
import { HallticketAuthService } from 'src/app/Services/hallticket-auth.service';
import { EncryptionService } from 'src/app/Services/encryption.service';
import { QuestionService } from 'src/app/Services/question.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, AfterViewInit {

  constructor(private dataService: DataService, private router: Router, private authHallTicket: HallticketAuthService,
    private deviceService: DeviceDetectorService, private auth: ControllerAuthService, private service: ControllerAPIService,
    private ngxLoader: NgxUiLoaderService, private toastrService: ToastrService, private studentService: StudentLoginAPIService,
    private encryptionService: EncryptionService, private questionService: QuestionService) { }

  logo: object = {
    img: "../../../assets/Images/Logo.png",
    alt: "logo"
  }
  user: object;


  ngOnInit() {
    this.dataService.controllerData.next({
      email: localStorage.getItem("email"),
      userId: localStorage.getItem("userId"),
      sessionId: localStorage.getItem("sessionId")
    })
    this.dataService.studentCredentials.next({
      examStudentId: localStorage.getItem("examStudentId")
    })
    this.dataService.sideNavButton.next(false);
  }

  ngAfterViewInit() {

    var loggedInUser = localStorage.getItem("loginUser");
    if (loggedInUser == 'invigilator') {
      setTimeout(() => {
        this.checkValidUser();
      }, 100);
    }
    else if (loggedInUser == 'student') {
      setTimeout(() => {
        this.CheckValidStudent();
      }, 10);
    }
    var questionFetch = localStorage.getItem("questionFetch");
    var studentData = localStorage.getItem('studentData');
    if (questionFetch == 'true' && loggedInUser == 'student') {
      setTimeout(() => {
        this.fetchQuestions()
      }, 10);
    }
    if (studentData && loggedInUser == 'student') {
      setTimeout(() => {
        this.FetchStudentDetails()
      }, 10);
    }
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  sideNavToggle(): void {
    this.dataService.sideNav.next(true);
  }

  checkValidUser(): void {
    try {
      this.ngxLoader.start();
      var acceptInstruction = localStorage.getItem('AcceptInstruction');
      var controllerStartExam = localStorage.getItem('controllerExamStart');
      if (localStorage.getItem("userId") && !acceptInstruction && !controllerStartExam) {
        try {
          this.ngxLoader.start();
          this.service.CheckValidController().subscribe(response => {
            if (response.success) {
              var controller = {
                userId: localStorage.getItem("userId"),
                sessionId: localStorage.getItem("sessionId"),
                email: localStorage.getItem("email")
              }
              this.dataService.controllerLogin.next(true);
              this.dataService.controllerData.next(controller);
              this.auth.controllerLoginAuth();
              this.ngxLoader.stop();
              this.router.navigate(["/landing/controller/instruction"]);
            }
            else {
              this.router.navigate(["/landing/controller/login"]);
              this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/controller/login"]);
            this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/controller/login"]);
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else if (localStorage.getItem("userId") && (acceptInstruction && acceptInstruction == 'true')
        && !controllerStartExam) {
        try {
          this.ngxLoader.start();
          this.service.CheckValidController().subscribe(response => {
            if (response.success) {
              var controller = {
                userId: localStorage.getItem("userId"),
                sessionId: localStorage.getItem("sessionId"),
                email: localStorage.getItem("email"),
              }
              this.dataService.controllerLogin.next(true);
              this.dataService.controllerData.next(controller);
              this.auth.controllerLoginAuth();
              this.ngxLoader.stop();
              this.router.navigate(["/landing/controller/dashboard"]);
            }
            else {
              this.router.navigate(["/landing/controller/login"]);
              this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/controller/login"]);
            this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/controller/login"]);
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else if (localStorage.getItem("userId") && (acceptInstruction && acceptInstruction == 'true')
        && (controllerStartExam && controllerStartExam == 'true')) {
        try {
          this.ngxLoader.start();
          this.service.CheckValidController().subscribe(response => {
            if (response.success) {
              var controller = {
                userId: localStorage.getItem("userId"),
                sessionId: localStorage.getItem("sessionId"),
                email: localStorage.getItem("email"),
              }
              this.dataService.controllerLogin.next(true);
              this.dataService.controllerData.next(controller);
              this.auth.controllerLoginAuth();
              this.ngxLoader.stop();
              this.router.navigate(["/landing/controller/examstart"]);
            }
            else {
              this.router.navigate(["/landing/controller/login"]);
              this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/controller/login"]);
            this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/controller/login"]);
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else {
        this.router.navigate(["/landing/controller/login"]);
        this.ngxLoader.stop();
      }
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  CheckValidStudent(): void {
    try {
      this.ngxLoader.start();
      var examStudentId = localStorage.getItem('examStudentId');
      var studentData = localStorage.getItem('studentData');
      var commonInstruction = localStorage.getItem('studentCommonInstruction');
      var subjectSpecificInstruction = localStorage.getItem('studentSubjectSpecificInstruction');
      var examStarts = localStorage.getItem('studentExamStart');
      if (examStudentId && studentData && commonInstruction != 'true' && 
      subjectSpecificInstruction != 'true' && examStarts != 'true') {
        try {
          this.ngxLoader.start();
          this.studentService.CheckValidStudent().subscribe(response => {
            if (response.success) {
              this.ngxLoader.stop();
              this.router.navigate(["/landing/student/initial"]);
            }
            else {
              this.router.navigate(["/landing/student"]);
              this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/student"]);
            this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/student"]);
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else if (examStudentId && studentData && commonInstruction == 'true' 
      && subjectSpecificInstruction != 'true' && examStarts != 'true') {
        try {
          this.ngxLoader.start();
          this.studentService.CheckValidStudent().subscribe(response => {
            if (response.success) {
              this.ngxLoader.stop();
              this.authHallTicket.hallTicketValid();
              // this.dataService.toggleFullScreen();
              this.dataService.isNotLoginScreen.next(true);
              this.router.navigate(["/landing/student/exam"]);
            }
            else {
              this.router.navigate(["/landing/student/initial"]);
              this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/student/initial"]);
            this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/student/initial"]);
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else if (examStudentId && studentData && commonInstruction == 'true' && 
      subjectSpecificInstruction == 'true' && examStarts != 'true') {
        try {
          this.ngxLoader.start();
          this.studentService.CheckValidStudent().subscribe(response => {
            if (response.success) {
              this.ngxLoader.stop();
              this.authHallTicket.hallTicketValid();
              // this.dataService.toggleFullScreen();
              this.dataService.isNotLoginScreen.next(true);
              this.router.navigate(["/landing/student/exam/subjectspecificinstructions"]);
            }
            else {
              this.router.navigate(["/landing/student/exam"]);
              this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/student/exam"]);
            this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/student/exam"]);
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else if (examStudentId && studentData && commonInstruction == 'true' && 
      subjectSpecificInstruction == 'true' && examStarts == 'true') {
        try {
          this.ngxLoader.start();
          this.studentService.CheckValidStudent().subscribe(response => {
            if (response.success) {
              this.ngxLoader.stop();
              this.authHallTicket.hallTicketValid();
              // this.dataService.toggleFullScreen();
              this.dataService.isNotLoginScreen.next(true);
              this.router.navigate(["/landing/student/exam/progress"]);
            }
            else {
              this.router.navigate(["/landing/student/exam/commoninstructions"]);
              this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.router.navigate(["/landing/student/exam/commoninstructions"]);
            this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.router.navigate(["/landing/student/exam/commoninstructions"]);
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
      else {
        this.router.navigate(["/landing/student"]);
        this.ngxLoader.stop();
      }
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  fetchQuestions(): void {
    try {
      this.questionService.questionFetch().subscribe(response => {
        if (response.success) {
          localStorage.setItem('questionFetch', 'true');
          this.dataService.questionsData.next(response.data.questionList);
          this.CheckExamStarts();
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

  CheckExamStarts(): void {
    try {
      this.questionService.CheckExamStarts().subscribe(response => {
        if (response.success) {
          this.dataService.examStartAndTimer.next(response.data);
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

  FetchStudentDetails(): void {
    try {
      var studentData = localStorage.getItem('studentData');
      var dec = this.encryptionService.decryptUsingAES256(studentData);
      this.dataService.studentData.next(JSON.parse(JSON.parse(dec)));
    }
    catch (e) {
      this.toastrService.error(e);
    }
  }

  Logout(): void {
    var loginType = localStorage.getItem('loginUser');
    localStorage.removeItem("userId");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("email");
    localStorage.removeItem("AcceptInstruction");
    localStorage.removeItem("questionShuffled");
    localStorage.removeItem('controllerExamStart');
    localStorage.removeItem("loginUser");
    localStorage.removeItem("Token");
    localStorage.removeItem("studentData");
    localStorage.removeItem("studentSubjectSpecificInstruction");
    localStorage.removeItem("examStudentId");
    localStorage.removeItem("studentCommonInstruction");
    localStorage.removeItem('studentExamStart');
    this.dataService.controllerLogin.next(false);
    this.dataService.controllerData.next(null);
    this.auth.controllerLogoutAuth();
    if (loginType == 'invigilator') {
      this.router.navigate(["/landing/controller/login"]);
      window.location.reload();
    }
    else {
      this.dataService.studentCredentials.next({});
      this.dataService.studentData.next({});
      this.router.navigate(["/landing/student/initial"]);
      setTimeout(() => {
        window.location.reload();
      }, 10);
    }
  }


}

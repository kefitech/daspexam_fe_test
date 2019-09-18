import { Component, OnInit, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-exam-start',
  templateUrl: './exam-start.component.html',
  styleUrls: ['./exam-start.component.scss']
})
export class ExamStartComponent implements OnInit {

  constructor(private toastrService: ToastrService, private router: Router, private dataService: DataService,
    private ngxLoader: NgxUiLoaderService) { }
  timerConfig: any;
  time: number;
  sideNav: boolean = false;
  examinationData: any;
  activeIndex: number = 0;

  ngOnInit() {
    this.dataService.sideNavButton.next(true);

    this.dataService.studentData.subscribe(response => {
      var time = response["examDuration"].replace('Minutes', '');
      this.time = parseInt(time);
      this.timerConfig = { leftTime: this.time * 60, notify: [2 * 60, 5 * 60] };
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
      this.examinationData[0]["question"]["status"] = 1;
    })
  }

  handleEvent(event): void {
    console.log(event);
    var timeLeft = event.left / 1000
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
  }

  Answer(Qindex: number, Aindex: number, questionNo: number, answerNo: number, event: any): void {
    for (var i = 0; i < this.examinationData[Qindex]["options"].length; i++) {
      this.examinationData[Qindex]["options"][i]["marked"] = false;
    }
    this.examinationData[Qindex]["options"][Aindex]["marked"] = event.source.checked;
    this.examinationData[Qindex]["question"]["status"] = 2;
  }

  MarkASReview(index: number, status: number): void {
    if (status == 3)
      this.examinationData[index]["question"]["status"] = 2;
    else
      this.examinationData[index]["question"]["status"] = 3;
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
  }

  Submit(): void{
    this.router.navigate(["landing/student/exam/summary"]);
  }


}

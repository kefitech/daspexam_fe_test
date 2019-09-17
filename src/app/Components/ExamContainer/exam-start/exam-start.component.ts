import { Component, OnInit, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-exam-start',
  templateUrl: './exam-start.component.html',
  styleUrls: ['./exam-start.component.scss']
})
export class ExamStartComponent implements OnInit {

  constructor(private toastrService: ToastrService, private router: Router, private dataService: DataService) { }
  timerConfig: any;
  sideNav: boolean = false;
  examinationData: any;
  activeIndex: number = 0;

  ngOnInit() {
    // var time = new Date("09-13-2019 18:00:00");
    // var now = new Date();
    // var diff = Math.round(now.valueOf() - time.valueOf())/1000;
    window.onpopstate = function (e) { window.history.forward(); }
    this.timerConfig = {leftTime: 10000, notify: [ 2, 5 ]}
    this.dataService.sideNav.subscribe(response => {
      this.sideNav = !this.sideNav;
    })

    // 0 not visited
    // 1 Visited but not answered
    // 2 Answered
    // 3 Review

    this.examinationData = [
      {question: "<p>A computer is a machine or device that performs processes A computer is a machine or device that performs processes A computer is a machine or device that performs processesA computer is a machine or device that performs processesA computer is a machine or device that performs processesA computer is a machine or device that performs processesA computer is a machine or device that performs processesA computer is a machine or device that performs processesA computer is a machine or device that performs processesA computer is a machine or device that performs processesA computer is a machine or device that performs processesA computer is a machine or device that performs processesA computer is a machine or device that performs processesA computer is a machine or device that performs processes</p>", 
      imageUrl: "", questionId: 123, status: 0, isImage: false, options: [
        {option: "val1", optionId: 1, isImage: false, marked: false},
        {option: "val2", optionId: 2, isImage: false, marked: false},
        {option: "val3", optionId: 3, isImage: false, marked: false},
        {option: "val4", optionId: 4, isImage: false, marked: false},
      ]},
      {question: "<p>A computer is a machine or</p> <p>device that performs processes</p>", 
      imageUrl: "https://homepages.cae.wisc.edu/~ece533/images/boat.png", questionId: 123, status: 0, isImage: true, options: [
        {option: "https://homepages.cae.wisc.edu/~ece533/images/arctichare.png", optionId: 1, isImage: true, marked: false},
        {option: "https://homepages.cae.wisc.edu/~ece533/images/baboon.png", optionId: 2, isImage: true, marked: false},
        {option: "https://homepages.cae.wisc.edu/~ece533/images/boat.png", optionId: 3, isImage: true, marked: false},
        {option: "https://homepages.cae.wisc.edu/~ece533/images/airplane.png", optionId: 4, isImage: true, marked: false},
      ]},
      {question: "<p>A computer is a machine or</p> <p>device that performs processes</p>", 
      imageUrl: "https://homepages.cae.wisc.edu/~ece533/images/boat.png", questionId: 123, status: 0, isImage: true, options: [
        {option: "https://homepages.cae.wisc.edu/~ece533/images/arctichare.png", optionId: 1, isImage: true, marked: false},
        {option: "https://homepages.cae.wisc.edu/~ece533/images/baboon.png", optionId: 2, isImage: true, marked: false},
        {option: "https://homepages.cae.wisc.edu/~ece533/images/boat.png", optionId: 3, isImage: true, marked: false},
        {option: "https://homepages.cae.wisc.edu/~ece533/images/airplane.png", optionId: 4, isImage: true, marked: false},
      ]},
      {question: "<p>A computer is a machine or</p> <p>device that performs processes</p>", 
      imageUrl: "https://homepages.cae.wisc.edu/~ece533/images/boat.png", questionId: 123, status: 0, isImage: true, options: [
        {option: "https://homepages.cae.wisc.edu/~ece533/images/arctichare.png", optionId: 1, isImage: true, marked: false},
        {option: "https://homepages.cae.wisc.edu/~ece533/images/baboon.png", optionId: 2, isImage: true, marked: false},
        {option: "https://homepages.cae.wisc.edu/~ece533/images/boat.png", optionId: 3, isImage: true, marked: false},
        {option: "https://homepages.cae.wisc.edu/~ece533/images/airplane.png", optionId: 4, isImage: true, marked: false},
      ]},
      {question: "<p>A computer is a machine or</p> <p>device that performs processes</p>", 
      imageUrl: "https://homepages.cae.wisc.edu/~ece533/images/boat.png", questionId: 123, status: 0, isImage: true, options: [
        {option: "https://homepages.cae.wisc.edu/~ece533/images/arctichare.png", optionId: 1, isImage: true, marked: false},
        {option: "https://homepages.cae.wisc.edu/~ece533/images/baboon.png", optionId: 2, isImage: true, marked: false},
        {option: "https://homepages.cae.wisc.edu/~ece533/images/boat.png", optionId: 3, isImage: true, marked: false},
        {option: "https://homepages.cae.wisc.edu/~ece533/images/airplane.png", optionId: 4, isImage: true, marked: false},
      ]}
    ];
    this.examinationData[0]["status"] = 1;
  }

  handleEvent(event): void{
    console.log(event);
    var timeLeft = event.left/1000
    if(event.action == "start"){
      this.toastrService.success("Examination started");
    }
    else if(event.action == "notify"){
      this.toastrService.warning("You have " + timeLeft + " minutes left");
    }
    else if(event.action == "done"){
      this.toastrService.success("Examination completed");
      this.router.navigate(["landing/student/initial/" + 
      localStorage.getItem("userId") + "/" + 
      localStorage.getItem("sessionId") + "/" +
      localStorage.getItem("examId")]);
    }
  }

  GotoQuestion(index: number): void{
    this.activeIndex = index;
    if(this.examinationData[index]["status"]==0)
    this.examinationData[index]["status"] = 1;
  }

  Answer(Qindex: number, Aindex: number, questionNo: number, answerNo: number, event: any): void{
    for(var i=0; i<this.examinationData[Qindex]["options"].length; i++){
      this.examinationData[Qindex]["options"][i]["marked"] = false;
    }
    this.examinationData[Qindex]["options"][Aindex]["marked"] = event.source.checked;
    this.examinationData[Qindex]["status"] = 2;
  }

  MarkASReview(index: number): void{
    this.examinationData[index]["status"] = 3;
  }

  Navigate(type: string, index: number, first: boolean, last: boolean): void{
    if(!last && type.toLowerCase() == 'next'){
      index = index+1;
      this.activeIndex = index;
      if(this.examinationData[index]["status"]==0)
      this.examinationData[index]["status"] = 1;
    }
    else if(!first && type.toLowerCase() == 'previous'){
      index = index-1;
    this.activeIndex = index;
    if(this.examinationData[index]["status"]==0)
      this.examinationData[index]["status"] = 1;
    }
  }


}

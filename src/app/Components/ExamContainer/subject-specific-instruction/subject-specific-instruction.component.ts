import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subject-specific-instruction',
  templateUrl: './subject-specific-instruction.component.html',
  styleUrls: ['./subject-specific-instruction.component.scss']
})
export class SubjectSpecificInstructionComponent implements OnInit, OnDestroy {

  constructor(private dataService: DataService, private router: Router) { }

  user: object;

  subscription: Subscription;

  ngOnInit() {
    localStorage.setItem('studentSubjectSpecificInstruction', 'true');
    this.subscription = this.dataService.studentData.subscribe(response => {
      if(response){
        this.user = response;
      }
    })
  }

  Previous(): void{
    this.router.navigate(["/landing/student/exam/commoninstructions"]);
  }

  Proceed(): void{
    this.dataService.toggleFullScreen();
    this.router.navigate(["/landing/student/exam/progress"]);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}

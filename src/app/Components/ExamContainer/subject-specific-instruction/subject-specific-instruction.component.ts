import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subject-specific-instruction',
  templateUrl: './subject-specific-instruction.component.html',
  styleUrls: ['./subject-specific-instruction.component.scss']
})
export class SubjectSpecificInstructionComponent implements OnInit {

  constructor(private dataService: DataService, private router: Router) { }

  user: object;

  ngOnInit() {
    this.dataService.studentData.subscribe(response => {
      if(response){
        this.user = response;
      }
    })
  }

  Previous(): void{
    this.router.navigate(["/landing/student/exam/commoninstructions"]);
  }

  Proceed(): void{
    this.router.navigate(["/landing/student/exam/progress"]);
  }

}

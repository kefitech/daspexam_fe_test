import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-common-instructions',
  templateUrl: './common-instructions.component.html',
  styleUrls: ['./common-instructions.component.scss']
})
export class CommonInstructionsComponent implements OnInit {

  constructor(private router: Router) { }

  
  ngOnInit() {
  }

  Next(): void{
    this.router.navigate(['/landing/student/exam/subjectspecificinstructions']);
  }
}

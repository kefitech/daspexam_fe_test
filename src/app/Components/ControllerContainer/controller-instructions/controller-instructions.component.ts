import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ControllerAuthService } from 'src/app/Services/controller-auth.service';
import { ToastrService } from 'ngx-toastr';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';

@Component({
  selector: 'app-controller-instructions',
  templateUrl: './controller-instructions.component.html',
  styleUrls: ['./controller-instructions.component.scss']
})
export class ControllerInstructionsComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private auth: ControllerAuthService,
    private toastrService: ToastrService, private service: ControllerAPIService) { }

    examFetchCompleted: boolean = false;

  ngOnInit() {
    window.onpopstate = function (e) { window.history.forward(); }
  }

  ngAfterViewInit() {
    try {
      this.service.ExamFetchFromMainServer().subscribe(response => {
        if (response.success) {
          localStorage.setItem('Token', response.data.token);
          this.examFetchCompleted = true;
        }
        else{
          this.toastrService.error(response.message);
          this.examFetchCompleted = false;
        }
      }, error => {
        this.toastrService.error(error.message);
      })
    }
    catch (e) {
      this.toastrService.error(e);
    }
  }

  Accept(): void {
    localStorage.setItem('AcceptInstruction', 'true');
    this.auth.controllerLoginAuth();
    this.router.navigate(['landing/controller/dashboard']);
  }

}

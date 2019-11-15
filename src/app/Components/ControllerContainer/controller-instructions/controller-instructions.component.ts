import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ControllerAuthService } from 'src/app/Services/controller-auth.service';

@Component({
  selector: 'app-controller-instructions',
  templateUrl: './controller-instructions.component.html',
  styleUrls: ['./controller-instructions.component.scss']
})
export class ControllerInstructionsComponent implements OnInit {

  constructor(private router: Router, private auth: ControllerAuthService) { }

  ngOnInit() {
    window.onpopstate = function (e) { window.history.forward(); }
  }

  Accept(): void{
    localStorage.setItem('AcceptInstruction', 'true');
    this.auth.controllerLoginAuth();
    this.router.navigate(['landing/controller/dashboard']);
  }

}

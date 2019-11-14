import { Component, OnInit } from '@angular/core';
import { ControllerAuthService } from 'src/app/Services/controller-auth.service';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-controller-dashboard',
  templateUrl: './controller-dashboard.component.html',
  styleUrls: ['./controller-dashboard.component.scss']
})
export class ControllerDashboardComponent implements OnInit {

  constructor(private auth: ControllerAuthService, private service: ControllerAPIService,
    private ngxLoader: NgxUiLoaderService, private toastrService: ToastrService,
    private dataService: DataService, private router: Router, private formbuilder: FormBuilder) {
  }

  
  ngOnInit() {
    window.onpopstate = function (e) { window.history.forward(); }
    
  }

}

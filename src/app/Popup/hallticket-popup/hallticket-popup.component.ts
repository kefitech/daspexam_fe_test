import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StudentLoginAPIService } from 'src/app/Services/student-login-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-hallticket-popup',
  templateUrl: './hallticket-popup.component.html',
  styleUrls: ['./hallticket-popup.component.scss']
})
export class HallticketPopupComponent implements OnInit {

  constructor(private dialogScreen: MatDialogRef<HallticketPopupComponent>, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private toastrService: ToastrService, private formBuilder: FormBuilder,
    private service: StudentLoginAPIService, private ngxLoader: NgxUiLoaderService) { }

    formCaption: string = "Enter the hallticket number";
  hallticketForm: FormGroup;
  error: object = {
    required: "Please fill out this!"
  };
  submit: boolean = false;

  ngOnInit() {
    this.formSetup();
  }

  formSetup(): void {
    this.hallticketForm = this.formBuilder.group({
      hallticket: ['', [Validators.required]]
    })
  }

  Submit(): void{
    try{
      this.ngxLoader.start();
    if(this.hallticketForm.valid){
      this.service.hallTicketVerification(this.hallticketForm.value.hallticket).subscribe(response => {
        if (response.success) {
          this.submit = true;
        }
        else{
          this.toastrService.error(response.message);
          this.ngxLoader.stop();
        }
      }, error => {
        this.toastrService.error(error.message);
        this.ngxLoader.stop();
      })
    }
    else{
      this.toastrService.error("Mandatory data missing!");
      this.ngxLoader.stop();
    }
  }
  catch (e){
    this.toastrService.error("Mandatory data missing!");
    this.ngxLoader.stop();
  }
  }


  _keyPress(event: any) {
    this.dataService.NumberOnly(event);
  }

}

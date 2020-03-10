import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invigilator-otppopup',
  templateUrl: './invigilator-otppopup.component.html',
  styleUrls: ['./invigilator-otppopup.component.scss']
})
export class InvigilatorOTPPopupComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private dialogScreen: MatDialogRef<InvigilatorOTPPopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService, private toastrService: ToastrService) { }

  otpForm: FormGroup;
  otpFormData: object = {};

  isSubmit: boolean = false;

  ERROR: object = {
    required: "Please fill out this!"
  };

  ngOnInit() {
    this.OTPFormSetup();
  }

  OTPFormSetup(): void{
    this.otpFormData= {
      otp: ['', [Validators.required]]
    };
    this.otpForm = this.formbuilder.group(this.otpFormData);
  }

  Submit(): void{
    if(this.otpForm.valid){
    this.isSubmit = true;
    this.dialogScreen.close();
    }
    else{
      this.toastrService.error("Mandatory data missing!");
    }
  }

}

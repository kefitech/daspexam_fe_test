import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit {

  constructor(private dialogScreen: MatDialogRef<WarningComponent>, private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private toastrService: ToastrService,
    private router: Router) { }

    formCaption: string = "Enter the Key";
    lockForm: FormGroup;
    error: object = {
      required: "Please fill out this!"
    };

  ngOnInit() {
    this.formSetup();
  }

  formSetup(): void {
    this.lockForm = this.formBuilder.group({
      key: ['', [Validators.required]]
    })
  }

  Submit(): void{
    try{
      if(this.lockForm.valid){
        this.dataService.toggleFullScreen();
        this.dialogScreen.close();
        this.toastrService.success("Unlocked successfully");
        this.router.navigate(['/landing/student/exam/progress'])
      }
      else{
        this.toastrService.error("Mandatory data missing!");
      }
    }
    catch (e){
      this.toastrService.error(e.message);
    }
  }

}

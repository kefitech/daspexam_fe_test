import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';

@Component({
  selector: 'app-invigilator-smp-popup',
  templateUrl: './invigilator-smp-popup.component.html',
  styleUrls: ['./invigilator-smp-popup.component.scss']
})
export class InvigilatorSMPPopupComponent implements OnInit, AfterViewInit {

  constructor(private dialogScreen: MatDialogRef<InvigilatorSMPPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService,
    private ngxLoader: NgxUiLoaderService, private toastrService: ToastrService,
    private service: ControllerAPIService) { }

  studentDetails: object = {};

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.StudentSMPCheck();
  }

  StudentSMPCheck(): void {
    this.studentDetails = {
      studentName: "Sunderson.J",
      attempts: 3
    }
    // try {
    //   this.ngxLoader.start();
    //   var body = {
    //     studentId: this.data.studentId
    //   }
    //   this.service.StudentSMPCheck(body).subscribe(response => {
    //     if (response) {
    //       this.ngxLoader.stop();
    //       this.studentDetails = response.data;
    //     }
    //     else {
    //       this.toastrService.error(response.message);
    //       this.ngxLoader.stop();
    //     }
    //   }, error => {
    //     this.toastrService.error(error.message);
    //     this.ngxLoader.stop();
    //   })
    // }
    // catch (e) {
    //   this.toastrService.error(e);
    //   this.ngxLoader.stop();
    // }
  }

  Close(): void{
    this.dialogScreen.close();
  }

  Block(): void{
    try {
      this.ngxLoader.start();
      var body = {
        studentId: this.data.studentId
      }
      this.service.StudentSMPBlock(body).subscribe(response => {
        if (response) {
          this.ngxLoader.stop();
          this.studentDetails = response.data;
        }
        else {
          this.toastrService.error(response.message);
          this.ngxLoader.stop();
        }
      }, error => {
        this.toastrService.error(error.message);
        this.ngxLoader.stop();
      })
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

}

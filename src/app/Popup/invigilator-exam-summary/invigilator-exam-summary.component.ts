import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';

@Component({
  selector: 'app-invigilator-exam-summary',
  templateUrl: './invigilator-exam-summary.component.html',
  styleUrls: ['./invigilator-exam-summary.component.scss']
})
export class InvigilatorExamSummaryComponent implements OnInit, AfterViewInit {

  constructor(private formbuilder: FormBuilder, private dialogScreen: MatDialogRef<InvigilatorExamSummaryComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService,
    private toastrService: ToastrService, private ngxLoader: NgxUiLoaderService,
    private service: ControllerAPIService) { }

  summary: any;

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.FetchSummary();
  }

  FetchSummary(){
    try {
      this.ngxLoader.start();
      this.service.ExamSummary().subscribe(response => {
        if(response.success){
          this.summary = response.data;
          this.ngxLoader.stop();
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
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

}

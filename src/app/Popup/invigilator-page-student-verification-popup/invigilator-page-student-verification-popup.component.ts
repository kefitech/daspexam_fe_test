import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from 'src/app/Services/data.service';

@Component({
  selector: 'app-invigilator-page-student-verification-popup',
  templateUrl: './invigilator-page-student-verification-popup.component.html',
  styleUrls: ['./invigilator-page-student-verification-popup.component.scss']
})
export class InvigilatorPageStudentVerificationPopupComponent implements OnInit {

  constructor(private dialogScreen: MatDialogRef<InvigilatorPageStudentVerificationPopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService) { }

  isSubmit: boolean = false;

  ngOnInit() {
    
  }

  Submit(): void{
    this.isSubmit = true;
    this.dialogScreen.close();
  }

}

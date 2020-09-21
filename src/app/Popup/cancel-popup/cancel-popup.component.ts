import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-cancel-popup',
  templateUrl: './cancel-popup.component.html',
  styleUrls: ['./cancel-popup.component.scss']
})
export class CancelPopupComponent implements OnInit {

  constructor(private dialogScreen: MatDialogRef<CancelPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  isSubmit: boolean = false;

  ngOnInit() {
  }

  

  Submit(): void{
    this.isSubmit = true;
    this.dialogScreen.close();
  }
}

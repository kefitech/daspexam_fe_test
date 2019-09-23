import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { ExamAPIService } from 'src/app/Services/exam-api.service';
import { MatDialog } from '@angular/material';
import { WarningComponent } from 'src/app/Popup/warning/warning.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-panel',
  templateUrl: './common-panel.component.html',
  styleUrls: ['./common-panel.component.scss']
})
export class CommonPanelComponent implements OnInit {

  constructor(private dataService: DataService, private deviceService: DeviceDetectorService,
    private toastrService: ToastrService, private apiService: ExamAPIService, private dialog: MatDialog,
    private router: Router) { }

  fullScr: boolean = false;
  winHeight: number;

  ngOnInit() {
    this.fullScr = true;
    this.winHeight = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event){
    if(this.winHeight < window.innerHeight)
    this.winHeight = window.innerHeight;
      if( window.innerHeight != this.winHeight) {
        this.sendWarning();
       }
  }

  // @HostListener('contextmenu', ['$event'])
  // onRightClick(event) {
  //   event.preventDefault();
  // }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault();
    console.log(event);
    
  }

  // *mouse click event

  // @HostListener('document:click', ['$event'])
  // public documentClick(event: Event): void {
  //   this.fullScreen();
  // }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    event.preventDefault();
  }

  sendWarning(): void{
    this.dataService.warning.next(true);
    this.router.navigate(['/initial']);
    this.dialog.open(WarningComponent, 
      { 
        minWidth: '35%',
        disableClose: true
      });
  }

}

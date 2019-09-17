import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { ExamAPIService } from 'src/app/Services/exam-api.service';

@Component({
  selector: 'app-common-panel',
  templateUrl: './common-panel.component.html',
  styleUrls: ['./common-panel.component.scss']
})
export class CommonPanelComponent implements OnInit {

  constructor(private dataService: DataService, private deviceService: DeviceDetectorService,
    private toastrService: ToastrService, private apiService: ExamAPIService) { }

  fullScr: boolean = false;
  winHeight: number;

  ngOnInit() {
    this.fullScr = true;
    this.winHeight = window.innerHeight;
      setTimeout(() => {
        this.questionsFetch();
      }, 0);
  }

  questionsFetch(): void{
    try {
      var data = {};
        this.apiService.examDetails(data).subscribe(response => {
          if(response.success){
          this.dataService.examData.next(response.data);
          }
          else{
            this.toastrService.error(response.message);
          }
        }, error => {
          this.toastrService.error(error.message);
        })
    }
    catch (e) {
      this.toastrService.error(e);
    }
  }

  

  // fullScreen(): void {
  //   // Trigger fullscreen
  //  this.dataService.toggleFullScreen();
  //   this.fullScr = true;
  //   this.winHeight = window.innerHeight;
  // }

  // existFullScreen(): void {
  //   const docWithBrowsersExitFunctions = document as Document & {
  //     mozCancelFullScreen(): Promise<void>;
  //     webkitExitFullscreen(): Promise<void>;
  //     msExitFullscreen(): Promise<void>;
  //   };
  //   if (docWithBrowsersExitFunctions.exitFullscreen) {
  //     docWithBrowsersExitFunctions.exitFullscreen();
  //   } else if (docWithBrowsersExitFunctions.mozCancelFullScreen) { /* Firefox */
  //     docWithBrowsersExitFunctions.mozCancelFullScreen();
  //   } else if (docWithBrowsersExitFunctions.webkitExitFullscreen) { /* Chrome, Safari and Opera */
  //     docWithBrowsersExitFunctions.webkitExitFullscreen();
  //   } else if (docWithBrowsersExitFunctions.msExitFullscreen) { /* IE/Edge */
  //     docWithBrowsersExitFunctions.msExitFullscreen();
  //   }
  //   this.fullScr = false;
  // }

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
    console.log("warning");
    this.dataService.warning.next(true);
  }

}

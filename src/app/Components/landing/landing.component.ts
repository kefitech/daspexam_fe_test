import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(private dataService: DataService, private router: Router, 
    private deviceService: DeviceDetectorService) { }

  logo: object = {
    img: "../../../assets/Images/Logo.png",
    alt: "logo"
  }
  user: object;


  ngOnInit() {
    this.dataService.sideNavButton.next(false);
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  // fullScreen(): void {
  //   // Trigger fullscreen
  //   const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
  //     mozRequestFullScreen(): Promise<void>;
  //     webkitRequestFullscreen(): Promise<void>;
  //     msRequestFullscreen(): Promise<void>;
  //   };

  //   if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen && this.deviceService.browser.toLowerCase() == "firefox") { /* Firefox */
  //     docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
  //   } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen && this.deviceService.browser.toLowerCase() == "chrome") { /* Chrome, Safari and Opera */
  //     docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
  //   } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen && this.deviceService.browser.toLowerCase() == "edge") { /* IE/Edge */
  //     docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
  //   }
  //   this.dataService.warning.next(false);
  // }
  
  toggleFullScreen() {
   this.dataService.toggleFullScreen()
    this.dataService.warning.next(false);
}

@HostListener('window:resize', ['$event'])
  onResize(event){
   event.preventDefault();
  }

  sideNavToggle(): void{
    this.dataService.sideNav.next(true);
  }


}

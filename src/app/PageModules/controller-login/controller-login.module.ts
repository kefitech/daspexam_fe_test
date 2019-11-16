import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControllerLoginRoutingModule } from './controller-login-routing.module';
import { ControllerLoginComponentContainer } from './controller-login-container';
import { AngularMaterial } from 'src/app/CommonModules/MaterialModules';
import { InvigilatorOTPPopupComponent } from 'src/app/Popup/invigilator-otppopup/invigilator-otppopup.component';
import { InvigilatorPageStudentVerificationPopupComponent } from 'src/app/Popup/invigilator-page-student-verification-popup/invigilator-page-student-verification-popup.component';
import {WebcamModule} from 'ngx-webcam';

@NgModule({
  declarations: [
    ControllerLoginComponentContainer
  ],
  imports: [
    CommonModule,
    ControllerLoginRoutingModule,
    AngularMaterial,
    WebcamModule
  ],
  entryComponents: [InvigilatorOTPPopupComponent, InvigilatorPageStudentVerificationPopupComponent]
})
export class ControllerLoginModule { }

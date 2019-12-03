import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControllerLoginRoutingModule } from './controller-login-routing.module';
import { ControllerLoginComponentContainer } from './controller-login-container';
import { AngularMaterial } from 'src/app/CommonModules/MaterialModules';
import { InvigilatorOTPPopupComponent } from 'src/app/Popup/invigilator-otppopup/invigilator-otppopup.component';
import { InvigilatorPageStudentVerificationPopupComponent } from 'src/app/Popup/invigilator-page-student-verification-popup/invigilator-page-student-verification-popup.component';
import { WebcamModule } from 'ngx-webcam';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { CountdownModule } from 'ngx-countdown';
import { InvigilatorSMPPopupComponent } from 'src/app/Popup/invigilator-smp-popup/invigilator-smp-popup.component';
import { ConfirmationPopupComponent } from 'src/app/Popup/confirmation-popup/confirmation-popup.component';

@NgModule({
  declarations: [
    ControllerLoginComponentContainer
  ],
  imports: [
    CommonModule,
    ControllerLoginRoutingModule,
    AngularMaterial,
    WebcamModule,
    CountdownModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  entryComponents: [InvigilatorOTPPopupComponent,
    InvigilatorPageStudentVerificationPopupComponent,
    InvigilatorSMPPopupComponent,
    ConfirmationPopupComponent
  ],
})
export class ControllerLoginModule { }

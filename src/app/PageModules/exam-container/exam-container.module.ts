import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamContainerRoutingModule } from './exam-container-routing.module';
import { AngularMaterial } from 'src/app/CommonModules/MaterialModules';
import { ExamComponentContainer } from './exam-component-container';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { CountdownModule } from 'ngx-countdown';
import { WarningComponent } from 'src/app/Popup/warning/warning.component';
import { ExamSummaryComponent } from 'src/app/Popup/exam-summary/exam-summary.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { StudentInstructionPopupComponent } from 'src/app/Popup/student-instruction-popup/student-instruction-popup.component';

@NgModule({
  declarations: [
    ExamComponentContainer
  ],
  imports: [
    CommonModule,
    AngularMaterial,
    CountdownModule,
    ExamContainerRoutingModule,
    DeviceDetectorModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  entryComponents: [WarningComponent, ExamSummaryComponent, StudentInstructionPopupComponent]
})
export class ExamContainerModule { }

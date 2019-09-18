import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamContainerRoutingModule } from './exam-container-routing.module';
import { AngularMaterial } from 'src/app/CommonModules/MaterialModules';
import { ExamComponentContainer } from './exam-component-container';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { CountdownModule } from 'ngx-countdown';
import { WarningComponent } from 'src/app/Popup/warning/warning.component';

@NgModule({
  declarations: [
    ExamComponentContainer
  ],
  imports: [
    CommonModule,
    AngularMaterial,
    CountdownModule,
    ExamContainerRoutingModule,
    DeviceDetectorModule.forRoot()
  ],
  entryComponents: [WarningComponent]
})
export class ExamContainerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControllerLoginRoutingModule } from './controller-login-routing.module';
import { ControllerLoginComponentContainer } from './controller-login-container';
import { AngularMaterial } from 'src/app/CommonModules/MaterialModules';
import { InvigilatorOTPPopupComponent } from 'src/app/Popup/invigilator-otppopup/invigilator-otppopup.component';


@NgModule({
  declarations: [
    ControllerLoginComponentContainer
  ],
  imports: [
    CommonModule,
    ControllerLoginRoutingModule,
    AngularMaterial
  ],
  entryComponents: [InvigilatorOTPPopupComponent]
})
export class ControllerLoginModule { }

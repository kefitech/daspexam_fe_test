import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentLoginRoutingModule } from './student-login-routing.module';
import { StudentLoginComponentContainer } from './student-login-container';
import { AngularMaterial } from 'src/app/CommonModules/MaterialModules';


@NgModule({
  declarations: [
    StudentLoginComponentContainer
  ],
  imports: [
    CommonModule,
    StudentLoginRoutingModule,
    AngularMaterial,
  ],
  entryComponents: [
  ]
})
export class StudentLoginModule { }

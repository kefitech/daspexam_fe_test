import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControllerLoginComponent } from 'src/app/Components/controller-login/controller-login.component';


const routes: Routes = [
  { path: '', component: ControllerLoginComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControllerLoginRoutingModule { }

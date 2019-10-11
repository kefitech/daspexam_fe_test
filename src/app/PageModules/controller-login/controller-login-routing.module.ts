import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControllerLoginComponent } from 'src/app/Components/controller-login/controller-login.component';
import { ControllerDashboardComponent } from 'src/app/Components/ControllerContainer/controller-dashboard/controller-dashboard.component';
import { ControllerLoginGuard } from 'src/app/Authguard/controller-login.guard';


const routes: Routes = [
  { path: 'login', component: ControllerLoginComponent },
  { path: 'dashboard', component: ControllerDashboardComponent, canActivate: [ControllerLoginGuard] },
  { path: '', redirectTo: 'login', pathMatch: "full" },
  { path: '**', redirectTo: 'login', pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControllerLoginRoutingModule { }

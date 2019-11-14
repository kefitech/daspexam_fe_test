import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from 'src/app/Components/landing/landing.component';
import { PageNotFoundComponent } from 'src/app/Components/page-not-found/page-not-found.component';


const routes: Routes = [
  { path: '', component: LandingComponent, children: [
    { path: 'controller', 
      loadChildren: () => import ("../controller-login/controller-login.module").then(m => m.ControllerLoginModule) },
    { path: 'student', 
      loadChildren: () => import ("../student-login/student-login.module").then(m => m.StudentLoginModule) },
      {path: 'notfound', component: PageNotFoundComponent},
      { path: '', redirectTo: 'notfound', pathMatch: 'full' },
    { path: '**', redirectTo: 'notfound', pathMatch: 'full' }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }

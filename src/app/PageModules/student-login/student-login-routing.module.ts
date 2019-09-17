import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentLoginComponent } from 'src/app/Components/student-login/student-login.component';
import { InitialStudentLoginComponent } from 'src/app/Components/student-login/initial-student-login/initial-student-login.component';
import { HallticketAuthGuard } from 'src/app/Authguard/hallticket-auth.guard';


const routes: Routes = [
  { path: '', component: StudentLoginComponent, children: [
    { path: 'initial/:uid/:sessionid/:examid', component: InitialStudentLoginComponent },
    { path: 'exam', loadChildren: () => import("../exam-container/exam-container.module").then(m => m.ExamContainerModule),},
    // canActivate: [HallticketAuthGuard]},
    { path: '', redirectTo: 'initial/' + 
    localStorage.getItem("userId") + "/" +
    localStorage.getItem("sessionId") + "/" +
    localStorage.getItem("examId"), 
    pathMatch: 'full' },
    { path: '**',  redirectTo: 'initial/' + 
    localStorage.getItem("userId") + "/" +
    localStorage.getItem("sessionId") + "/" +
    localStorage.getItem("examId"), pathMatch: 'full' }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentLoginRoutingModule { }

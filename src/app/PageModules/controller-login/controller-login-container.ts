import { ControllerLoginComponent } from 'src/app/Components/controller-login/controller-login.component';
import { ControllerDashboardComponent } from 'src/app/Components/ControllerContainer/controller-dashboard/controller-dashboard.component';
import { InvigilatorOTPPopupComponent } from 'src/app/Popup/invigilator-otppopup/invigilator-otppopup.component';
import { ControllerInstructionsComponent } from 'src/app/Components/ControllerContainer/controller-instructions/controller-instructions.component';
import { InvigilatorPageStudentVerificationPopupComponent } from 'src/app/Popup/invigilator-page-student-verification-popup/invigilator-page-student-verification-popup.component';
import { ControllerStartExamComponent } from 'src/app/Components/ControllerContainer/controller-start-exam/controller-start-exam.component';


export const ControllerLoginComponentContainer = [
    ControllerLoginComponent, 
    ControllerDashboardComponent, 
    InvigilatorOTPPopupComponent, 
    ControllerInstructionsComponent,
    InvigilatorPageStudentVerificationPopupComponent,
    ControllerStartExamComponent
];
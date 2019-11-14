import { ControllerLoginComponent } from 'src/app/Components/controller-login/controller-login.component';
import { ControllerDashboardComponent } from 'src/app/Components/ControllerContainer/controller-dashboard/controller-dashboard.component';
import { InvigilatorOTPPopupComponent } from 'src/app/Popup/invigilator-otppopup/invigilator-otppopup.component';
import { ControllerInstructionsComponent } from 'src/app/Components/ControllerContainer/controller-instructions/controller-instructions.component';


export const ControllerLoginComponentContainer = [
    ControllerLoginComponent, ControllerDashboardComponent, InvigilatorOTPPopupComponent, ControllerInstructionsComponent
];
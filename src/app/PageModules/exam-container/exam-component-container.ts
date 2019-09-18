
import { CommonInstructionsComponent } from 'src/app/Components/ExamContainer/common-instructions/common-instructions.component';
import { CommonPanelComponent } from 'src/app/Components/ExamContainer/common-panel/common-panel.component';
import { SubjectSpecificInstructionComponent } from 'src/app/Components/ExamContainer/subject-specific-instruction/subject-specific-instruction.component';
import { ExamStartComponent } from 'src/app/Components/ExamContainer/exam-start/exam-start.component';
import { WarningComponent } from 'src/app/Popup/warning/warning.component';
import { ExamSummaryComponent } from 'src/app/Components/ExamContainer/exam-summary/exam-summary.component';
import { MarkListComponent } from 'src/app/Components/ExamContainer/mark-list/mark-list.component';

export const ExamComponentContainer = [
    CommonInstructionsComponent, 
    CommonPanelComponent, 
    SubjectSpecificInstructionComponent,
    ExamStartComponent,
    WarningComponent,
    ExamSummaryComponent,
    MarkListComponent
];
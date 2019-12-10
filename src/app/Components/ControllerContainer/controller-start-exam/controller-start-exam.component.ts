import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CountdownComponent } from 'ngx-countdown';
import { InvigilatorSMPPopupComponent } from 'src/app/Popup/invigilator-smp-popup/invigilator-smp-popup.component';
import { ConfirmationPopupComponent } from 'src/app/Popup/confirmation-popup/confirmation-popup.component';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { InvigilatorPageStudentVerificationPopupComponent } from 'src/app/Popup/invigilator-page-student-verification-popup/invigilator-page-student-verification-popup.component';

@Component({
  selector: 'app-controller-start-exam',
  templateUrl: './controller-start-exam.component.html',
  styleUrls: ['./controller-start-exam.component.scss']
})
export class ControllerStartExamComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private toastrService: ToastrService, private ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog, private service: ControllerAPIService) { }

  masterTimerConfig: any;
  masterSubmitValid: boolean = false;

  totalStableDuration: any;

  studentTimerPauseResumeCaption: string = "Do you want to Pause/Resume this student?"


  examList: Array<object>;
  examListCopy: Array<object>;
  backupSystems: Array<object>;
  displayedColumns: any = ['sno', 'name', 'hallTicketNumber', 'systemNo', 'timer', 'action'];
  headerCaption: object = JSON.parse(JSON.stringify({// stepper 1
    caption1: "S/no",
    caption2: "Name",
    caption3: "Hall TicketNo",
    caption4: "System No",
    caption5: "Timer",
    caption6: "Action"
  }))
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();// stepper 1
  @ViewChildren('myPaginator') studentListPaginator: QueryList<ElementRef>;
  @ViewChildren('masterTimer') masterTimer: CountdownComponent;
  @ViewChildren('studentTimer') studentTimer: QueryList<ElementRef>;

  @ViewChildren('systems') systems: QueryList<ElementRef>;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.FetchExamList();
  }

  handleMasterTimerEvent(event): void {
    var timeLeft = event.left / 60000;

    if (event.action == "start") {
      this.toastrService.success("Examination started");
    }
    else if (event.action == "notify") {
      this.toastrService.warning("You have " + timeLeft + " minutes left");
    }
    else if (event.action == "done") {
      this.masterSubmitValid = true;
      this.toastrService.success("Examination completed");
    }
  }


  FetchExamList(): void {
    try {
      this.ngxLoader.start();
      this.service.ExaminationInfoForVerifiedStudents().subscribe(response => {
        if (response.success) {
          this.examList = response.data.studentList;
          console.log(this.examList);

          this.examListCopy = this.examList.map(x => Object.assign({}, x));
          this.backupSystems = [
            { value: 'System1', disabled: false },
            { value: 'System2', disabled: false },
            { value: 'System3', disabled: false },
            { value: 'System4', disabled: false },
            { value: 'System5', disabled: false },
          ]
          this.masterTimerConfig = { leftTime: response.data.examDuration * 60 };//, notify: [2 * 60, 9 * 60]
          this.TableRefresh();
          setTimeout(() => {
            this.CheckAllStudentTimer();
          }, 10);
          this.ngxLoader.stop();
        }
        else {
          this.toastrService.error(response.message);
          this.ngxLoader.stop();
        }
      }, error => {
        this.toastrService.error(error.message);
        this.ngxLoader.stop();
      })
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  TableRefresh(): void {
    this.examList.forEach((element, index) => {
      element['studentList'] = new MatTableDataSource<any>(element['studentList']);
      setTimeout(() => {
        element['studentList'].paginator = this.paginator.toArray()[index];
        element['studentList'].sort = this.sort.toArray()[index];
      }, 10);

      element['studentList']['data'] = element['studentList']['data'].map(({ timeLeft, ...rest }) =>
        ({ timeLeft: { leftTime: timeLeft * 60 }, ...rest }));
    });
  }

  StudentTimerPauseResume(index: number, rowIndex: number, status: number, check?: any): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '40%',
      data: { title: "Do you want to Pause/Resume time for this student?" }
    })
    dialogRef.afterClosed().subscribe(response => {
      var isSubmit = dialogRef.componentInstance.isSubmit;
      if (isSubmit) {
        try {
          var length = 0;
          if (index > 0) {
            for (var i = 0; i < index; i++) {
              length = length + this.examList[i]['studentList']['data'].length;
            }
          }
          this.ngxLoader.start();
          if (!check && status == 3)
            var timeInSec = (this.studentTimer['_results'][length + rowIndex]['i']['value']) / 1000;
          var body = {
            type: status == 3 ? 'resume' : 'pause',
            time: (this.studentTimer['_results'][length + rowIndex]['i']['value'] / 1000),
            studentId: this.examList[index]['studentList']['data'][rowIndex]['examStudentId'],
            examId: this.examList[index]['examId']
          }
          console.log(body);
          
          this.service.TimePauseresume(body).subscribe(response => {
            if (response.success) {
              this.StudentTimePauseResumeConfig(index, rowIndex, status, check);
            }
            else {
              this.toastrService.error(response.message);
              this.ngxLoader.stop();
            }
          }, error => {
            this.toastrService.error(error.message);
            this.ngxLoader.stop();
          })
        }
        catch (e) {
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
    })
  }

  StudentTimePauseResumeConfig(index: number, rowIndex: number, status: number, check?: any): void {
    var length = 0;
    if (index > 0) {
      for (var i = 0; i < index; i++) {
        length = length + this.examList[i]['studentList']['data'].length;
      }
    }
    if (!check)
      this.examList[index]['studentList']['data'][rowIndex]['status'] = status == 3 ? 4 : 3;
    if (status == 3)
      this.studentTimer['_results'][length + rowIndex].pause();
    else if (status == 4)
      this.studentTimer['_results'][length + rowIndex].resume();
    if (!check && status == 3) {
      this.examList[index]['studentList']['data'][rowIndex]['time'] =
        (this.studentTimer['_results'][length + rowIndex]['i']['value'] / 1000);
    }
  }

  CheckAllStudentTimer(): void {
    var pauseIndex = [];
    this.examList.forEach((examList, examIndex) => {
      // examList['studentList']['data'] = 
      // examList['studentList']['data'].map(({systemNo, ...rest}) => 
      // ({systemNo, systems: this.backupSystems.concat(systemNo), ...rest}));//system dropdown setup

      examList['studentList']['data'].forEach((row, rowIndex) => {
        if (row['status'] == 4)
          pauseIndex.push({ row: rowIndex, parent: examIndex });
      });
    });
    pauseIndex.forEach(element => {
      this.StudentTimePauseResumeConfig(element.parent, element.row, 3, true);
    });
  }

  SystemChange(oldValue: string, value: string, index: number, rowIndex: number, optIndex: number): void {
    this.examList[index]['studentList']['data'][rowIndex]['systemNo'] = value;
    this.backupSystems.splice(optIndex, 1)
    // this.backupSystems[optIndex]['value'] = oldValue;
    // this.backupSystems[optIndex]['removed'] = true;
  }

  // SystemChange(value: string, index: number, rowIndex: number): void{
  //   var filteredValue = value.replace(/<\/?[^>]+(>|$)/g, "");
  //   var backupArrayIndex = this.backupSystems.findIndex(d => d==value);
  //   this.backupSystems.push('<s><span>' + this.examListCopy[index]['studentList'][rowIndex]['systemNo'] + '</span></s>');
  //   this.backupSystems.splice(backupArrayIndex, 1);
  //   this.examListCopy[index]['studentList'][rowIndex]['systemNo'] = filteredValue;
  //   var duplicate = this.examListCopy.map(x => Object.assign({}, x));
  //   this.examList[index]['studentList']['data'][rowIndex]['systemNo'] = duplicate[index]['studentList'][rowIndex]['systemNo'];
  //   this.examList.forEach((examList, examIndex) => {
  //     examList['studentList']['data'] = 
  //     examList['studentList']['data'].map(({systemNo, ...rest}) => 
  //     ({systemNo, systems: this.backupSystems.concat(systemNo), ...rest}));//system dropdown setup
  //   })
  // }

  handleStudentTimerEvent(event: any, index: number, rowIndex: number): void {

    if (event.action == "done") {
      var length = 0;
      if (index > 0) {
        for (var i = 0; i < index; i++) {
          length = length + this.examList[i]['studentList']['data'].length;
        }
      }
      if (this.studentTimer['_results'][length + rowIndex])
        this.studentTimer['_results'][length + rowIndex].stop();
      this.examList[index]['studentList']['data'][rowIndex]['studentStatus'] = 2;
    }
  }

  StudentSMP(data: object): void {
    const dialogRef = this.dialog.open(InvigilatorSMPPopupComponent, {
      width: '40%',
      // height: '100%',
      data: { student: data }
    })
  }

  Submit(type: string, examIndex?: number, rowIndex?: number, examId?: number, data?: object): void {
    var title = type == 'student' ? "Do you want to submit exam for this student?" : type == 'exam' ? "Do you want to submit all students in this exam?" : "Do you want to submit all exams?";
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '40%',
      data: { title: title }
    })
    dialogRef.afterClosed().subscribe(response => {
      var isSubmit = dialogRef.componentInstance.isSubmit;
      if (isSubmit) {
        var body;
        if (type == 'student') {
          body = {
            examDetails: [this.examList[examIndex]['studentList']['data'][rowIndex]].map(({ ...rest }) => ({ examId: examId, ...rest }))
          }
        }
        else if (type == 'exam') {
          body = {
            examDetails: this.examList[examIndex]['studentList']['data'].map(({ ...rest }) => ({ examId: examId, ...rest }))
          }
        }
        else if (type == 'all') {
          var studentList = [];
          this.examList.forEach(element => {
            studentList = studentList.concat(element['studentList']['data'].map(({ ...rest }) => ({ examId: element['examId'], ...rest })));
          });
          body = {
            examDetails: studentList
          }
        }
        this.SaveFunctionalitiesOnTable(type, false, examIndex, rowIndex);
        try {
          // this.ngxLoader.start();
          // this.service.SubmitExam(body).subscribe(response => {
          //   if (response.success) {
          // if (type == 'student') {
          //   this.examList[examIndex]['studentList']['data'][rowIndex]['isSubmit'] = true;
          // }
          this.SaveFunctionalitiesOnTable(type, true, examIndex, rowIndex);
          //   }
          //   else {
          //     this.toastrService.error(response.message);
          //     this.ngxLoader.stop();
          //   }
          // }, error => {
          //   this.toastrService.error(error.message);
          //   this.ngxLoader.stop();
          // })
        }
        catch (e) {
          this.toastrService.error(e);
          this.ngxLoader.stop();
        }
      }
    })
  }

  SaveFunctionalitiesOnTable(type: string, status: boolean, examIndex?: number, rowIndex?: number): void {
    if (type == 'student') {
      this.examList[examIndex]['studentList']['data'][rowIndex]['isSubmit'] = status;
      var isSingleExamsDone = this.examList[examIndex]['studentList']['data'].every(d => d.isSubmit == true);
      if (isSingleExamsDone && status)
        this.examList[examIndex]['isSubmit'] = status;
      let allExamsDone = this.examList.every(d => d['isSubmit'] == true);
      if (allExamsDone && status)
        this.masterSubmitValid = !status;
    }
    else if (type == 'exam') {
      let length = 0;
      if (examIndex > 0) {
        for (var i = 0; i < examIndex; i++) {
          length = length + this.examList[i]['studentList']['data'].length;
        }
      }
      let startVal = length;
      let endVal = length + this.examList[examIndex]['studentList']['data'].length;
      var time = [];
      for (startVal; startVal < endVal; startVal++) {
        this.studentTimer['_results'][startVal].pause();
        time.push(this.studentTimer['_results'][startVal]['i']['value'] / 1000);
      }
      if (status)
        this.examList[examIndex]['isSubmit'] = status;
      this.examList[examIndex]['studentList']['data'].forEach((element, index) => {
        if (status)
          element['isSubmit'] = status;
        element['time'] = time[index];
      });

      let allExamsDone = this.examList.every(d => d['isSubmit'] == true);
      if (allExamsDone)
        this.masterSubmitValid = !status;
    }
    else if (type == 'all') {
      var length = 0;
      this.examList.forEach((element, examIndex) => {
        element['studentList']['data'].forEach((studentData) => {
          if (status)
            studentData['isSubmit'] = status;
          studentData['time'] = this.studentTimer['_results'][length]['i']['value'] / 1000;
          this.studentTimer['_results'][length].pause();
          length++;
        });
        element['isSubmit'] = status;
      });

      this.masterSubmitValid = !status;
    }
  }

  SingleStudentVerification(data: object, index: number, rowIndex: number): void {// stepper 1
    var rowData = Object.assign({}, data);
    console.log(this.masterTimer);

    const dialogRef = this.dialog.open(InvigilatorPageStudentVerificationPopupComponent, {
      width: '45%',
      height: '80%',
      data: { student: rowData, exam: this.examList[index], duration: this.examList[index]['duration'] }
    })
    dialogRef.afterClosed().subscribe(response => {
      var submit = dialogRef.componentInstance.isSubmit;
      if (submit) {
        this.CheckSingleStudentVerification(dialogRef.componentInstance.data.student['verified'], index, rowIndex);
      }
    })
  }

  CheckSingleStudentVerification(verified: boolean, index: number, rowIndex: number): void {
    try {
      this.ngxLoader.start();
      this.examList[index]['studentList']['data'][rowIndex]['isVerified'] = verified;

      setTimeout(() => {
        this.examList[index]['studentList']['data'].paginator = this.paginator.toArray()[index];
        this.examList[index]['studentList']['data'].sort = this.sort.toArray()[index];
      }, 10);
      this.ngxLoader.stop();
    }
    catch (e) {
      this.toastrService.error(e);
      this.ngxLoader.stop();
    }
  }

  ngOnDestroy() {
  }

}

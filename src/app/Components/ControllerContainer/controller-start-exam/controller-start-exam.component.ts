import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CountdownComponent } from 'ngx-countdown';
import { InvigilatorSMPPopupComponent } from 'src/app/Popup/invigilator-smp-popup/invigilator-smp-popup.component';
import { ConfirmationPopupComponent } from 'src/app/Popup/confirmation-popup/confirmation-popup.component';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';

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
    this.FetchExamList();
  }

  ngAfterViewInit() {
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
      // 0 => pause
      // 1 => Resume
      // 2 => Completed
      this.examList = [
        {
          examId: 1, examName: "Certificate In Water Harvesting and Management System Exam for November 2019",
          shuffleCount: '2', verified: true, studentList: [
            {
              studentId: 1, studentStatus: 1, name: "D. Waltor", time: 120, timerConfig: { leftTime: 120 },
              hallTicketNumber: "HALL7654", programme: "Certificate In Water Harvesting and Management",
              batch: "BHCIWHM2017", semesterType: "Semester",
              semester: '1', systemNo: "556", image: "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
              address: "Cross street, Angel Nagar, Dream house, Nagercoil, Kanyakumari District, Pin-629001.",
              questionPattern: "QN001"
            },
            { studentId: 2, studentStatus: 0, name: "Student2", time: 40, timerConfig: { leftTime: 40 }, hallTicketNumber: "HALL765867ghd7627", programme: "Programme2", batch: "batch2", semesterType: "Weekly", semester: '1', systemNo: "SYS200765" },
          ]
        },
        {
          examId: 2, examName: "Exam Name 2", shuffleCount: '5', verified: true, studentList: [
            {
              name: "Student1", studentStatus: 1, time: 120, timerConfig: { leftTime: 120 },
              hallTicketNumber: "HALL765446546", programme: "Programme1", batch: "batch1",
              semesterType: "Semester1", semester: '1', systemNo: "SYS200765"
            },
            { name: "Student2", studentStatus: 1, time: 120, timerConfig: { leftTime: 120 }, hallTicketNumber: "HALL765867ghd7627", programme: "Programme2", batch: "batch2", semesterType: "Weekly", semester: '1', systemNo: "SYS200765" },
            { name: "Student1", studentStatus: 1, time: 120, timerConfig: { leftTime: 120 }, hallTicketNumber: "HALL765446546", programme: "Programme1", batch: "batch1", semesterType: "Semester1", semester: '1', systemNo: "SYS200765" },
            { name: "Student2", studentStatus: 1, time: 120, timerConfig: { leftTime: 120 }, hallTicketNumber: "HALL765867ghd7627", programme: "Programme2", batch: "batch2", semesterType: "Weekly", semester: '1', systemNo: "SYS200765" },
          ]
        },
      ];
      this.examListCopy = this.examList.map(x => Object.assign({}, x));
      this.backupSystems = [
        { value: 'System1', disabled: false },
        { value: 'System2', disabled: false },
        { value: 'System3', disabled: false },
        { value: 'System4', disabled: false },
        { value: 'System5', disabled: false },
      ]
      this.masterTimerConfig = { leftTime: 1 * 60, notify: [2 * 60, 9 * 60] };
      this.TableRefresh();
      setTimeout(() => {
        this.CheckAllStudentTimer();
      }, 10);
      this.ngxLoader.stop();
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
          // this.ngxLoader.start();
          if (!check && status == 1)
            var timeInSec = (this.studentTimer['_results'][length + rowIndex]['i']['value']) / 1000;
          var body = {

          }
          // this.service.TimePauseresume(body).subscribe(response => {
          //   if (response.success) {
          this.StudentTimePauseResumeConfig(index, rowIndex, status, check);
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

  StudentTimePauseResumeConfig(index: number, rowIndex: number, status: number, check?: any): void {
    var length = 0;
    if (index > 0) {
      for (var i = 0; i < index; i++) {
        length = length + this.examList[i]['studentList']['data'].length;
      }
    }
    if (this.studentTimer['_results'][length + rowIndex]['i']['value'] != 0) {
      if (!check)
        this.examList[index]['studentList']['data'][rowIndex]['studentStatus'] = status == 0 ? 1 : 0;
      if (status == 1)
        this.studentTimer['_results'][length + rowIndex].pause();
      else if (status == 0)
        this.studentTimer['_results'][length + rowIndex].resume();
      // if (!type && status == 1){
      //   this.examList[index]['studentList']['data'][rowIndex]['time'] = this.studentTimer['_results'][length + rowIndex]['i']['value'];
      //   console.log((this.studentTimer['_results'][length + rowIndex]['i']['value']) / 1000, this.studentTimer['_results'][length + rowIndex]['i']['text']);
      // }
    }
  }

  CheckAllStudentTimer(): void {
    var pauseIndex = [];
    this.examList.forEach((examList, examIndex) => {
      // examList['studentList']['data'] = 
      // examList['studentList']['data'].map(({systemNo, ...rest}) => 
      // ({systemNo, systems: this.backupSystems.concat(systemNo), ...rest}));//system dropdown setup

      examList['studentList']['data'].forEach((row, rowIndex) => {
        if (row['studentStatus'] == 0)
          pauseIndex.push({ row: rowIndex, parent: examIndex });
      });
    });
    pauseIndex.forEach(element => {
      this.StudentTimePauseResumeConfig(element.parent, element.row, 1, true);
    });
  }

  SystemChange(oldValue: string, value: string, index: number, rowIndex: number, optIndex: number): void {
    this.examList[index]['studentList']['data'][rowIndex]['systemNo'] = value;
    this.backupSystems[optIndex]['value'] = oldValue;

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

  Submit(type: string, examIndex?:number, rowIndex?: number, examId?: number, data?: object): void{
    console.log(type,examIndex,examId, data);
    var body;
    if(type == 'student'){
      body = {
        examDetails: [this.examList[examIndex]['studentList']['data'][rowIndex]].map(({...rest}) => ({examId: examId, ...rest}))
      }
    }
    else if(type == 'exam'){
      body = {
        examDetails: this.examList[examIndex]['studentList']['data'].map(({...rest}) => ({examId: examId, ...rest}))
      }
    }
    else if(type == 'all'){
      var studentList = [];
      this.examList.forEach(element => {
        studentList = studentList.concat(element['studentList']['data'].map(({...rest}) => ({examId: element['examId'], ...rest})));
      });
      body = {
        examDetails: studentList
      }
    }
    
  }

  ngOnDestroy() {
  }

}

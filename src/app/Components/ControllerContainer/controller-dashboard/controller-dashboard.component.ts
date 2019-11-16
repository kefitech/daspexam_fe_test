import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ControllerAuthService } from 'src/app/Services/controller-auth.service';
import { ControllerAPIService } from 'src/app/Services/controller-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/Services/data.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { InvigilatorPageStudentVerificationPopupComponent } from 'src/app/Popup/invigilator-page-student-verification-popup/invigilator-page-student-verification-popup.component';

@Component({
  selector: 'app-controller-dashboard',
  templateUrl: './controller-dashboard.component.html',
  styleUrls: ['./controller-dashboard.component.scss']
})
export class ControllerDashboardComponent implements OnInit, AfterViewInit {

  constructor(private auth: ControllerAuthService, private service: ControllerAPIService,
    private ngxLoader: NgxUiLoaderService, private toastrService: ToastrService,
    private dataService: DataService, private router: Router, private formbuilder: FormBuilder,
    private dialog: MatDialog) {
  }


  examDetails: Array<object>;// stepper 1
  displayedColumns: any = ['sno', 'name', 'hallTicketNumber', 'systemNo', 'action'];// stepper 1
  headerCaption: object = JSON.parse(JSON.stringify({// stepper 1
    caption1: "S/no",
    caption2: "Name",
    caption3: "Hall TicketNo",
    caption4: "System No",
    caption5: "Action"
  }))

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();// stepper 1
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();// stepper 1
  @ViewChildren('myPaginator') studentListPaginator: QueryList<ElementRef>;// stepper 1

  freeSystems: Array<string>;// stepper 1

  // allocatedSystems: Array<boolean> = []// stepper 1


  stepper1Valid: boolean = false;

  questionShuffled: string = "false";

  ngOnInit() {
    window.onpopstate = function (e) { window.history.forward(); }

    this.FetchStudents();// stepper 1
  }

  ngAfterViewInit() {
    this.questionShuffled = localStorage.getItem('questionShuffled');

  }

  FetchStudents(): void {// stepper 1
    try {
      this.ngxLoader.start();
      // this.service.FetchStudents().subscribe(response => {
      //   if (response.success) {
      this.examDetails = [
        {
          examId: 1, examName: "Certificate In Water Harvesting and Management System Exam for November 2019", studentList: [
            { studentId: 1, name: "D. Waltor", hallTicketNumber: "HALL765446546", programme: "Certificate In Water Harvesting and Management", batch: "BHCIWHM2017", semesterType: "Semester", semester: '1', systemNo: "SYS200765", image: "https://homepages.cae.wisc.edu/~ece533/images/airplane.png", address: "Cross street, Angel Nagar, Dream house, Nagercoil, Kanyakumari District, Pin-629001." },
            { studentId: 2, name: "Student2", hallTicketNumber: "HALL765867ghd7627", programme: "Programme2", batch: "batch2", semesterType: "Weekly", semester: '1', systemNo: "SYS200765" },
          ]
        },
        {
          examId: 2, examName: "Exam Name 2", studentList: [
            { name: "Student1", hallTicketNumber: "HALL765446546", programme: "Programme1", batch: "batch1", semesterType: "Semester1", semester: '1', systemNo: "SYS200765" },
            { name: "Student2", hallTicketNumber: "HALL765867ghd7627", programme: "Programme2", batch: "batch2", semesterType: "Weekly", semester: '1', systemNo: "SYS200765" },
            { name: "Student1", hallTicketNumber: "HALL765446546", programme: "Programme1", batch: "batch1", semesterType: "Semester1", semester: '1', systemNo: "SYS200765" },
            { name: "Student2", hallTicketNumber: "HALL765867ghd7627", programme: "Programme2", batch: "batch2", semesterType: "Weekly", semester: '1', systemNo: "SYS200765" },
          ]
        },
      ];
      this.Stepper1FetchStudentTableRefresh();
      this.examDetails = this.examDetails.map(({ ...rest }) => ({ verified: false, ...rest }));
      this.ngxLoader.stop();

      // }
      // else {
      //   this.toastrService.error(response.message);
      this.ngxLoader.stop();
      // }
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

  Stepper1FetchStudentTableRefresh(): void {// stepper 1
    this.examDetails.forEach((element, index) => {
      // var allocatedSeats = element['studentList'].map(({systemNo}) => {return systemNo});
      // this.allocatedSystems = this.allocatedSystems.concat(allocatedSeats);

      element['studentList'] = element['studentList'].map(({ ...rest }) => ({ verified: false, ...rest }));
      element['studentList'] = new MatTableDataSource<any>(element['studentList']);
      setTimeout(() => {
        element['studentList'].paginator = this.paginator.toArray()[index];
        element['studentList'].sort = this.sort.toArray()[index];
      }, 10);
    });
  }

  applyFilter(filterValue: string, index: number) {// stepper 1
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.examDetails[index]['studentList'].filter = filterValue;
  }

  SubmitVerification(): void {// stepper 1
    var validFalse = this.examDetails.some(d => d['verified'] == false);
    if (validFalse)
      this.stepper1Valid = false;
    else
      this.stepper1Valid = true;
  }

  SubmitStepper1(): void {// stepper 1
    try {
      this.ngxLoader.start();
      // this.service.FetchStudents().subscribe(response => {
      //   if (response.success) {
      this.ngxLoader.stop();
      this.questionShuffled = "true";
      localStorage.setItem('questionShuffled', 'true');
      // }
      // else {
      //   this.toastrService.error(response.message);
      this.ngxLoader.stop();
      // }
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

  SingleStudentVerification(data: object, index: number, rowIndex: number): void {// stepper 1
    var rowData = Object.assign({}, data);
    const dialogRef = this.dialog.open(InvigilatorPageStudentVerificationPopupComponent, {
      width: '40%',
      // height: '100%',
      data: { student: rowData }
    })
    dialogRef.afterClosed().subscribe(response => {
      var submit = dialogRef.componentInstance.isSubmit;
      if (submit) {
        this.examDetails[index]['studentList']['data'][rowIndex]['verified'] = dialogRef.componentInstance.data.student['verified'];
        var isAllVerified = this.examDetails[index]['studentList']['data'].every(s => s.verified == true);
        if (isAllVerified)
          this.examDetails[index]['verified'] = true;
        this.SubmitVerification();
        setTimeout(() => {
          this.examDetails[index]['studentList']['data'].paginator = this.paginator.toArray()[index];
          this.examDetails[index]['studentList']['data'].sort = this.sort.toArray()[index];
        }, 10);
        console.log(this.examDetails);

      }
    })
  }

}

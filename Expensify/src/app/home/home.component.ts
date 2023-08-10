import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupExpenseComponent } from '../popup-expense/popup-expense.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { WebserviceService } from '../services/webservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isSidenavOpen: boolean = false;
  @Output() public childEvent = new EventEmitter();
  @Output() list: Array<any> = [];
  insert: any;
  commonExpenses: any[] = [];
  Expenses: any[] = [];
  extra: any[] = [];
  sname: string = '';
  income: number = 0;
  savings: number = 0;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private modalService: NgbModal, // private modalService: NgbModal
    private webservice: WebserviceService
  ) {
    if (this.Expenses != null) {
      this.valBool = true;
    } else {
      this.valBool = false;
    }
  }
  ngOnInit(): void {
    this.webservice.getIncome().subscribe((res: any) => {
      console.log(res);
      this.income = res.monthIncome;
      this.savings = res.savings;
    });
    this.webservice.getDailyExpenses().subscribe((res: any) => {
      this.commonExpenses = res;
      console.log(this.commonExpenses);
      this.Expenses = [];
      for (let i = 0; i < this.commonExpenses.length; i++) {
        this.Expenses.unshift({
          name: this.commonExpenses[i].name,
          amount: this.commonExpenses[i].amount,
        });
      }
      console.log(this.Expenses);
    });
  }

  name = localStorage.getItem('name');

  uIncome?: number;
  uIncome1?: number;
  sMonth?: number;
  sYear?: number;
  closeResult = '';
  valBool?: boolean;
  toggleSidenav() {
    if (this.isSidenavOpen) {
      this.sidenav.close();
    } else {
      this.sidenav.open();
    }
    this.isSidenavOpen = !this.isSidenavOpen;
  }
  back() {
    this.webservice.getDailyExpenses().subscribe((res: any) => {
      this.commonExpenses = res;
      this.Expenses = [];
      for (let i = 0; i < this.commonExpenses.length; i++) {
        this.Expenses.unshift({
          name: this.commonExpenses[i].name,
          amount: this.commonExpenses[i].amount,
        });
      }
    });
  }

  temsubmit(addTemForm: NgForm) {
    const { uIncome1 } = addTemForm.value;
    console.log(uIncome1);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');
    this.http
      .post(
        'http://localhost:3000/api/v1/income/uincome',
        { monthIncome: uIncome1, savings: 0 },
        { headers }
      )
      .subscribe((result: any) => {
        console.log(result);
        this.income = result.monthIncome;
        this.savings = result.savings;
        console.log('successs');
        // this.router.navigate(["/signup"]);
      });
  }

  // crate(value:{name:string,passCode:string}){

  //   var datas=[{
  //   name: value.name,
  //   passCode:value.passCode,
  //   result:"success"
  //  }]
  //   console.log("the data from the function",JSON.stringify(datas));

  //    const headers = new HttpHeaders()
  //          .set('Content-Type', 'application/json');

  //   this.http.post('http://localhost:3000/upload', JSON.stringify(datas[0]), {
  //     headers
  //   })
  //   .subscribe((result:any)=>{
  //     this.insert=result;
  //     console.log(this.list);
  //     this.list.unshift(this.insert);
  //    this.router.navigate(['./component2'])
  //   })

  // }
  // event1(){
  //   this.childEvent.emit(this.list);
  // }
  // openModal(template: any) {
  //   this.modalService.open(template);
  // }
  // closeModal(template: any) {
  //   const mm = document.getElementById(template);
  //   if (mm != null) {
  //     mm.style.display = 'none';
  //   }
  // }
  openModal(content: any) {
    this.modalService.open(content).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openpopup() {
    var _pop = this.dialog.open(PopupExpenseComponent, {
      data: {
        title: 'Add Expense',
      },
    });
    _pop.afterClosed().subscribe((item) => {
      console.log(item);
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
        .set('Content-Type', 'application/json');
      if (item != null) {
        this.http
          .post(
            'http://localhost:3000/api/v1/expense/dexpense',
            { dExpense: item[0] },
            { headers }
          )
          .subscribe((result: any) => {
            console.log(result);
            this.commonExpenses = result.rep;
            this.income = result.inc[0].monthIncome;

            this.Expenses = [];
            for (let i = 0; i < this.commonExpenses.length; i++) {
              this.Expenses.unshift({
                name: this.commonExpenses[i].name,
                amount: this.commonExpenses[i].amount,
              });
            }

            console.log('sucss');
            // this.router.navigate(["/signup"]);
          });
      }
    });
  }

  showExpense(showexpenseform: NgForm) {
    const { sMonth, sYear } = showexpenseform.value;
    const valu = { sMonth, sYear };
    console.log(valu);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');

    this.http
      .post('http://localhost:3000/api/v1/expense/sexpense', valu, { headers })
      .subscribe((result: any) => {
        console.log(result);
        this.commonExpenses = result;
        this.Expenses = [];
        this.Expenses.unshift({
          name: 'Total Expense',
          amount: this.commonExpenses[0],
        });
        for (let i = 0; i < this.commonExpenses.length; i++) {
          this.Expenses.unshift({
            name: this.commonExpenses[i].name,
            amount: this.commonExpenses[i].amount,
          });
        }
        console.log('successs');
        // this.router.navigate(["/signup"]);
      });
  }
}

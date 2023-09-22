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
import { DatePipe } from '@angular/common';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isSidenavOpen: boolean = true;
  @Output() public childEvent = new EventEmitter();
  @Output() list: Array<any> = [];
  insert: any;
  commonExpenses: any[] = [];
  Expenses: any[] = [];
  extra: any[] = [];
  sname: string = '';
  income: number = 0;
  savings: number = 0;
  chart?: Chart;
  amt?: any[];
  totalExpense1: any = 0;
  searchbar: boolean = true;
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
    localStorage.setItem('income', JSON.stringify(this.income));
    localStorage.setItem('savings', JSON.stringify(this.savings));

    this.webservice.getIncome().subscribe((res: any) => {
      console.log(res);
      this.income = res.monthIncome;
      this.savings = res.savings;
      if (this.income == null) {
        this.income = 0;
      }
      if (this.savings == null) {
        this.savings = 0;
      }
    });

    this.totalExpense1 = 0;
    this.webservice.getDailyExpenses().subscribe((res: any) => {
      this.commonExpenses = res[0];
      this.totalExpense1 = res[1];
      console.log(this.commonExpenses);
      this.Expenses = [];
      for (let i = 0; i < this.commonExpenses.length; i++) {
        const parts = this.commonExpenses[i].createdAt.split('T');
        const utcTimeString = parts[1];
        const utcTimeParts = utcTimeString.split(/[T:.+]/).map(parseFloat);

        const utcDate = new Date();
        utcDate.setUTCHours(utcTimeParts[0]);
        utcDate.setUTCMinutes(utcTimeParts[1]);
        utcDate.setUTCSeconds(utcTimeParts[2]);
        utcDate.setUTCMilliseconds(utcTimeParts[3]);

        const istOptions: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        };

        const istTimeString = utcDate.toLocaleString('en-IN', istOptions);
        this.Expenses.unshift({
          id: this.commonExpenses[i]._id,
          name: this.commonExpenses[i].name,
          amount: this.commonExpenses[i].amount,
          Date: parts[0],
          time: istTimeString,
        });
      }
      const groupedData = this.Expenses.reduce((acc, entry) => {
        const date = entry.Date;
        acc[date] = (acc[date] || 0) + entry.amount;
        return acc;
      }, {});
      console.log(this.Expenses);
      console.log('groupyyyy', groupedData);
      const dates = Object.keys(groupedData);
      const amounts = Object.values(groupedData);
      console.log(dates, amounts);
      this.amt = amounts;
      this.chart = new Chart('canvas', {
        type: 'bar',

        data: {
          labels: dates,
          datasets: [
            {
              label: 'Total Amount',
              data: this.amt,
              borderColor: '1b1b1b',
              backgroundColor: '#4b4b4b',
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MMM dd',
                },
              },
              title: {
                display: true,
                text: 'Date',
                color: '1b1b1b',
              },
              ticks: {
                color: '1b1b1b', // Change this to your desired text color
              },
            },
            y: {
              title: {
                display: true,
                text: 'Amount',
                color: '1b1b1b',
              },
              ticks: {
                color: '1b1b1b', // Change this to your desired text color
              },
            },
          },
        },
      });
    });
  }

  name = localStorage.getItem('name');
  isDropdownActive = false;

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

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
    if (this.chart) {
      this.chart.destroy();
    }
    this.webservice.getDailyExpenses().subscribe((res: any) => {
      this.commonExpenses = res[0];
      this.totalExpense1 = res[1];

      this.Expenses = [];
      for (let i = 0; i < this.commonExpenses.length; i++) {
        const parts = this.commonExpenses[i].createdAt.split('T');
        const utcTimeString = parts[1];
        const utcTimeParts = utcTimeString.split(/[T:.+]/).map(parseFloat);

        const utcDate = new Date();
        utcDate.setUTCHours(utcTimeParts[0]);
        utcDate.setUTCMinutes(utcTimeParts[1]);
        utcDate.setUTCSeconds(utcTimeParts[2]);
        utcDate.setUTCMilliseconds(utcTimeParts[3]);

        const istOptions: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        };

        const istTimeString = utcDate.toLocaleString('en-IN', istOptions);
        this.Expenses.unshift({
          id: this.commonExpenses[i]._id,
          name: this.commonExpenses[i].name,
          amount: this.commonExpenses[i].amount,
          Date: parts[0],
          time: istTimeString,
        });
      }
      const groupedData = this.Expenses.reduce((acc, entry) => {
        const date = entry.Date;
        acc[date] = (acc[date] || 0) + entry.amount;
        return acc;
      }, {});
      console.log(this.Expenses);
      console.log('groupyyyy', groupedData);
      const dates = Object.keys(groupedData);
      const amounts = Object.values(groupedData);
      console.log(dates, amounts);
      this.amt = amounts;
      this.chart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Total Amount',
              data: this.amt,
              borderColor: '1b1b1b',
              backgroundColor: '#4b4b4b',
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MMM dd',
                },
              },
              title: {
                display: true,
                text: 'Date',
                color: '1b1b1b',
              },
              ticks: {
                color: '1b1b1b', // Change this to your desired text color
              },
            },
            y: {
              title: {
                display: true,
                text: 'Amount',
                color: '1b1b1b',
              },
              ticks: {
                color: '1b1b1b', // Change this to your desired text color
              },
            },
          },
        },
      });
    });
  }
  delete(val: string, amount: Number) {
    console.log(val, 'id for daily expense');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');

    this.http
      .post(
        'http://localhost:3000/api/v1/expense/deleteexpense',
        { delete: val, amtt: amount },
        { headers }
      )
      .subscribe((result: any) => {
        console.log(result);
        this.commonExpenses = result[0];
        this.totalExpense1 = result[1];
        this.income = result[2];
        this.Expenses = [];

        for (let i = 0; i < this.commonExpenses.length; i++) {
          const parts = this.commonExpenses[i].createdAt.split('T');
          const utcTimeString = parts[1];
          const utcTimeParts = utcTimeString.split(/[T:.+]/).map(parseFloat);

          const utcDate = new Date();
          utcDate.setUTCHours(utcTimeParts[0]);
          utcDate.setUTCMinutes(utcTimeParts[1]);
          utcDate.setUTCSeconds(utcTimeParts[2]);
          utcDate.setUTCMilliseconds(utcTimeParts[3]);

          const istOptions: Intl.DateTimeFormatOptions = {
            timeZone: 'Asia/Kolkata',
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          };

          const istTimeString = utcDate.toLocaleString('en-IN', istOptions);
          this.Expenses.unshift({
            id: this.commonExpenses[i]._id,
            name: this.commonExpenses[i].name,
            amount: this.commonExpenses[i].amount,
            Date: parts[0],
            time: istTimeString,
          });
        }
        // this.Expenses.unshift({
        //   name: 'Total Expense',
        //   amount: this.commonExpenses[0],
        // });
        console.log('successs');
        const groupedData = this.Expenses.reduce((acc, entry) => {
          const date = entry.Date;
          acc[date] = (acc[date] || 0) + entry.amount;
          return acc;
        }, {});
        console.log(this.Expenses);
        console.log('groupyyyy', groupedData);
        const dates = Object.keys(groupedData);
        const amounts = Object.values(groupedData);
        console.log(dates, amounts);
        this.amt = amounts;
        if (this.chart) {
          this.chart.destroy();
        }
        this.chart = new Chart('canvas', {
          type: 'bar',
          data: {
            labels: dates,
            datasets: [
              {
                label: 'Total Amount',
                data: this.amt,
                borderColor: '1b1b1b',
                backgroundColor: '#4b4b4b',
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day',
                  displayFormats: {
                    day: 'MMM dd',
                  },
                },
                title: {
                  display: true,
                  text: 'Date',
                  color: '1b1b1b',
                },
                ticks: {
                  color: '1b1b1b', // Change this to your desired text color
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Amount',
                  color: '1b1b1b',
                },
                ticks: {
                  color: '1b1b1b', // Change this to your desired text color
                },
              },
            },
          },
        });

        // this.router.navigate(["/signup"]);
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

  logout() {
    localStorage.removeItem('token');
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
            this.totalExpense1 = result.totalExpense;
            this.commonExpenses = result.rep;
            this.income = result.inc[0].monthIncome;
            this.savings = result.inc[0].savings;

            this.Expenses = [];
            for (let i = 0; i < this.commonExpenses.length; i++) {
              const parts = this.commonExpenses[i].createdAt.split('T');
              const utcTimeString = parts[1];
              const utcTimeParts = utcTimeString
                .split(/[T:.+]/)
                .map(parseFloat);

              const utcDate = new Date();
              utcDate.setUTCHours(utcTimeParts[0]);
              utcDate.setUTCMinutes(utcTimeParts[1]);
              utcDate.setUTCSeconds(utcTimeParts[2]);
              utcDate.setUTCMilliseconds(utcTimeParts[3]);

              const istOptions: Intl.DateTimeFormatOptions = {
                timeZone: 'Asia/Kolkata',
                hour12: true,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              };

              const istTimeString = utcDate.toLocaleString('en-IN', istOptions);
              this.Expenses.unshift({
                id: this.commonExpenses[i]._id,
                name: this.commonExpenses[i].name,
                amount: this.commonExpenses[i].amount,
                Date: parts[0],
                time: istTimeString,
              });
            }
            const groupedData = this.Expenses.reduce((acc, entry) => {
              const date = entry.Date;
              acc[date] = (acc[date] || 0) + entry.amount;
              return acc;
            }, {});
            console.log(this.Expenses);
            console.log('groupyyyy', groupedData);
            const dates = Object.keys(groupedData);
            const amounts = Object.values(groupedData);
            console.log(dates, amounts);
            this.amt = amounts;
            if (this.chart) {
              this.chart.destroy();
            }
            this.chart = new Chart('canvas', {
              type: 'bar',
              data: {
                labels: dates,
                datasets: [
                  {
                    label: 'Total Amount',
                    data: this.amt,
                    borderColor: '1b1b1b',
                    backgroundColor: '#4b4b4b',
                  },
                ],
              },
              options: {
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      unit: 'day',
                      displayFormats: {
                        day: 'MMM dd',
                      },
                    },
                    title: {
                      display: true,
                      text: 'Date',
                      color: '1b1b1b',
                    },
                    ticks: {
                      color: '1b1b1b', // Change this to your desired text color
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Amount',
                      color: '1b1b1b',
                    },
                    ticks: {
                      color: '1b1b1b', // Change this to your desired text color
                    },
                  },
                },
              },
            });

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
        this.commonExpenses = result[0];
        this.totalExpense1 = result[1];
        this.Expenses = [];

        for (let i = 0; i < this.commonExpenses.length; i++) {
          const parts = this.commonExpenses[i].createdAt.split('T');
          const utcTimeString = parts[1];
          const utcTimeParts = utcTimeString.split(/[T:.+]/).map(parseFloat);

          const utcDate = new Date();
          utcDate.setUTCHours(utcTimeParts[0]);
          utcDate.setUTCMinutes(utcTimeParts[1]);
          utcDate.setUTCSeconds(utcTimeParts[2]);
          utcDate.setUTCMilliseconds(utcTimeParts[3]);

          const istOptions: Intl.DateTimeFormatOptions = {
            timeZone: 'Asia/Kolkata',
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          };

          const istTimeString = utcDate.toLocaleString('en-IN', istOptions);
          this.Expenses.unshift({
            id: this.commonExpenses[i]._id,
            name: this.commonExpenses[i].name,
            amount: this.commonExpenses[i].amount,
            Date: parts[0],
            time: istTimeString,
          });
        }
        // this.Expenses.unshift({
        //   name: 'Total Expense',
        //   amount: this.commonExpenses[0],
        // });
        console.log('successs');
        const groupedData = this.Expenses.reduce((acc, entry) => {
          const date = entry.Date;
          acc[date] = (acc[date] || 0) + entry.amount;
          return acc;
        }, {});
        console.log(this.Expenses);
        console.log('groupyyyy', groupedData);
        const dates = Object.keys(groupedData);
        const amounts = Object.values(groupedData);
        console.log(dates, amounts);
        this.amt = amounts;
        if (this.chart) {
          this.chart.destroy();
        }
        this.chart = new Chart('canvas', {
          type: 'bar',
          data: {
            labels: dates,
            datasets: [
              {
                label: 'Total Amount',
                data: this.amt,
                borderColor: '1b1b1b',
                backgroundColor: '#4b4b4b',
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day',
                  displayFormats: {
                    day: 'MMM dd',
                  },
                },
                title: {
                  display: true,
                  text: 'Date',
                  color: '1b1b1b',
                },
                ticks: {
                  color: '1b1b1b', // Change this to your desired text color
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Amount',
                  color: '1b1b1b',
                },
                ticks: {
                  color: '1b1b1b', // Change this to your desired text color
                },
              },
            },
          },
        });

        // this.router.navigate(["/signup"]);
      });
  }
}

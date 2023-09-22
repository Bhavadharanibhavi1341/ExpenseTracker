import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupExpenseComponent } from '../popup-expense/popup-expense.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { WebserviceService } from '../services/webservice.service';
import { SplitpopComponent } from '../splitpop/splitpop.component';
import { MatSidenav } from '@angular/material/sidenav';
import { Component2Component } from '../component2/component2.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-split-pay',
  templateUrl: './split-pay.component.html',
  styleUrls: ['./split-pay.component.css'],
})
export class SplitPayComponent implements OnInit {
  @ViewChildren('chart') chartElements!: QueryList<ElementRef>;
  @ViewChild('errorModal3') errorModal3: TemplateRef<any> | undefined;
  repayAmt: any;
  pendingStatus: any[] = [];
  overAll: any[] = [];
  groupName: any[] = [];
  details: any[] = [];
  amt?: any;
  total?: any = 0;
  id: string = '';
  needy: string = '';
  closeResult = '';
  name = localStorage.getItem('name');
  userToPay?: any;
  userToGet?: any;
  splitname: any;
  splitId: any;
  message = '';
  selectedItemIndex: number = -1;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isSidenavOpen: boolean = true;
  uIncome1: any;
  isDropdownActive = false;

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private webservice: WebserviceService
  ) {}
  ngOnInit(): void {
    this.userToGet = 0;
    this.userToPay = 0;
    this.webservice.getGroup().subscribe((res: any) => {
      this.overAll = res;
      console.log('heyyy', this.overAll);
      for (let i = 0; i < this.overAll.length; i++) {
        this.groupName.unshift(this.overAll[i].splitPayName);
      }

      for (let i = 0; i < this.overAll.length; i++) {
        const len = this.overAll[i].details.length;
        for (let j = 0; j < len; j++) {
          if (this.overAll[i].details[j].UserName == this.name) {
            this.userToGet = this.userToGet + this.overAll[i].details[j].toGet;
            this.userToPay = this.userToPay + this.overAll[i].details[j].toPay;
          }
        }
      }

      console.log('hehello', this.userToGet, this.userToPay);
    });
  }

  change(val: string) {
    console.log(val);
    this.needy = val;
    console.log(this.needy);
  }
  hasUserToPay(groupName: string): boolean {
    const group = this.overAll.find((x) => x.splitPayName === groupName);

    if (group && this.name !== null && this.name !== undefined) {
      return group.details.some((user: any) => {
        if (user.UserName === this.name && user.toPay > 0) {
          return true;
        }
        return false;
      });
    }
    return false;
  }
  hasUserToGet(groupName: string): boolean {
    const group = this.overAll.find((x) => x.splitPayName === groupName);

    if (group && this.name !== null && this.name !== undefined) {
      return group.details.some((user: any) => {
        if (user.UserName === this.name && user.toGet > 0) {
          return true;
        }
        return false;
      });
    }
    return false;
  }
  hasUserToNot(groupName: string): boolean {
    const group = this.overAll.find((x) => x.splitPayName === groupName);

    if (group && this.name !== null && this.name !== undefined) {
      return group.details.some((user: any) => {
        if (
          user.UserName === this.name &&
          user.toGet === 0 &&
          user.toPay === 0
        ) {
          return true;
        }
        return false;
      });
    }
    return false;
  }

  selectItem(index: number) {
    this.selectedItemIndex = index;
  }
  show(val: string) {
    this.splitname = val;
    this.details = [];
    this.id = this.overAll.find((x) => x.splitPayName === val)._id;
    console.log('idididid', this.id);
    this.details = this.overAll.find((x) => x.splitPayName === val).details;
  }

  logout() {
    localStorage.removeItem('token');
  }

  temsubmit(addTemForm: NgForm) {
    const storedIncome = localStorage.getItem('income');
    const storedsavings = localStorage.getItem('savings');
    console.log(storedIncome, 'deredr');

    if (storedIncome != null && storedsavings != null) {
      let parsedIncome = JSON.parse(storedIncome);
      let parsedsavings = JSON.parse(storedsavings);
      if (parsedIncome > 0 || parsedsavings > 0) {
        console.log(parsedIncome, 'deredr');
      }
    }

    console.log(this.amt);
    console.log(this.details);
    const name = this.splitname;
    const amount = this.amt;
    const item = { name, amount };
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');

    this.http
      .post(
        'http://localhost:3000/api/v1/expense/dexpense',
        { dExpense: item },
        { headers }
      )
      .subscribe((result: any) => {
        console.log(result);
        console.log('sucss');
        // this.router.navigate(["/signup"]);
      });
    this.total = 0;
    let topay = this.amt / this.details.length;
    const toget = this.amt - topay;
    this.pendingStatus = [];
    topay = Number(topay.toFixed(2));
    this.userToGet += toget;
    for (let i = 0; i < this.details.length; i++) {
      if (this.details[i].UserName === this.needy) {
        this.details[i].paid = this.details[i].paid + this.amt;
        if (this.details[i].toPay > 0) {
          if (this.details[i].toPay > toget) {
            this.details[i].toPay = this.details[i].toPay - toget;
          } else {
            this.details[i].toGet = toget - this.details[i].toPay;
            this.details[i].toPay = 0;
          }
        } else {
          this.details[i].toGet = this.details[i].toGet + toget;
        }
      } else {
        this.pendingStatus.unshift({
          name: this.details[i].UserName,
          Share: topay,
          paidUser: this.needy,
          paidAmount: this.amt,
          Status: 'pending',
        });
      }
    }
    const sending = {
      idtrip: this.id,
      tripName: this.splitname,
      details: this.pendingStatus,
    };
    console.log('valuee123', this.pendingStatus);
    const toSend = { details: this.details, id: this.id };
    this.http
      .post(
        'http://localhost:3000/api/v1/split/status',
        { updateGroup: sending },
        { headers }
      )
      .subscribe((result: any) => {
        console.log(result);
      });

    this.http
      .post(
        'http://localhost:3000/api/v1/split/upgroup',
        { updateGroup: toSend },
        { headers }
      )
      .subscribe((result: any) => {
        console.log(result);
        console.log('successsssssss');
        console.log(result);
      });
  }
  openModal3() {
    this.modalService.open(this.errorModal3).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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
    console.log(this.closeResult);
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
  repay(repayform: NgForm) {
    let cond = this.details.filter((user) => user.UserName === this.name);
    if (cond[0].toPay >= this.repayAmt) {
      const numUsersToGet = this.details.filter(
        (user) => user.toGet > 0
      ).length;
      console.log('ok repay', numUsersToGet, this.repayAmt);

      let amountToDistribute = this.repayAmt / numUsersToGet;
      let remainingamt = 0;

      for (let i = 0; i < this.details.length; i++) {
        if (this.details[i].toGet > 0) {
          if (this.details[i].toGet >= amountToDistribute) {
            this.details[i].paid -= amountToDistribute;
            this.details[i].toGet -= amountToDistribute;
          } else {
            this.details[i].paid -= this.details[i].toGet;
            remainingamt += amountToDistribute - this.details[i].toGet;
            this.details[i].toGet = 0;
          }
        }
        if (this.details[i].UserName === this.name) {
          this.details[i].toPay -= this.repayAmt;
          this.details[i].paid += this.repayAmt;
        }
      }
      if (remainingamt > 0) {
        console.log(repayCall(remainingamt, this.details), 'recursiveeeeee');
      }
      function repayCall(amount: any, details: any[]): any[] {
        const numUsersToGet = details.filter((user) => user.toGet > 0).length;
        let amountToDistribute = amount / numUsersToGet;
        let remainingamt = 0;
        for (let i = 0; i < details.length; i++) {
          if (details[i].toGet > 0) {
            if (details[i].toGet >= amountToDistribute) {
              details[i].toGet -= amountToDistribute;
            } else {
              remainingamt += amountToDistribute - details[i].toGet;
              details[i].toGet = 0;
            }
          }
        }
        if (remainingamt > 0) {
          repayCall(remainingamt, details);
        }
        return details;
      }
      for (let i = 0; i < this.details.length; i++) {
        this.details[i].toGet = Number(this.details[i].toGet.toFixed(2));
        this.details[i].toPay = Number(this.details[i].toPay.toFixed(2));
      }

      const name = this.splitname;
      const amount = this.repayAmt;
      const item = { name, amount };
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
        .set('Content-Type', 'application/json');

      this.http
        .post(
          'http://localhost:3000/api/v1/expense/dexpense',
          { dExpense: item },
          { headers }
        )
        .subscribe((result: any) => {
          console.log(result);
          console.log('sucss');
          // this.router.navigate(["/signup"]);
        });

      const toSend = { details: this.details, id: this.id };

      this.http
        .post(
          'http://localhost:3000/api/v1/split/upgroup',
          { updateGroup: toSend },
          { headers }
        )
        .subscribe((result: any) => {
          console.log(result);
          console.log('successsssssss');
          console.log(result);
        });
      console.log(this.details);
    } else {
      this.message = 'you are trying to pay more than required';
      this.openModal3();
      console.log('paying a lot');
    }
  }

  toggleSidenav() {
    if (this.isSidenavOpen) {
      this.sidenav.close();
    } else {
      this.sidenav.open();
    }
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  temsubmit1(addTemForm: NgForm) {
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
        console.log('successs');
        // this.router.navigate(["/signup"]);
      });
  }

  addGroup() {
    var _pop = this.dialog.open(SplitpopComponent, {
      data: {
        title: 'Create New Group',
      },
    });
    _pop.afterClosed().subscribe((item) => {
      console.log(item);
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
        .set('Content-Type', 'application/json');
      if (item != null) {
        console.log(item);
        this.http
          .post(
            'http://localhost:3000/api/v1/split/addgroup',
            { addGroup: item },
            { headers }
          )
          .subscribe((result: any) => {
            console.log(result);
            console.log('successs2345');
            this.overAll = [];
            this.groupName = [];

            this.overAll = result;
            for (let i = 0; i < this.overAll.length; i++) {
              this.groupName.unshift(this.overAll[i].splitPayName);
            }
            for (let i = 0; i < this.overAll.length; i++) {
              const len = this.overAll[i].details.length;
              for (let j = 0; j < len; j++) {
                if (this.overAll[i].details[j].UserName == this.name) {
                  this.userToGet =
                    this.userToGet + this.overAll[i].details[j].toGet;
                  this.userToPay =
                    this.userToPay + this.overAll[i].details[j].toPay;
                }
              }
            }
            // this.router.navigate(["/signup"]);
          });
      }
    });
  }
  requests() {
    var _pop = this.dialog.open(Component2Component, {
      data: {
        title: 'Pay requests',
      },
    });
    _pop.afterClosed().subscribe((item) => {
      console.log(item);
      this.splitname = item;
      this.details = [];

      this.overAll = [];
      this.groupName = [];
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders()
        .set('Authorization', 'Bearer ' + token)
        .set('Content-Type', 'application/json');
      this.http
        .get<any>('http://localhost:3000/api/v1/split/addgroup', {
          headers,
        })
        .subscribe((result: any) => {
          this.overAll = result;
          console.log('heyyy');
          for (let i = 0; i < this.overAll.length; i++) {
            this.groupName.unshift(this.overAll[i].splitPayName);
          }
          console.log(result);
          console.log('successsssssss');
          console.log(result);
        });
    });
  }
}

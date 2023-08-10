import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupExpenseComponent } from '../popup-expense/popup-expense.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { WebserviceService } from '../services/webservice.service';
import { SplitpopComponent } from '../splitpop/splitpop.component';

@Component({
  selector: 'app-split-pay',
  templateUrl: './split-pay.component.html',
  styleUrls: ['./split-pay.component.css'],
})
export class SplitPayComponent implements OnInit {
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

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private modalService: NgbModal, // private modalService: NgbModal
    private webservice: WebserviceService
  ) {}
  ngOnInit(): void {
    this.userToGet = 0;
    this.userToPay = 0;
    this.webservice.getGroup().subscribe((res: any) => {
      this.overAll = res;
      console.log('heyyy');
      for (let i = 0; i < this.overAll.length; i++) {
        this.groupName.unshift(this.overAll[i].splitPayName);
      }
      const len = this.overAll[0].details.length;
      for (let i = 0; i < this.overAll.length; i++) {
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
  show(val: string) {
    this.splitname = val;
    this.details = [];
    this.id = this.overAll.find((x) => x.splitPayName === val)._id;
    console.log(this.id);
    this.details = this.overAll.find((x) => x.splitPayName === val).details;
  }
  temsubmit(addTemForm: NgForm) {
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
    const topay = this.amt / this.details.length;
    const toget = this.amt - topay;
    for (let i = 0; i < this.details.length; i++) {
      this.total += this.details[i].paid;
    }
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
        if (this.details[i].toGet > 0) {
          if (this.details[i].toGet > topay) {
            this.details[i].toGet = this.details[i].toGet - topay;
          } else {
            this.details[i].toPay = topay - this.details[i].toPay;
            this.details[i].toGet = 0;
          }
        } else {
          this.details[i].toPay = this.details[i].toPay + topay;
        }
      }
    }
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
        // this.overAll = [];
        // this.groupName = [];

        // this.overAll = result;
        // for (let i = 0; i < this.overAll.length; i++) {
        //   this.groupName.unshift(this.overAll[i].splitPayName);
        // }
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
            console.log('successs');
            this.overAll = [];
            this.groupName = [];

            this.overAll = result;
            for (let i = 0; i < this.overAll.length; i++) {
              this.groupName.unshift(this.overAll[i].splitPayName);
            }
            // this.router.navigate(["/signup"]);
          });
      }
    });
  }
}

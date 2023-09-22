import { Component, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebserviceService } from '../services/webservice.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-component2',
  templateUrl: './component2.component.html',
  styleUrls: ['./component2.component.css'],
})
export class Component2Component implements OnInit {
  // @Input() public parentData:Array<any> = []

  approvalStatus: { [key: string]: boolean } = {};
  detail: any[] = [];
  expense: string = '';
  Income: number = 0;
  commonExpenses: any[] = [];
  newAll: any[] = [];
  sendingArray: any[] = [];
  status: any[] = [];
  overAll: any[] = [];
  inputdata: any = '';
  name = localStorage.getItem('name');
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private renderer: Renderer2,
    private webservice: WebserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<Component2Component>
  ) {}
  ngOnInit(): void {
    this.inputdata = this.data;

    this.webservice.getStatus().subscribe((res: any) => {
      this.newAll = res;
      console.log('consolinggg', this.newAll);
      for (let i = 0; i < res.length; i++) {
        const len = res[i].details.length;
        for (let j = 0; j < len; j++) {
          if (res[i].details[j].name == this.name) {
            this.commonExpenses.unshift({
              id: res[i]._id,
              tripid: res[i].idtrip,
              tripName: res[i].tripName,
              details: res[i].details[j],
            });
          }
        }
      }
      console.log(this.commonExpenses, 'seehereee');
    });
    this.webservice.getGroup().subscribe((res: any) => {
      this.overAll = res;
      console.log('heyyy', this.overAll);
    });
  }
  close1(): void {
    this.ref.close();
  }
  change(val: any) {
    this.detail = [];
    this.detail = this.overAll.find((x) => x._id === val).details;
  }

  approvePayment(val: any, topay: any, id1: any) {
    this.approvalStatus[id1] = true;
    console.log(val, topay);
    console.log(id1, 'loooooook');
    for (let i = 0; i < this.newAll.length; i++) {
      if (this.newAll[i]._id === id1) {
        console.log('one comingg');
        const l = this.newAll[i].details.length;
        for (let j = 0; j < l; j++) {
          if (this.newAll[i].details[j].name === this.name) {
            this.newAll[i].details[j].Status = 'approved';
            this.sendingArray.unshift(this.newAll[i]);
          }
        }
      }
    }

    const sent = { id: id1, array: this.sendingArray };
    console.log('sentgagfetvalue', sent);
    console.log(this.detail);
    for (let i = 0; i < this.detail.length; i++) {
      if (this.detail[i].UserName === this.name) {
        if (this.detail[i].toPay > 0) {
          this.detail[i].toPay += topay;
        } else {
          if (this.detail[i].toGet > topay) {
            this.detail[i].toGet -= topay;
          } else {
            this.detail[i].toPay = topay - this.detail[i].toGet;
            this.detail[i].toGet = 0;
          }
        }
      }
    }
    console.log(this.detail);
    const toSend = { details: this.detail, id: val };

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');

    this.http
      .post(
        'http://localhost:3000/api/v1/split/upstatus',
        { updatestatus: sent },
        { headers }
      )
      .subscribe((result: any) => {
        console.log(result);
        console.log('successsssssss');
        console.log(result);
      });
    this.sendingArray = [];
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
}

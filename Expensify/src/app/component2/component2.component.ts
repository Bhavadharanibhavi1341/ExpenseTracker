import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebserviceService } from '../services/webservice.service';

@Component({
  selector: 'app-component2',
  templateUrl: './component2.component.html',
  styleUrls: ['./component2.component.css'],
})
export class Component2Component implements OnInit {
  // @Input() public parentData:Array<any> = []
  list: Array<string> = [];
  expense: string = '';
  Income: number = 0;
  commonExpenses: String[] = [];
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private renderer: Renderer2,
    private webservice: WebserviceService
  ) {}
  // this gets triggered when component is created or being called
  ngOnInit(): void {
    this.webservice.getCommonExpenses().subscribe((res: any) => {
      this.commonExpenses = res;
    });
  }

  expenses(val: string) {
    this.commonExpenses.push(this.expense);
    this.list.unshift(this.expense);
    console.log(this.list);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');
    this.http
      .post(
        'http://localhost:3000/api/v1/expense/commonExpense',
        { commonExpense: [this.expense] },
        { headers }
      )
      .subscribe((result: any) => {
        console.log(result);
        console.log('successs');
        // this.router.navigate(['/home']);
      });
  }
  add() {
    console.log('hellloooo');
  }
  deleteItem() {
    console.log(this.commonExpenses);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');
    this.http
      .post(
        'http://localhost:3000/api/v1/expense/deleteExpense',
        { commonExpense: this.commonExpenses },
        { headers }
      )
      .subscribe((result: any) => {
        console.log(result);
        console.log('successs');
        // this.router.navigate(['/home']);
      });
  }

  call(incomeform: NgForm) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');
    this.http
      .post(
        'http://localhost:3000/api/v1/income/monthIncome',
        { monthIncome: this.Income },
        { headers }
      )
      .subscribe((result: any) => {
        console.log(result);
        console.log('successs');
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { WebserviceService } from '../services/webservice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  date: string = '2023-02';
  income?: number = 0;
  ngOnInit(): void {
    this.webservice.getIncome().subscribe((res: any) => {
      console.log(res);
      this.income = res.monthIncome;
      console.log('jejeiiurn', res);
    });
  }
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private webservice: WebserviceService
  ) {}
  show(showexpenseform: NgForm) {
    console.log(this.date);
    var date = this.date;
    const digits = date.split('-');
    var realDigits = digits.map(Number);
    console.log(realDigits[0], realDigits[1]);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');
    const valu = { sMonth: realDigits[1], sYear: realDigits[0] };

    this.http
      .post('http://localhost:3000/api/v1/expense/sexpense', valu, { headers })
      .subscribe((result: any) => {
        console.log(result);
        console.log('successs');
        // this.router.navigate(["/signup"]);
      });
  }
}

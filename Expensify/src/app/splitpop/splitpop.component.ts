import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { WebserviceService } from '../services/webservice.service';

@Component({
  selector: 'app-splitpop',
  templateUrl: './splitpop.component.html',
  styleUrls: ['./splitpop.component.css'],
})
export class SplitpopComponent implements OnInit {
  inputdata: any;
  searchValue: string = '';
  splitPayName?: string;
  details: any[] = [];
  list: any[] = [];
  userList: any[] = [];
  name = localStorage.getItem('name');

  ngOnInit(): void {
    this.inputdata = this.data;
    this.webservice.getUsers().subscribe((res: any) => {
      this.list = res;
      for (let i = 0; i < this.list.length; i++) {
        this.userList.unshift({ UserName: this.list[i].userName });
      }
    });
  }
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<SplitpopComponent>,
    private webservice: WebserviceService
  ) {}
  Add(expenseform: NgForm) {
    console.log('split payyyyy');
    console.log(this.userList);
    this.details.unshift({
      UserName: this.name,
      paid: 0,
      toPay: 0,
      toGet: 0,
    });

    const splitPayName = this.splitPayName;
    const details = this.details;

    this.ref.close({ splitPayName, details });
  }
  close1(): void {
    this.ref.close();
  }
  add1(k: string) {
    this.details.unshift({
      UserName: k,
      paid: 0,
      toPay: 0,
      toGet: 0,
    });
    console.log(this.details);
  }
  delete() {
    console.log(this.details);
  }
}

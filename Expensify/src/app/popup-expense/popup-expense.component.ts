import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-popup-expense',
  templateUrl: './popup-expense.component.html',
  styleUrls: ['./popup-expense.component.css'],
})
export class PopupExpenseComponent implements OnInit {
  inputdata: any;
  name: string = '';
  amount?: number;
  list: Array<{ name: string; amount: number }> = [];

  Add(expenseform: NgForm) {
    const name: string = this.name;
    const { amount } = expenseform.value;
    this.list.unshift({ name, amount });
    console.log(this.list);
    this.ref.close(this.list);
  }
  close1(): void {
    this.ref.close();
  }

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<PopupExpenseComponent>
  ) {}
  ngOnInit(): void {
    this.inputdata = this.data;
  }
}

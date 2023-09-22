import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { WebserviceService } from '../services/webservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import Chart from 'chart.js/auto';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  closeResult = '';
  chart?: Chart;
  date: string = '2023-02';
  commonExpenses: any[] = [];
  names: any[] = [];
  amts: any[] = [];
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isSidenavOpen: boolean = true;
  uIncome1: any;

  income?: number = 0;
  ngOnInit(): void {
    this.webservice.getSavings().subscribe((res: any) => {
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        this.commonExpenses.unshift({
          month: res[i].month,
          savings: res[i].savings,
          year: res[i].year,
        });
      }
      const ctx = document.getElementById('myLineChart') as HTMLCanvasElement;
      this.commonExpenses.sort((a, b) => a.month - b.month);
      console.log(this.commonExpenses);
      const months = this.commonExpenses.map(
        (entry) => `${entry.month}/${entry.year}`
      );
      const savings = this.commonExpenses.map((entry) => entry.savings);
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Savings',
              data: savings,
              borderColor: '#4b4b4b',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Month/Year',
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Savings',
              },
            },
          },
        },
      });
    });
  }

  toggleSidenav() {
    if (this.isSidenavOpen) {
      this.sidenav.close();
    } else {
      this.sidenav.open();
    }
    this.isSidenavOpen = !this.isSidenavOpen;
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
        console.log('successs');
        // this.router.navigate(["/signup"]);
      });
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

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private webservice: WebserviceService,
    private modalService: NgbModal
  ) {}
}

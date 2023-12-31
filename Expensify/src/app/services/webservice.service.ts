import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class WebserviceService {
  constructor(private http: HttpClient) {}
  getUsers() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');
    return this.http.get<any>('http://localhost:3000/api/v1/auth/login', {
      headers,
    });
  }
  getGroup() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');
    return this.http.get<any>('http://localhost:3000/api/v1/split/addgroup', {
      headers,
    });
  }

  getCommonExpenses() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');
    return this.http.get<any>(
      'http://localhost:3000/api/v1/expense/commonExpense',
      { headers }
    );
  }
  getIncome() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');
    return this.http.get<any>(
      'http://localhost:3000/api/v1/income/monthincome',
      {
        headers,
      }
    );
  }
  getDailyExpenses() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');
    return this.http.get<any>('http://localhost:3000/api/v1/expense/dexpense', {
      headers,
    });
  }
  getSavings() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');
    return this.http.get<any>(
      'http://localhost:3000/api/v1/income/getsavings',
      {
        headers,
      }
    );
  }
  checkUsername(userName: string): Observable<{ exists: boolean }> {
    // Make an API call to check username availability on your backend
    return this.http.get<{ exists: boolean }>(
      `http://localhost:3000/api/v1/auth/getname/${userName}`
    );
  }
  checkUseremail(email: string): Observable<{ exists: boolean }> {
    // Make an API call to check username availability on your backend
    return this.http.get<{ exists: boolean }>(
      `http://localhost:3000/api/v1/auth/getemail/${email}`
    );
  }

  getStatus() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json');
    return this.http.get<any>('http://localhost:3000/api/v1/split/status', {
      headers,
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  login(loginform: NgForm) {
    const { email, password } = loginform.value;
    const valu = { email, password };
    console.log(valu);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http
      .post('http://localhost:3000/api/v1/auth/login', valu, { headers })
      .subscribe((result: any) => {
        console.log(result.user.userName);
        localStorage.setItem('token', result.token);
        localStorage.setItem('name', result.user.userName);
        this.router.navigate(['/home']);
      });
  }

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {}
}

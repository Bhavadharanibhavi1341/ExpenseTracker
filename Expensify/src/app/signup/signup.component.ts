import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  userName: string = '';
  email: string = '';
  password: string = '';
  cpassword: string = '';

  crate(signupform: NgForm) {
    const { userName, email, password } = signupform.value;
    const val = { userName, email, password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http
      .post('http://localhost:3000/api/v1/auth/signup', val, { headers })
      .subscribe((result: any) => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('name', result.user.userName);
        console.log('successs');
        console.log(result.token);

        this.router.navigate(['./home']);
      });
  }

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {}
}

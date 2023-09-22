import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('errorModal3') errorModal3: TemplateRef<any> | undefined;
  closeResult = '';
  email: string = '';
  password: string = '';
  message: string = '';
  showPassword: boolean = false;

  login(loginform: NgForm) {
    const { email, password } = loginform.value;
    const valu = { email, password };
    console.log(valu);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http
      .post('http://localhost:3000/api/v1/auth/login', valu, { headers })
      .subscribe(
        (result: any) => {
          console.log(result.user.userName);
          localStorage.setItem('token', result.token);
          localStorage.setItem('name', result.user.userName);
          this.router.navigate(['/home']);
        },
        (error: any) => {
          console.log(error);
          if (error.error.error === 'user does not exists') {
            this.message = 'email does not exists';
            console.log('Username already exists error');
            this.openModal3();
            // You can open the popup dialog or display a message here
          } else if (error.error.error === 'password is incorrect') {
            this.message = 'password is incorrect';
            console.log('emailexists');
            this.openModal3();
          }
        }
      );
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  openModal3() {
    this.modalService.open(this.errorModal3).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {}
}

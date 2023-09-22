import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild, TemplateRef } from '@angular/core';
import { WebserviceService } from '../services/webservice.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  usernameExistsErrorVisible = false;
  message: string = '';
  userName: string = '';
  email: string = '';
  password: string = '';
  cpassword: string = '';
  usernameTaken: boolean = false;
  useremailTaken: boolean = false;
  isLength: boolean = false;
  isMatch: boolean = false;
  showPassword: boolean = false;
  showPassword1: boolean = false;

  closeResult = '';
  @ViewChild('errorModal') errorModal: TemplateRef<any> | undefined;
  @ViewChild('errorModal2') errorModal2: TemplateRef<any> | undefined;
  @ViewChild('errorModal3') errorModal3: TemplateRef<any> | undefined;

  async crate(signupform: NgForm) {
    const { userName, email, password, cpassword } = signupform.value;
    if (password.length < 8) {
      this.message = 'password must contain minimum 8 characters';
      this.openModal3();
    } else if (password !== cpassword) {
      this.message = 'Password and confirm password does not match.';
      this.openModal3();
    } else {
      const val = { userName, email, password };
      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      this.http
        .post('http://localhost:3000/api/v1/auth/signup', val, { headers })
        .subscribe(
          (result: any) => {
            localStorage.setItem('token', result.token);
            localStorage.setItem('name', result.user.userName);
            console.log('successs');
            console.log(result.token);
            this.router.navigate(['./home']);
          },
          (error: any) => {
            console.log(error);
            if (error.error.error === 'Username already exists') {
              this.message = 'Username already exists';
              this.openModal3();
              // You can open the popup dialog or display a message here
            } else if (error.error.error === 'Email already exists') {
              this.message = 'Email already exists';
              this.openModal3();
            }
          }
        );
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibility1() {
    this.showPassword1 = !this.showPassword1;
  }
  checkUsernameAvailability() {
    if (this.userName) {
      this.webservice.checkUsername(this.userName).subscribe(
        (result: any) => {
          this.usernameTaken = result.exists;
        },
        (error: any) => {
          console.error('Error checking username availability:', error);
        }
      );
    } else {
      this.usernameTaken = false;
    }
  }
  checkUseremailAvailability() {
    if (this.email) {
      this.webservice.checkUseremail(this.email).subscribe(
        (result: any) => {
          this.useremailTaken = result.exists;
        },
        (error: any) => {
          console.error('Error checking username availability:', error);
        }
      );
    } else {
      this.useremailTaken = false;
    }
  }
  lengthCheck() {
    if (this.password.length < 8) {
      this.isLength = true;
    } else {
      this.isLength = false;
    }
  }
  passwordMatch() {
    if (this.password !== this.cpassword) {
      this.isMatch = true;
    } else {
      this.isMatch = false;
    }
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
    private modalService: NgbModal,
    private webservice: WebserviceService
  ) {}

  ngOnInit(): void {}
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopupComponent } from '../components/popup/popup.component';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {

  forgotPassForm!: FormGroup;
  invalidCredentials = false;
  responseData: any;
  loading = false;
  isEmailVerified: boolean = false;
  otp: any;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.forgotPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      otp: [''],
      newPass: [''] 
    });
  }

  generateOTP() {
    this.loading = true;

    if (this.forgotPassForm.controls['email'].valid) {
      const formData = {
        email: this.forgotPassForm.controls['email'].value
      };
      this.http.post<any>('http://localhost:9091/v1/api/otp/send', formData)
        .subscribe(response => {
          this.responseData = response;
          if (response.Success === "true") {
            const popup = this.dialog.open(PopupComponent, {
              data: {
                message: response.message,
                status: 'happy'
              }
            });
            this.isEmailVerified = true;
          }

          else{            
            const popup = this.dialog.open(PopupComponent, {
              data: {
                message: response.message,
                status: 'otpnotdone'
              }
            });
            this.isEmailVerified = false;
            this.forgotPassForm.reset();
          }
          this.loading = false;

        }, error => {
          console.error('Error:', error);
          this.loading = false;
        });
    } else {
      this.invalidCredentials = true;
    }
  }
  

  verifyOTP() {
    this.loading = true;

    if (this.forgotPassForm.controls['otp'].valid) {
      const formData = {
        email: this.forgotPassForm.controls['email'].value,
        otp: this.forgotPassForm.controls['otp'].value,
        newPass: this.forgotPassForm.controls['newPass'].value
      };
      this.http.post<any>('http://localhost:9091/v1/api/otp/check/Otp', formData)
        .subscribe(response => {
          this.responseData = response;
          if (response.Success === "true") {
            this.forgotPassForm.get('newPass')?.setValidators([Validators.required]); 
            const popup = this.dialog.open(PopupComponent, {
              data: {
                message: response.message,
                status: 'otpandpassdone'
              }
            });
            this.forgotPassForm.get('newPass')?.updateValueAndValidity(); 
            popup.afterClosed().subscribe((dialogResult)=>{
                this.login();
            })
          }
          else{
            
            const popup = this.dialog.open(PopupComponent, {
              data: {
                message: response.message,
                status: 'otpandpassnotdone'
              }
            });
            this.forgotPassForm.controls['otp'].reset();
            this.forgotPassForm.controls['newPass'].reset();

          }
          this.loading = false;
        }, error => {
          console.error('Error:', error);
          this.loading = false;
        });
    } else {
      this.invalidCredentials = true;
    }
  }

  login() {
   
      console.log('form', this.forgotPassForm.value);
      const formData = {
        gmail: this.forgotPassForm.controls['email'].value,
        passw: this.forgotPassForm.controls['newPass'].value
      };
      this.http.post<any>('http://localhost:9091/auth/login', formData)
        .subscribe(response => {
          console.log('Response from server:', response);

          if (response.jwtoken) {
            localStorage.setItem('jwtoken', response.jwtoken);
            localStorage.setItem('Role', response.role);
            localStorage.setItem('usernm', response.usernm);
            localStorage.setItem('id', response.id);

            this.router.navigateByUrl('/home');
          } else if (response.usernm === "USER INACTIVE!") {
            const popup = this.dialog.open(PopupComponent, {
              data: { message: "The Account is inactive!" }
            });
            this.router.navigateByUrl('/login');
          } else {
            if (this.forgotPassForm.get('passw')?.value != null) {
              this.forgotPassForm.get('passw')?.setValue('');
            }
            this.invalidCredentials = true;
          }
        });
  }
}
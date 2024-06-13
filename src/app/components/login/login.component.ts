import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  invalidCredentials = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router , private dialog : MatDialog) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      gmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      passw: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      console.log('form', this.loginForm.value);
      this.http.post<any>('http://localhost:9091/auth/login', this.loginForm.value)
        .subscribe(response => {
          console.log('Response from server:', response);
  
          if (response.jwtoken) {
            localStorage.setItem('jwtoken', response.jwtoken);
            localStorage.setItem('Role', response.role);
            localStorage.setItem('usernm', response.usernm);
            localStorage.setItem('id',response.id);

            this.router.navigateByUrl('/home');
          } else if (response.usernm === "USER INACTIVE!") {
            const popup = this.dialog.open(PopupComponent, {
              data: { message: "The Account is inactive!"}
            });
            this.router.navigateByUrl('/login');
          } else {
            if (this.loginForm.get('passw')?.value != null) {
              this.loginForm.get('passw')?.setValue('');
            }
            this.invalidCredentials = true;
          }
        });
    }
  }
  
}
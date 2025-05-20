import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(5)]],
      name: [''],
      userName: [''],
      role: ['']
    });
  }

  signup() {
    if (this.signupForm.valid) {
      console.log('form', this.signupForm.value);
      this.http.post<any>('http://localhost:9091/v1/api/createuser', this.signupForm.value)
        .subscribe(response => {
          console.log('Response from server:', response);
          if(response.Success === "true"){
            const popup = this.dialog.open(PopupComponent, {
              data: {
                message: response.message,
                status: 'welcome'
              }
            });
          }
          else if (response.Success === "false"){
            const popup = this.dialog.open(PopupComponent, {
              data: {
                message: response.message,
                status: 'sed'
              }
            });
          }

          if (response.Success === "true") {
            this.router.navigate(['/login']);
          } else {
            this.router.navigateByUrl('/signup');
          }
        }, error => {
          console.error('Error:', error);
        });
    }
  }

  signin() {
    this.router.navigateByUrl('/login');
  }

  get passwordControl() {
    return this.signupForm.get('pass');
  }
}
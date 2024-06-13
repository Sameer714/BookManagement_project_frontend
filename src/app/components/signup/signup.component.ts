import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'
import { PopupComponent } from '../popup/popup.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signupForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private dialog: MatDialog,private router: Router) { }
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
      console.log('form',this.signupForm.value);
      this.http.post<any>('http://localhost:9091/v1/api/createuser', this.signupForm.value, )
        .subscribe(response => {
          console.log('Response from server:', response);
          response : 'text';
          const popup = this.dialog.open(PopupComponent, {
            data: { message: response.message }
          });
          debugger
            if(response.Success === "true"){
              this.router.navigate(['/login']);
            }
             else{
              this.router.navigateByUrl('/signup');
            }
        }, error => {
          console.error('Error:', error);
        });  
    }
}
signin(){
  this.router.navigateByUrl('/login');
}
}
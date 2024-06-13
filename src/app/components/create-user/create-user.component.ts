import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from '../popup/popup.component';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
createUserForm !: FormGroup<any>;

constructor(private formBuilder: FormBuilder, private http: HttpClient, private dialog: MatDialog,private router: Router) { }
ngOnInit() {
  this.createUserForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', [Validators.required, Validators.minLength(5)]],
    name: [''],
    userName: [''],
    role: ['USER']
  });
}
signup() {
  if (this.createUserForm.valid) {
    console.log('form',this.createUserForm.value);
    this.http.post<any>('http://localhost:9091/v1/api/createuser', this.createUserForm.value, )
      .subscribe(response => {
        console.log('Response from server:', response);
        response : 'text';
        const popup = this.dialog.open(PopupComponent, {
          data: { message: response.message }
        });
          if(response.Success == true){
            this.router.navigateByUrl('/users');
          } else{
            this.router.navigateByUrl('/users');
          }
      }, error => {
        console.error('Error:', error);
      });  
  }
  else{
    const popup = this.dialog.open(PopupComponent, {
      data: { message: "Check Form Details!" }
  })
}
}
signin(){
this.router.navigateByUrl('/login');
}
}
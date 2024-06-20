import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})

export class ChangePassComponent {
  changePassForm!: FormGroup;
  token: any;
  responseData: any;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private dialog: MatDialog, private router: Router, private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.changePassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      oldpass: ['', [Validators.required, Validators.minLength(5)]],
      pass: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.token = localStorage.getItem('jwtoken');
    if (this.token) {
      this.route.params.subscribe();
    }
  }

  changepass() {
    if (this.changePassForm.valid) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });
      
      const formData = this.changePassForm.value;
      this.http.post<any>(`http://localhost:9091/v1/api/changePass`, formData, { headers: headers })
        .subscribe(response => {
          this.responseData = response;
          if (response.Success === "true") {
            this.router.navigateByUrl('/');
          }

          console.log('Response from Update:', response);
          if(response.Success==="true"){
            const popup = this.dialog.open(PopupComponent, {
              data: {
                message: response.message,
                status: 'passupdated'
              }
            });
          }

         else if(response.Success==="false"){
            const popup = this.dialog.open(PopupComponent, {
              data: {
                message: response.message,
                status: 'passnotupdated'
              }
            });
          }


        }, error => {
          console.error('Error:', error);
        });
    }
    else {
      console.log("meow");
    }
  }
}
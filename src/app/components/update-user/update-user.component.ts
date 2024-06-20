import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {

  updateUserForm!: FormGroup;
  responseData: any;
  token: any;
  userId: any;
  fetch: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.updateUserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(5)]],
      name: [''],
      userName: [''],
      role: [''],
    });

    this.token = localStorage.getItem('jwtoken');
    if (this.token) {
      this.route.params.subscribe(params => {
        this.userId = params['id'];

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${this.token}`
        });

        this.http.get<any>(`http://localhost:9091/v1/api/getuserInfo/${this.userId}`, { headers: headers })
          .subscribe(response => {
            this.fetch = response;
            console.log('Response from Update:', response);
            this.updateUserForm.patchValue({
              email: response.email,
              pass: response.password,
              name: response.name,
              userName: response.username,
              role: response.role
            });
          }, error => {
            console.error('Error:', error);
          });
      });
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('login');
  }

  update() {
    if (this.updateUserForm.valid) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      const formData = this.updateUserForm.value;

      this.http.put<any>(`http://localhost:9091/v1/api/Updateuser/${this.userId}`, formData, { headers: headers })
        .subscribe(response => {
          this.responseData = response;
          console.log('Response from Update:', response);
          
          if(this.responseData.Success === "true"){
            const popup = this.dialog.open(PopupComponent, {
              data: { 
                message: 'User Updated Successfully',
                from: 'Update',
                id: this.userId
              }
            });
            this.logout();

          }
          else if(this.responseData.Success === "false"){
            const popup = this.dialog.open(PopupComponent, {
              data: { 
                message: this.responseData.message,
                from: 'Update',
                id: this.userId
              }
            });
          }
        }, error => {
          console.error('Error:', error);
        });
    }
  }
}

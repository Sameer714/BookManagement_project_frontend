import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  responseData1: string = ''; 
  responseData: any[] = [];
  role: any;
  token: any;
  userId: any;
  id: any;
  loggedinUser: any;

  constructor(private http: HttpClient, private router: Router , private dialog : MatDialog) { }

  ngOnInit() {
    this.token = localStorage.getItem('jwtoken');
    this.role = localStorage.getItem('Role');
    this.loggedinUser = localStorage.getItem('usernm')
    this.id = localStorage.getItem('id');
    console.log('user id',this.id);
    
    if (this.token) {
      this.getAllData(this.token);
    } else {
    }
  }

  getAllData(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:9091/v1/api/getAllUsers', { headers })
      .subscribe(response => {
        this.responseData = response;
        console.log('Response from getAllUsers:', response);
      })
  }


  create() {
    this.router.navigateByUrl('/create-user');
  }

  changestatus(userId: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  
    this.http.put<string>(`http://localhost:9091/v1/api/updateStatus/${userId}`, null, { headers })
      .subscribe(
        (response: string) => {
          this.responseData1 = response;
          console.log('Response from change status:', response);
          this.getAllData(this.token)
        }, 
        (error) => {
          console.error('Error:', error);
        }
      );
  }
  
  logout() {
    const popup = this.dialog.open(PopupComponent, {
      data: { 
        message: "Logged Out Successfully!",
        status: 'done'
      }
    });
    localStorage.clear();
    this.router.navigateByUrl('login');
  }

  books() {
    this.router.navigateByUrl('/home')
    }

  delete(id: any) {
    console.log('id', id);
    const token = localStorage.getItem('jwtoken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete<any>(`http://localhost:9091/v1/api/deluser/${id}`, { headers })
      .subscribe(response => {
        console.log('Delete Response:', response);
        this.getAllData(this.token);
      }, error => {
        console.error('Error:', error);
      });
  }

  navigateToData(userId: string) {
    this.router.navigate(['/data', userId]);
  }
}
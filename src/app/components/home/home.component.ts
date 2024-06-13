import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  responseData: any[] = []; 
  launchDate: string[] = []; 
  minDate: Date | undefined;
  role: any;
  token: any;
  loggedinUser :any;
  
  constructor(private http: HttpClient, private router: Router, private dialog : MatDialog) {
    this.minDate = new Date();
  }

  ngOnInit() {
    this.token = localStorage.getItem('jwtoken');
    this.role = localStorage.getItem('Role');
    this.loggedinUser = localStorage.getItem('usernm');
    if (this.token) {
      this.getAllData(this.token);
    } else {
    }
  }

  getAllData(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:9091/v1/api/getAll', { headers })
      .subscribe(response => {
        this.responseData = response; 
        console.log('Response from getAll:', response);
        
        this.launchDate = [];

        response.forEach((item: { launchDate: string | number | Date; }) => {
          const launch = new Date(item.launchDate); 
          const formattedDate = launch.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          this.launchDate.push(formattedDate);
        });
      }, error => {
        console.error('Error:', error);
      });
  }

  create() {
    this.router.navigateByUrl('/create');
  }

  changepass() {
    this.router.navigateByUrl('/change-pass')
    }

  Admin() {
    this.router.navigateByUrl('/users')
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

  delete(id: any) {
    console.log('id', id);
    const token = localStorage.getItem('jwtoken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete<any>(`http://localhost:9091/v1/api/deletebyId/${id}`, { headers })
      .subscribe(response => {
        console.log('Delete Response:', response);
        this.getAllData(this.token);
      }, error => {
        console.error('Error:', error);
      });
  }

  update(id: any) {
    console.log('id', id);
    const token = localStorage.getItem('jwtoken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.put<any>(`http://localhost:9091/v1/api/update/${id}`,{ headers })
      .subscribe(response => {
        console.log('Update Response:', response);
      }, error => {
        console.error('Update Error:', error);
      });
  }

  navigateToData(bookId: string) {
    this.router.navigate(['/data', bookId]);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit{
  userId: any;
  responseData: any;
  token: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.token = localStorage.getItem('jwtoken');
    if (this.token) {
      this.getAllData(this.token);
    } else {
    }
  }

  getAllData(token: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.http.get<any>(`http://localhost:9091/v1/api/getuserInfo/${this.userId}`, {headers: headers})
      .subscribe(response => {
        this.responseData = response;
        console.log('Response from getById API:', response);
      }, error => {
        console.error('Error:', error);
      });
    });
  }
}
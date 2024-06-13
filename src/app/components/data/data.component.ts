import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  bookId: any;
  responseData: any;
  launchDate: any;
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
      this.bookId = params['id'];
      this.http.get<any>(`http://localhost:9091/v1/api/getbyid/${this.bookId}`, {headers: headers})
      .subscribe(response => {
        this.responseData = response;
        console.log('Response from getById API:', response);

          const launch = new Date(response.launchDate);
          console.log('launch', launch);
          const formattedDate = launch.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          this.launchDate = formattedDate ;

      }, error => {
        console.error('Error:', error);
      });
    });
  }
}
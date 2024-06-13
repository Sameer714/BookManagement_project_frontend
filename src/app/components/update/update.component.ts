import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  bookId: any;
  responseData: any;
  token: any;
  updateForm!: FormGroup;
  fetch : any;
  launchDate: any;
  editDate: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.updateForm = this.formBuilder.group({
      bookName: ['', [Validators.required]],
      authorName: ['', [Validators.required, Validators.maxLength(220)]],
      launchDate: [''],
      aboutBook: [''],
    });
  
    this.token = localStorage.getItem('jwtoken');
    if (this.token) {
      this.route.params.subscribe(params => {
        this.bookId = params['id'];
      });
  
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });
  
      this.http.get<any>(`http://localhost:9091/v1/api/getbyid/${this.bookId}`, { headers: headers })
        .subscribe(response => {
          this.fetch = response;
          console.log('Response from Update:', response);
        
          const launch = new Date(response.launchDate);
          console.log('launch', launch);
          const formattedDate = launch.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          this.launchDate = formattedDate ;

          this.updateForm.patchValue({
            bookName: response.bookName,
            authorName: response.authorName,
            launchDate: this.launchDate,
            aboutBook: response.aboutBook,
          });

        }, error => {
          console.error('Error:', error);
        });
    }
  }

  editdate() {
    this.editDate = true;
    }
  
  update() {
    if (this.updateForm.valid) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      const formData = this.updateForm.value;

      this.http.put<any>(`http://localhost:9091/v1/api/update/${this.bookId}`, formData, { headers: headers })
        .subscribe(response => {
          this.responseData = response;
          console.log('Response from Update:', response);
            this.router.navigate(['/data', this.bookId]);
          
        }, error => {
          console.error('Error:', error);
        });
    }
  }
}
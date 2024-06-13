import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  bookId: any;
  responseData: any;
  token: any;
  createForm!: FormGroup;

  constructor(
    private route: ActivatedRoute, private http: HttpClient,private router: Router, private formBuilder: FormBuilder ) {}

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      bookName: ['', [Validators.required]],
      authorName: ['', [Validators.required, Validators.maxLength(220)]],
      launchDate: [''],
      aboutBook: [''],
    });
  
    this.token = localStorage.getItem('jwtoken');
  }

  create() {
    if (this.createForm.valid) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      const formData = this.createForm.value;

      this.http.post<any>('http://localhost:9091/v1/api/create', formData, { headers: headers })
        .subscribe(response => {
          this.responseData = response;
          console.log('Response from Create:', response);
            this.router.navigate(['/home']);
          
        }, error => {
          console.error('Error:', error);
        });
    }
  }
}

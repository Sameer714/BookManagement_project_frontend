import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogref: MatDialogRef<PopupComponent>, private router: Router) {}

  close(){
    this.dialogref.close();
  }
  ok(){
    if(this.data.from === 'Update'){
      console.log('router');
      this.dialogref.close();
      // this.router.navigateByUrl(`/update-user/${this.data.id}`);
    } else {
      this.dialogref.close();
    }
  }
  get message(): string {
    return this.data.message;
  }

  get status(): string{
    return this.data.status;
  }
}

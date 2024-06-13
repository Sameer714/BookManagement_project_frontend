import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { DataComponent } from './components/data/data.component';
import { UpdateComponent } from './components/update/update.component';
import { CreateComponent } from './components/create/create.component';
import { UsersComponent } from './components/users/users.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { DelUserComponent } from './components/del-user/del-user.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ChangePassComponent } from './components/change-pass/change-pass.component';

const routes: Routes = [
  {
  path: 'login', component: LoginComponent
},
{
  path: 'signup', component: SignupComponent
},
{
  path: 'home', component: HomeComponent
},
{
  path: 'data/:id' , component:DataComponent
},
{
  path : 'update/:id' , component:UpdateComponent
},
{
  path : 'create' , component:CreateComponent
},
{
  path : 'users' , component:UsersComponent
},
{
  path : 'user-info/:id' , component:UserInfoComponent
},
{
  path : 'del-user' , component:DelUserComponent
},
{
  path : 'update-user/:id' , component:UpdateUserComponent
},
{
  path : 'create-user' , component:CreateUserComponent
},
{
  path : 'change-pass' , component:ChangePassComponent
},

{
  path:"", redirectTo:"login", pathMatch:"full",
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

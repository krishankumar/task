import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import {
  CanActivateRouteGuard as AuthGuard
} from './configs/can-activate-route.guard';
// modules
import { LoginComponent } from './view/login/login.component';
import { ForgotPasswordComponent } from './view/forgot-password/forgot-password.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { MainComponent } from './view/main/main.component';

import { UserManagementComponent } from './view/user-management/user-management.component';
import { UserDetailComponent } from './view/user-detail/user-detail.component';
import { ChangePasswordComponent } from './view/change-password/change-password.component';
import { ContentManagementComponent } from './view/content-management/content-management.component';
import { PagenotfoundComponent } from './view/pagenotfound/pagenotfound.component';



const routes: Routes = [
  {
    path: 'login', component: LoginComponent

  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'main', component: MainComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
     
      { path: 'user_management', component: UserManagementComponent, canActivate: [AuthGuard] },
      { path: 'user_management/user_detail/:id', component: UserDetailComponent, canActivate: [AuthGuard] },


      { path: 'change_password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
      { path: 'terms_and_condition', component: ContentManagementComponent, canActivate: [AuthGuard] },
     
      { path: '', redirectTo: '/main/dashboard', pathMatch: 'full' },
    ]
  },

  {
    path: '',
    redirectTo: '/main/dashboard',
    pathMatch: 'full'
  },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

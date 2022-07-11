import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './view/login/login.component';
import { ForgotPasswordComponent } from './view/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './view/change-password/change-password.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';

//services
import { CanActivateRouteGuard } from "./configs/can-activate-route.guard"

// modules
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxPaginationModule} from 'ngx-pagination';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NotifierModule } from "angular-notifier";
import { RatingModule } from 'ng-starrating';

//services
import { Interceptor } from './configs/interceptor';
import { HeaderDirective } from './directives/header.directive';
import { HeaderComponent } from './view/header/header.component';
import { MainComponent } from './view/main/main.component';
import { FooterComponent } from './view/footer/footer.component';
import { SidebarComponent } from './view/sidebar/sidebar.component';

import { UserManagementComponent } from './view/user-management/user-management.component';
import { UserDetailComponent } from './view/user-detail/user-detail.component';

import { ContentManagementComponent } from './view/content-management/content-management.component';


import { TestComponent } from './view/test/test.component';

import { CaptalisePipe } from './configs/captalise.pipe';

import { PagenotfoundComponent } from './view/pagenotfound/pagenotfound.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    HeaderDirective,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    SidebarComponent,

    UserManagementComponent,
    UserDetailComponent,
    TestComponent,
    ChangePasswordComponent,
    ContentManagementComponent,
    PagenotfoundComponent,
    CaptalisePipe,
   
    // ApiCallingService
  ],
  exports: [
    HeaderDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    CKEditorModule,
    NotifierModule,
    RatingModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
    CanActivateRouteGuard
  ]
})
export class AppModule { }

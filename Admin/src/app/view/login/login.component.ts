import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiCallingService } from "../../configs/api-calling.service"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  requestData: any;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    public api: ApiCallingService
  ) {
  }
  ngOnInit() {

   
    this.loginForm = this.formBuilder.group({

      // username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])]],
      password: ['', [Validators.required, Validators.minLength(4)]],

    });

    
  }

  get f() { return this.loginForm.controls; }

  login() {

    this.submitted = true;
    // stop here if form is invalid 
    if (this.loginForm.invalid) {
      return;
    } else {

      let api_url = 'Admin/login'

      let requestData = {
        "email": this.loginForm.controls.email.value,
        "password": this.loginForm.controls.password.value,
        "role": 'ADMIN',
        "deviceToken": "Dummy-Admin",
        "deviceType": "WEB"
      }
  

      this.api.postRequest(api_url, requestData).then(
        (res) => {
          this.api.setUserLoggedIn(res.result.accessToken, res.result)
          this.router.navigate(['/main/dashboard'])
        },
        (err) => {

        }
      );
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiCallingService } from "../../configs/api-calling.service"
import { NotifierService } from "angular-notifier";


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  submitted = false;
  requestData: any;
  private readonly notifier: NotifierService;

  constructor(private formBuilder: FormBuilder, private router: Router,  public api: ApiCallingService, notifierService: NotifierService
    ) {
      this.notifier = notifierService
    }

  ngOnInit() {


    this.forgotForm = this.formBuilder.group({

      email: ['', [Validators.required, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])]]

    });
  }
  get f() { return this.forgotForm.controls; }

  forgotPassword() {
    this.submitted = true;
    // stop here if form is invalid 
    if (this.forgotForm.invalid) {
      return;
    } else {
      let api_url = 'Admin/forgotPassword'

      let requestData = {
        "email": this.forgotForm.controls.email.value 
      }

      this.api.postRequest(api_url, requestData).then(
        (res) => {
          this.notifier.notify('success', `Success: `+res.message);
          this.router.navigate(['/login'])
        },
        (err) => {
        
        }
      );
    }

    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.loginForm.value))
  }

}

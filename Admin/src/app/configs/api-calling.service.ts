import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { NotifierService } from 'angular-notifier';
import { FormGroup, AbstractControl, Validators, ValidationErrors, FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiCallingService {
  private readonly notifier: NotifierService;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private router: Router,
    private notifierService: NotifierService,
  ) {
    this.notifier = notifierService;
  }

  public setUserLoggedIn(token: string, data: any): boolean {
    localStorage.setItem('token', token);
    localStorage.setItem('userDetails', JSON.stringify(data));
    return true;
  }

  public checkUserAuth(): boolean {
    return localStorage.token ? true : false;
  }

  public IMAGE_BASE_URL = environment.IMG_BASE_URL;

  public postRequest(apiPath: string, postData: any): any {
    var promise = new Promise((resolve, reject) => {
      this.spinner.show();

      this.http.post(environment.SERVER_URL + apiPath, postData)
        .subscribe(

          (val) => { 
            this.spinner.hide();
            resolve(handleError(val, this.notifier))

          },
          response => { 
            this.spinner.hide();

            // console.log("POST call in error", response);
            // this.notifier.notify('error', ' WHOOPS , ' + 'Your session expired !!.. LOGIN AGAIN');

            reject(handleError(response, this.notifier));

          },
          () => {
            // console.log("The POST observable is now completed.");
          });
    });

    return promise;
  }

  public getRequest(apiPath: string, getData: any): any {

    var promise = new Promise((resolve, reject) => {
      this.spinner.show();

      this.http.get(environment.SERVER_URL + apiPath, getData)
        .subscribe(

          (val) => {

            this.spinner.hide();
            if (val['code'] == environment.STATUS_CODE.DATA_NOT_FOUND.CODE) {
              resolve(val);
            } else {
              resolve(handleError(val, this.notifier))
            }
          },
          response => {
            this.spinner.hide();

            reject(handleError(response, this.notifier));

          },
          () => {
          });
    });

    return promise;
  }

  cannotContainSpace(control: AbstractControl): ValidationErrors | null {

    if ((control.value as string).indexOf(' ') >= 0) {

      return { cannotContainSpace: true }

    } return null;

  }
}

function handleError(response, notifiers) {
  if (response['code'] == environment.STATUS_CODE.FAILURE.CODE) {
    // window.alert(`Error : ${response['message']}`);
    notifiers.notify('error', `Error : ${response['message']}`);;
  }
  else if (response['code'] == environment.STATUS_CODE.SESSION_EXPIRE.CODE) {
    notifiers.notify('error', `Error : ${response['message']}`);
    window.location.href = window.location.origin + '/#/login'
    // window.location.hash = "";

  }
  else if (response['code'] == environment.STATUS_CODE.SUCCESS.CODE) {
    return response;
  }
  else if (response['code'] == environment.STATUS_CODE.API_NOT_FOUND.CODE) {
    notifiers.notify('error', `Error: ${response.status} NOT FOUND`);
  }
  else if (response['code'] == environment.STATUS_CODE.DATA_NOT_FOUND.CODE) {
    // window.alert(`Error: ${response.status} NOT FOUND`);

  }
  else {
    notifiers.notify('error', `Error: Technical Error!! Please try again after sometime.`);
    // window.alert(`Error: Technical Error!! Please try again after sometime.`);

  }
  // console.log("POST call successful value returned in body",
  //   response);

}

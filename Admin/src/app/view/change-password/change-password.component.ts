import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiCallingService } from "../../configs/api-calling.service";
import { NotifierService } from "angular-notifier";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  private readonly notifier: NotifierService;
  public title = 'Update Profile';
  public submitted = false;
  fileToUpload: File = null;
  public fileUrl: string = '';
  userDetails: any = {};
  responseData: any = [];
  myForm: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public api: ApiCallingService,
    notifierService: NotifierService,
    private router: Router,
  ) {
    this.notifier = notifierService
  }
  ngOnInit() {
    

    this.userDetails = JSON.parse(localStorage.getItem('userDetails'))
    this.fileUrl =  this.userDetails.profilePic != ''  &&  this.userDetails.profilePic!='default_user.png' ? this.api.IMAGE_BASE_URL +'/images/'+this.userDetails.profilePic : "assets/img/no_image.png";
   
    this.myForm = this.formBuilder.group({
      password: [''],
      new_password: [''],
      avatar: [this.fileUrl],
      email: [this.userDetails.email, [Validators.required]],
      fullName: [this.userDetails.fullName, [Validators.required]],
    })

  }

  submit() {
    this.submitted = true;
   
    if (this.myForm.valid) {
      let api_url = 'Admin/updateProfile';
      var formData = new FormData();
      formData.append('email', this.myForm.value.email)
      formData.append('fullName', this.myForm.value.fullName)
      formData.append('profilePic', this.myForm.get('avatar').value.name == undefined ? '' : this.myForm.value.avatar)
      formData.append('currentPassword', this.myForm.controls.password.value)
      formData.append('password', this.myForm.controls.new_password.value ? this.myForm.controls.new_password.value : '')
      if (this.myForm.value.password) {
        if (this.myForm.value.new_password) {

        } else {
          alert('Please enter new password.')
        }
      }
      if (this.myForm.value.new_password) {
        if (this.myForm.value.password) {

        } else {
          alert('Please enter current password.')
        }
      }
      this.api.postRequest(api_url, formData).then(
        (res) => {
          this.submitted = false;
          // this.myForm.reset();
          if (res.code == 200) {
            this.api.setUserLoggedIn(res.result.accessToken, res.result)
            this.fileUrl = res.result.fileUrl;
            this.notifier.notify('success', `Success: Profile updated successfully`)
            this.router.navigate(['/main/dashboard'])
          } else {
            this.notifier.notify('error', res.message)
          }
        },
        (err) => {
        }
      );
    }
  }

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.myForm.patchValue({
      avatar: file
    });
    this.myForm.get('avatar').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    if (file.type.indexOf('image') > -1) {
      // this.format = 'image';
    } else if (file.type.indexOf('video') > -1) {
      // this.format = 'video';
      this.myForm.patchValue({
        isvideo: true
      });
      this.myForm.get('isvideo').updateValueAndValidity()

    }
    reader.onload = () => {
      this.fileUrl = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  resetForm() {
    this.submitted = false;
    this.myForm.reset();
    this.myForm.controls.avatar.setValue(null)
    this.fileUrl = '';
    this.myForm.controls.fluentID.setValue('');
  }
}

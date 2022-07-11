import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiCallingService } from "../../configs/api-calling.service";
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public category_name = '';
  public submitted = false;
  public responseData: any = [];
  fileToUpload: File = null;
  public fileUrl: any = '';

  constructor(

    private router: Router,
    public api: ApiCallingService,
  ) {
  }

  ngOnInit() {
  }

  logout() {
    var api_url = 'Admin/logout'
    this.api.postRequest(api_url, {
    }).then(
      (res) => {
        console.log("logout--",res)
        this.router.navigate(['/login']);
        if (res.code == 200) {
          localStorage.clear();
        } else {

        }
      },
      (err) => {
      }
    );

  }


}

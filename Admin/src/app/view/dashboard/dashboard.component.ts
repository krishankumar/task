import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiCallingService } from "../../configs/api-calling.service";
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public title = 'Dashboard';
  public responseData: any = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    public api: ApiCallingService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {

    let api_url = 'Admin/dashboard'

    this.api.getRequest(api_url, {}).then(
      (res) => {
        if (res != undefined && (res.code == 200 || res.code == 202)) {
          this.responseData = res.result; console.log("+++++++++",this.responseData)
        } else {
          if (res) {
            alert(res.message)
          }
        }
      },
      (err) => {

      }
    );

  }
}

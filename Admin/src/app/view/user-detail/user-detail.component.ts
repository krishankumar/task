import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiCallingService } from "../../configs/api-calling.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  public title = 'User Detail';
  public responseData: any = [];
  public id: string = '';
  public IMAGE_BASE_URL;
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    public api: ApiCallingService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.getData()
    })
    this.IMAGE_BASE_URL = this.api.IMAGE_BASE_URL;
  }

  getData() {

    // stop here if form is invalid 

    let api_url = 'Admin/user_detail?';
    api_url = api_url + '_id=' + this.id;

    this.api.getRequest(api_url, { _id: this.id }).then(
      (res) => {
        if (res != undefined && res.code == 200) {
      
          this.responseData = res.data[0]
          
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

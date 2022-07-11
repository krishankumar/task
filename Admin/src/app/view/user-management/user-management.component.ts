import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiCallingService } from "../../configs/api-calling.service";
import Swal from 'sweetalert2';
import { NotifierService } from "angular-notifier";

declare var $: any;

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  public title = 'User Management';
  public responseData: any = [];
  public search = '';
  // pagination var
  itemsPerPage: number = 10;
  totalRecords: number;
  skip: number = 0;
  p: number = 1;
  private readonly notifier: NotifierService;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    public api: ApiCallingService,
    notifierService: NotifierService

  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.getData();
  }

  getData() {

    // stop here if form is invalid 
    if (this.search) {
      this.p = 1;
      this.skip = this.itemsPerPage * this.p - this.itemsPerPage;
    }
    let api_url = 'Admin/userManagement?skip=' + this.skip + '&limit=' + this.itemsPerPage + '&search=' + this.search+ '&role=USER';

    this.api.getRequest(api_url, {}).then(
      (res) => {
        if (res != undefined && (res.code == 200 || res.code == 202)) {
          this.totalRecords = res.totalCount;
          this.responseData = res.data
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

  activeInactiveUser(val, status) {

    Swal.fire({
      text: status ? 'Are you sure, You want to inactive this user ?' : 'Are you sure, You want to active this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel'
    }).then((result) => {

      if (result.value) {

        this.api.postRequest('Admin/blockUnBlockUser', {
          user_id: val,
          block: status ? true : false
        }).then(
          (res) => {

            if (res && res.code == 200) {
              Swal.fire(
                'Success!',
                status ? 'User marked inactive successfully.' : 'User marked active successfully.',
                'success'
              )

              for (var i in this.responseData) {
                if (this.responseData[i]._id.toString() == val.toString()) {
                  this.responseData[i].isBlocked = status;
                }
              }

            } else {
              Swal.fire(
                'Something Went Wrong.',
                'Please try again after some time.',
                'error'
              )
            }
          },
          (err) => {
            Swal.fire(
              'Something Went Wrong.',
              'Please try again after some time.',
              'error'
            )
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your request has been cancelled',
          'error'
        )
      }
    })
  }

  pageChanged(val) {

    this.skip = this.itemsPerPage * val - this.itemsPerPage;
    this.getData()

  }

  deleteUser(userId) {
    Swal.fire({
      title: 'Are you sure, You want to delete this user ?',
      text: 'You will not be able to recover this user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {

      if (result.value) {

        this.api.postRequest('Admin/deleteUser', { user_id: userId }).then(
          (res) => {
            if (res && res.code == 200) {
              Swal.fire(
                'Deleted!',
                'User has been deleted.',
                'success'
              )
              for (var i in this.responseData) {
                if (this.responseData[i]._id.toString() == userId.toString()) {
                  this.responseData.splice(i, 1);
                }
              }

            } else {

              Swal.fire(
                'Something Went Wrong.',
                'Please try Again after some time.',
                'error'
              )
            }

          },
          (err) => {

            Swal.fire(
              'Something Went Wrong.',
              'Please try Again after some time.',
              'error'
            )
          }
        );

      } else if (result.dismiss === Swal.DismissReason.cancel) {

        Swal.fire(
          'Cancelled',
          'Your request has been cancelled',
          'error'
        )
      }
    })
  }

}

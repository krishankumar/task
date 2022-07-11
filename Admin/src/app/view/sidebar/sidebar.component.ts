import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public activeRoute: boolean = false;
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    if (window.location.hash == '#/main/fluent_management/my_fluent') {
      this.activeRoute = true
    }
    if (window.location.hash == '#/main/fluent_management/fluent_detail') {
      this.activeRoute = true
    }
    if (window.location.hash == '#/main/fluent_management/edit_fluent') {
      this.activeRoute = true
    }
    if (window.location.hash == '#/main/lesson_management/my_lesson') {
      this.activeRoute = true
    }
    if (window.location.hash == '#/main/lesson_management/lesson_detail') {
      this.activeRoute = true
    }
    if (window.location.hash == '#/main/lesson_management/edit_lesson') {
      this.activeRoute = true
    }
  }

}

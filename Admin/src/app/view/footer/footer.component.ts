import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public projectName = 'Turbo Hotel'
  public year : number;
  constructor() { }

  ngOnInit() {
    var d = new Date();
     this.year = d.getFullYear();
  }

}

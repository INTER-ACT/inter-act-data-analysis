import {Component, OnChanges, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  ariaExpandet: boolean;

  constructor(private router: Router) {
    this.ariaExpandet=false;
  }

  ngOnInit(): void {
  }




}

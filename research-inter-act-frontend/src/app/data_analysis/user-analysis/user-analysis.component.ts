import { Component, OnInit } from '@angular/core';
import {Moment} from 'moment';
import {Observable} from 'rxjs';
import {User} from '../../consolidated_law/example-view/user';
import {UserService} from '../../consolidated_law/example-view/user.service';

@Component({
  selector: 'app-user-analysis',
  templateUrl: './user-analysis.component.html',
  styleUrls: ['./user-analysis.component.css']
})
export class UserAnalysisComponent implements OnInit {

  selected: {startDate: Moment, endDate: Moment};
  users:Observable<User[]>;
  selectedUsers:User[];

  constructor(private userService:UserService) { }

  ngOnInit() {
    this.users=this.userService.users;
    this.userService.loadAllWithActivities();
    this.userService.users.subscribe(users=>{
      if (users.length==0) {
        this.userService.loadAllWithActivities();
        return;
      }
    })
  }


}

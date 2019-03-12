import {Component, OnInit, Sanitizer} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from './user';
import {UserService} from './user.service';
import {environment} from '../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-example-view',
  templateUrl: './example-view.component.html',
  styleUrls: ['./example-view.component.css']
})
export class ExampleViewComponent implements OnInit {

  _showGenerall:boolean=true;
  users:Observable<User[]>;
  user:User;
  user_id:number=null;
  url:string=environment.apiURL+'gesetze/neu/html';

  constructor(private userService:UserService) { }

  ngOnInit() {
    this.users=this.userService.users;
    this.userService.users.subscribe(users=>{
      if (users.length == 0) {
        this.userService.loadAll();
        return;
      }
    })
  }

  set showGenerall(value:boolean){
    this._showGenerall=value;
    if (this._showGenerall)
      this.url=environment.apiURL+'gesetze/neu/html';
    else if (this.user != undefined)
      this.url=environment.apiURL+'user/'+this.user.user_id+'/gesetze/neu/html';
    else
      this.url='';
  }
  get showGenerall(){
    return this._showGenerall;
  }

  selectUser(user_id: number) {
    this.user=this.userService.userById(user_id);
    this.url=environment.apiURL+'user/'+this.user.user_id+'/gesetze/neu/html';
  }

  changeUserId() {
    if (this.user!=null) {
      this.user_id = this.user.user_id;
      this.url = environment.apiURL + 'user/' + this.user.user_id + '/gesetze/neu/html';
    }
    else {
      this.user_id=null;
      this.url='';
    }
  }

  copyToClipboard(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
}

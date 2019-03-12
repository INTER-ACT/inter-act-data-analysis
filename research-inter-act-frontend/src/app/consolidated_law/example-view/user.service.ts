import { Injectable } from '@angular/core';
import {User} from './user';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _users:BehaviorSubject<User[]>;

  private dataStore:{users:User[]};

  constructor(private http:HttpClient) {
    this.dataStore={users:[]};
    this._users=new BehaviorSubject<User[]>([]);
  }

  get users():Observable<User[]>{
    return this._users.asObservable();
  }

  userById(id:number):User{
    return this.dataStore.users.find(x=>x.user_id==id);
  }

  loadAll(){
    return this.http.get<User[]>(environment.apiURL+'users',{headers:environment.headers}).subscribe(
      data=>{
        this.dataStore.users=data;
        this._users.next(Object.assign({},this.dataStore).users);
      },
      error=>console.log('Failed to fetch users')
    )
  }
  loadAllWithActivities(){
    return this.http.get<User[]>(environment.apiURL+'users?aktivitaeten',{headers:environment.headers}).subscribe(
      data=>{
        this.dataStore.users=data;
        this._users.next(Object.assign({},this.dataStore).users);
      },
      error=>console.log('Failed to fetch users')
    )
  }

}

import { Injectable } from '@angular/core';
import {Setting} from './setting';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private dataStore:{settings:Setting[]};

  private _settings:BehaviorSubject<Setting[]>;

  constructor(private http:HttpClient) {
    this.dataStore={settings:[]};
    this._settings=new BehaviorSubject<Setting[]>([]);
  }

  get settings():Observable<Setting[]>{
    return this._settings.asObservable();
  }

  loadSettings(){
    return this.http.get<Setting[]>(environment.apiURL+'einstellungen',{headers:environment.headers}).subscribe(
      data=>{
        this.dataStore.settings=data;
        this._settings.next(Object.assign({},this.dataStore).settings);
      },
      error => {
        console.log("Failed to fetch settings");
      }
    )
  }

  editSetting(setting:Setting){
    return this.http.put(environment.apiURL+'einstellung',setting,{headers:environment.headers}).subscribe(
      data=>{},
      error => console.log('Failed to update setting')
    )
  }

}

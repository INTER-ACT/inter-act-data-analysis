import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Statistic} from '../../wordcloud-analysis/statistic';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Education} from './education';

@Injectable({
  providedIn: 'root'
})
export class EducationService {


  private _educations:BehaviorSubject<Education[]>;

  private dataStore:{
    educations:Education[]
  };

  constructor(private http:HttpClient) {
    this.dataStore={educations:[]};
    this._educations=new BehaviorSubject<Education[]>([]);
  }

  get educations():Observable<Education[]>{
    return this._educations.asObservable();
  }

  educationById(id:number):Education{
    return this.dataStore.educations.find(x=>x.ausbildungs_id==id);
  }

  loadAll(){
    return this.http.get<Education[]>(environment.apiURL+"ausbildungen",{headers:environment.headers}).subscribe(
      data=>{
        this.dataStore.educations=data;
        this._educations.next(Object.assign({},this.dataStore).educations);
      },
      error=>{
        console.log("Failed to fetch educations")
      }
    );
  }
}

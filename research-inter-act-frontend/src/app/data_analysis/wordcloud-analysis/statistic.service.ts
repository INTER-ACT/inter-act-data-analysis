import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Statistic} from './statistic';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private _statistics:BehaviorSubject<Statistic[]>;

  private dataStore:{
    statistics:Statistic[]
  };

  constructor(private http:HttpClient) {
    this.dataStore={statistics:[]};
    this._statistics=new BehaviorSubject<Statistic[]>([]);
  }

  get statistics():Observable<Statistic[]>{
    return this._statistics.asObservable();
  }

  statisticById(id:number):Statistic{
    return this.dataStore.statistics.find(x=>x.statistik_id==id);
  }

  loadAll(){
    return this.http.get<Statistic[]>(environment.apiURL+"statistiken",{headers:environment.headers}).subscribe(
      data=>{
        this.dataStore.statistics=data;
        this._statistics.next(Object.assign({},this.dataStore).statistics);
      },
      error=>{
        console.log("Failed to fetch statistics")
      }
    );
  }

  getStatisticsForLaw(law_id:number){
    return this.dataStore.statistics.filter(s=>s.gesetzes_id==law_id);
  }
}

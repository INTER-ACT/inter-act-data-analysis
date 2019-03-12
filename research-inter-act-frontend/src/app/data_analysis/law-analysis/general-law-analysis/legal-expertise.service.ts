import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Education} from './education';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {LegalExpertise} from './legal-expertise';

@Injectable({
  providedIn: 'root'
})
export class LegalExpertiseService {


  private _legalExpertises:BehaviorSubject<LegalExpertise[]>;

  private dataStore:{
    legalExpertises:LegalExpertise[]
  };

  constructor(private http:HttpClient) {
    this.dataStore={legalExpertises:[]};
    this._legalExpertises=new BehaviorSubject<LegalExpertise[]>([]);
  }

  get legalExpertises():Observable<LegalExpertise[]>{
    return this._legalExpertises.asObservable();
  }

  educationById(id:number):LegalExpertise{
    return this.dataStore.legalExpertises.find(x=>x.rechtskenntnis_id==id);
  }

  loadAll(){
    return this.http.get<LegalExpertise[]>(environment.apiURL+"rechtskenntnisse",{headers:environment.headers}).subscribe(
      data=>{
        this.dataStore.legalExpertises=data;
        this._legalExpertises.next(Object.assign({},this.dataStore).legalExpertises);
      },
      error=>{
        console.log("Failed to fetch legalExpertises")
      }
    );
  }
}

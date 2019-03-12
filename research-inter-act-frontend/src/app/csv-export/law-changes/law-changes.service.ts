import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Law} from '../laws/law/law';
import {environment} from '../../../environments/environment';
import {LawChange} from './law-change/law-change';

@Injectable({
  providedIn: 'root'
})
export class LawChangesService {

  constructor(private http:HttpClient) {
  }


  getLawChange(id:number):Observable<LawChange>{
    return this.http.get<LawChange>(environment.apiURL+"aenderung/"+id,{headers:environment.headers});
  }
  getLawChangesWithCollections():Observable<LawChange[]>{
    return this.http.get<LawChange[]>(environment.apiURL+"aenderungen?konversation",{headers: environment.headers});
  }

  getLawChanges():Observable<LawChange[]> {
    return this.http.get<LawChange[]>(environment.apiURL+"aenderungen",{headers: environment.headers});
  }

  getLawChangesCSV(): Observable<Blob>{
    return this.http.get(environment.apiURL+"aenderungen/csv",{responseType: 'blob',headers: environment.headersCSV})
  }
}

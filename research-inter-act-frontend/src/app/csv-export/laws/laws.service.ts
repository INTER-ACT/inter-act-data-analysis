import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Comment} from '../comments/comment/comment';
import {Law} from './law/law';

@Injectable({
  providedIn: 'root'
})
export class LawsService {

  constructor(private http:HttpClient) {
  }


  getLaw(id:number):Observable<Law>{
    return this.http.get<Law>(environment.apiURL+"gesetz/"+id,{headers:environment.headers});
  }

  getLaws():Observable<Law[]> {
    return this.http.get<Law[]>(environment.apiURL+"gesetze",{headers: environment.headers});
  }
  getLawsWithCollections():Observable<Law[]>{
    return this.http.get<Law[]>(environment.apiURL+"gesetze?konversation",{headers: environment.headers});
  }

  getLawsCSV(): Observable<Blob>{
    return this.http.get(environment.apiURL+"gesetze/csv",{responseType: 'blob',headers: environment.headersCSV})
  }

}

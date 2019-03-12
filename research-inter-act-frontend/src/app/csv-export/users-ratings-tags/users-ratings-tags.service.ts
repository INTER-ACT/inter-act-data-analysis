import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersRatingsTagsService {

  constructor(public http:HttpClient) {}

  public getUsers(): Observable<Blob>{
    return this.http.get(environment.apiURL+"users/csv",{responseType: 'blob',headers: environment.headersCSV})
  }

  public getRatings(): Observable<Blob>{
    return this.http.get(environment.apiURL+"ratings/csv",{responseType: 'blob',headers: environment.headersCSV})
  }


  public getTags(): Observable<Blob>{
    return this.http.get(environment.apiURL+"tags/csv",{responseType: 'blob',headers: environment.headersCSV})
  }
}

import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Comment} from './comment/comment';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService{

  constructor(private http:HttpClient) {
  }

  getComment(id:number):Observable<Comment>{
    return this.http.get<Comment>(environment.apiURL+"kommentar/"+id,{headers:environment.headers});
  }

  getComments():Observable<Comment[]> {
    return this.http.get<Comment[]>(environment.apiURL+"kommentare",{headers: environment.headers});
  }

  getCommentsCSV(): Observable<Blob>{
    return this.http.get(environment.apiURL+"kommentare/csv",{responseType: 'blob',headers: environment.headersCSV})
  }
}

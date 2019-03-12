import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../environments/environment';

import {Law} from '../../../../../csv-export/laws/law/law';
import {Comment} from '../../../../../csv-export/comments/comment/comment';
import {Rating} from './rating';
import {LawChange} from '../../../../../csv-export/law-changes/law-change/law-change';

@Injectable({
  providedIn: 'root'
})
export class RatingsService {

  constructor(public http:HttpClient) {}

  public getRatings():Observable<Rating[]> {
    return this.http.get<Rating[]>(environment.apiURL+"ratings",{headers: environment.headers});
  }
  getLawChanges():Observable<LawChange[]> {
    return this.http.get<LawChange[]>(environment.apiURL+"aenderungen",{headers: environment.headers});
  }

}

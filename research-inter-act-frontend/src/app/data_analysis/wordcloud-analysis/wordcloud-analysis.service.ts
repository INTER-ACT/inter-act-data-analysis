import { Injectable } from '@angular/core';
import {Moment} from 'moment';
import {BehaviorSubject} from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn:"root"
  }
)
export class WordcloudAnalysisService {

  selected:BehaviorSubject<{startDate: Moment, endDate: Moment}>=new BehaviorSubject({
    startDate: moment(null),
    endDate: moment(null)});
  selected$=this.selected.asObservable();


  constructor() { }
}

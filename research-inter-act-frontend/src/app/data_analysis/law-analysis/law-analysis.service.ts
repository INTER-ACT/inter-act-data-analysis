import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Moment} from 'moment';
import * as moment from '../wordcloud-analysis/wordcloud-analysis.service';
import {Law} from '../../csv-export/laws/law/law';
import {LawChange} from '../../csv-export/law-changes/law-change/law-change';

@Injectable({
  providedIn: 'root'
})
export class LawAnalysisService {

  law:BehaviorSubject<Law>=new BehaviorSubject(null);
  law$=this.law.asObservable();

  lawChange:BehaviorSubject<LawChange>=new BehaviorSubject(null);
  lawChange$=this.lawChange.asObservable();

  constructor() { }
}

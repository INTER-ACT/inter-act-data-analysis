import { Component, OnInit } from '@angular/core';
import {Moment} from 'moment';
import {StatisticService} from './statistic.service';
import {Observable} from 'rxjs';
import {Statistic} from './statistic';
import {count} from 'rxjs/operators';
import {forEach} from '@angular/router/src/utils/collection';
import {Router} from '@angular/router';
import {WordcloudAnalysisService} from './wordcloud-analysis.service';
import * as moment from 'moment';

@Component({
  selector: 'app-wordcloud-analysis',
  templateUrl: './wordcloud-analysis.component.html',
  styleUrls: ['./wordcloud-analysis.component.css']
})
export class WordcloudAnalysisComponent implements OnInit {

  selected: {startDate: Moment, endDate: Moment};
  statistics:Observable<Statistic[]>;
  statisticsArray:Statistic[]=[];

  constructor(private statisticService:StatisticService,
              private router:Router,
              private wordcloudAnalysisService:WordcloudAnalysisService) { }

  ngOnInit() {
    this.statistics=this.statisticService.statistics;
    this.statisticService.loadAll();
    this.statisticService.statistics.subscribe(statistics=>{
      if (statistics.length == 0) {
        this.statisticService.loadAll();
        return;
      }
      this.statisticsArray=statistics;
    });
    this.wordcloudAnalysisService.selected$.subscribe(
      exportReference=>{if(exportReference&&exportReference.endDate&&exportReference.startDate)
        exportReference.startDate.isValid()&&exportReference.endDate.isValid()?
        this.selected=exportReference: null;}
    );
  }
  changeSelected(){
    this.wordcloudAnalysisService.selected.next(this.selected);
  }

  get wordcloudCount():number{
    return this.statisticsArray.filter(s=>s.link_ort=='w').length;
  }
  get interactCount():number{
    return this.statisticsArray.filter(s=>s.link_ort=='i').length;
  }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Law} from '../../../csv-export/laws/law/law';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {LawsService} from '../../../csv-export/laws/laws.service';
import {WordcloudAnalysisService} from '../wordcloud-analysis.service';
import {Moment} from 'moment';
import {StatisticService} from '../statistic.service';
import {Statistic} from '../statistic';

@Component({
  selector: 'app-wordcloud-law-analysis',
  templateUrl: './wordcloud-law-analysis.component.html',
  styleUrls: ['./wordcloud-law-analysis.component.css']
})
export class WordcloudLawAnalysisComponent implements OnInit,OnDestroy {

  lawArray:Array<{law:Law;showText:string;id:number}>=[];
  laws:Law[];
  selectedLawId: number;
  selected: {startDate: Moment, endDate: Moment};
  statistics:Statistic[];
  lawsSub:Subscription;
  routeSub:Subscription;

  constructor(private route:ActivatedRoute,
              private router:Router,
              private lawsService:LawsService,
              private wordcloudAnalysisService:WordcloudAnalysisService,
              private statisticService:StatisticService) { }

  ngOnInit() {
    this.routeSub=this.route.params.subscribe(params=>{
      let id=+params['id'];

      this.lawsSub=this.lawsService.getLaws().subscribe((laws: Law[])=>{
        if (laws.length == 0)return;
        this.laws=laws;
        laws.forEach(l=>this.lawArray.push({law:l,showText:l.titel!=''?
            l.gesetzes_id+": §"+l.paragraph+" - "+l.titel:
            l.gesetzes_id+": §"+l.paragraph,id:l.gesetzes_id}));
        this.lawArray.sort((a, b) => a.law.sort<b.law.sort?-1:a.law.sort>b.law.sort?1:0)
        if (id)
          this.selectedLawId=this.lawArray.find(l=>l.law.gesetzes_id==id).law.gesetzes_id;
        else {
          this.selectedLawId = this.lawArray[0].law.gesetzes_id;
          this.router.navigate(['/datenanalyse','wordcloud',this.selectedLawId]);
        }
        this.statistics=this.statisticService.getStatisticsForLaw(this.selectedLawId);
      });
    });
    this.wordcloudAnalysisService.selected$.subscribe(
      exportReference=>this.selected=exportReference
    );
  }

  changeUrlParam(){
    if (this.selectedLawId > 0)
      this.router.navigate(['/datenanalyse','wordcloud',this.selectedLawId]);
    else
      this.router.navigate(['/datenanalyse','wordcloud']);
  }

  ngOnDestroy(): void {
    this.lawsSub.unsubscribe();
    this.routeSub.unsubscribe();
  }
}

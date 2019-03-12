import {Component, OnDestroy, OnInit} from '@angular/core';
import {Law} from '../../../csv-export/laws/law/law';
import {Subscription} from 'rxjs';
import {LawsService} from '../../../csv-export/laws/laws.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LawAnalysisService} from '../law-analysis.service';

@Component({
  selector: 'app-single-law-analysis',
  templateUrl: './single-law-analysis.component.html',
  styleUrls: ['./single-law-analysis.component.css']
})
export class SingleLawAnalysisComponent implements OnInit,OnDestroy {

  lawArray:Array<{law:Law;showText:string;id:number}>=[];
  laws:Law[];
  selectedLawId: number;
  lawsSub:Subscription;
  routeSub:Subscription;

  constructor(private lawsService:LawsService,
              private route:ActivatedRoute,
              private router:Router,
              private lawAnalysisService:LawAnalysisService) {
  }

  ngOnInit() {
    this.lawAnalysisService.law$.subscribe(law=>this.selectedLawId=law.gesetzes_id);
    this.routeSub=this.route.params.subscribe(params=>{
      let id=+params['id'];

      this.lawsSub=this.lawsService.getLawsWithCollections().subscribe((laws: Law[])=>{
        if (laws.length == 0)return;
        this.laws=laws;
        laws.forEach(l=>this.lawArray.push({law:l,showText:l.titel!=''?
            l.gesetzes_id+": §"+l.paragraph+" - "+l.titel:
            l.gesetzes_id+": §"+l.paragraph,id:l.gesetzes_id}));
        this.lawArray.sort((a, b) => a.law.sort<b.law.sort?-1:a.law.sort>b.law.sort?1:0);
        if (id)
          this.selectedLawId=this.lawArray.find(l=>l.law.gesetzes_id==id).law.gesetzes_id;
        else {
          this.selectedLawId = this.lawArray[0].law.gesetzes_id;
        }
        this.lawAnalysisService.law.next(this.laws.find(l=>l.gesetzes_id==this.route.firstChild.snapshot.params['id']));
      });
    });
  }
  ngOnDestroy(): void {
    this.lawsSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  changeURL() {
    this.lawAnalysisService.law.next(this.laws.find(x=>x.gesetzes_id==this.selectedLawId));
  }
}

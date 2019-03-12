import {Component, OnDestroy, OnInit} from '@angular/core';
import {Law} from '../../../csv-export/laws/law/law';
import {Subscription} from 'rxjs';
import {LawsService} from '../../../csv-export/laws/laws.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LawAnalysisService} from '../law-analysis.service';
import {LawChangesService} from '../../../csv-export/law-changes/law-changes.service';
import {LawChange} from '../../../csv-export/law-changes/law-change/law-change';

@Component({
  selector: 'app-single-law-change-analysis',
  templateUrl: './single-law-change-analysis.component.html',
  styleUrls: ['./single-law-change-analysis.component.css']
})
export class SingleLawChangeAnalysisComponent implements OnInit,OnDestroy {

  lawChangeArray:Array<{lawChange:LawChange;showText:string;id:number}>=[];
  lawChanges:LawChange[];
  selectedLawChangeId: number;
  lawChangesSub:Subscription;
  routeSub:Subscription;

  constructor(private lawChangesService:LawChangesService,
              private route:ActivatedRoute,
              private router:Router,
              private lawAnalysisService:LawAnalysisService) {
  }

  ngOnInit() {
    this.lawAnalysisService.lawChange$.subscribe(lawChange=>this.selectedLawChangeId=lawChange.aenderungs_id);
    this.routeSub=this.route.params.subscribe(params=>{
      let id=+params['id'];

      this.lawChangesSub=this.lawChangesService.getLawChangesWithCollections().subscribe((lawChanges: LawChange[])=>{
        if (lawChanges.length == 0)return;
        this.lawChanges=lawChanges;
        lawChanges.forEach(l=>this.lawChangeArray.push({lawChange:l,showText:"Änderungsvorschlag "+l.aenderungs_id,id:l.aenderungs_id}));
        this.lawChangeArray.sort((a, b) => a.lawChange.aenderungs_id<b.lawChange.aenderungs_id?-1:a.lawChange.aenderungs_id>b.lawChange.aenderungs_id?1:0);
        if (id)
          this.selectedLawChangeId=this.lawChangeArray.find(l=>l.lawChange.aenderungs_id==id).lawChange.aenderungs_id;
        else {
          this.selectedLawChangeId = this.lawChangeArray[0].lawChange.aenderungs_id;
        }
        this.lawAnalysisService.lawChange.next(this.lawChanges.find(l=>l.aenderungs_id==this.route.firstChild.snapshot.params['id']));
      });
    });
  }
  ngOnDestroy(): void {
    this.lawChangesSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  changeURL() {
    this.lawAnalysisService.lawChange.next(this.lawChanges.find(x=>x.aenderungs_id==this.selectedLawChangeId));
  }

}

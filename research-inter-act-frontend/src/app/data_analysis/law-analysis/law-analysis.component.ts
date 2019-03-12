import { Component, OnInit } from '@angular/core';
import {LawsService} from '../../csv-export/laws/laws.service';
import {Law} from '../../csv-export/laws/law/law';
import {LawAnalysisService} from './law-analysis.service';
import {LawChange} from '../../csv-export/law-changes/law-change/law-change';
import {LawChangesService} from '../../csv-export/law-changes/law-changes.service';

@Component({
  selector: 'app-law-analysis',
  templateUrl: './law-analysis.component.html',
  styleUrls: ['./law-analysis.component.css']
})
export class LawAnalysisComponent implements OnInit {

  laws:Law[]=null;
  law:Law=null;
  lawChanges:LawChange[]=null;
  lawChange:LawChange=null;

  constructor(private lawService:LawsService,
              private lawAnalysisService:LawAnalysisService,
              private lawChangesService:LawChangesService) { }

  ngOnInit() {
    this.lawAnalysisService.law$.subscribe(
      law=>this.law=law
    );
    this.lawAnalysisService.lawChange$.subscribe(
      lawChange=>this.lawChange=lawChange
    );
    this.lawService.getLawsWithCollections().subscribe(laws=> {
      if (laws.length == 0)return;
      this.laws=laws;
      this.lawAnalysisService.law.next(this.laws[0]);
    });
    this.lawChangesService.getLawChangesWithCollections().subscribe(lawChanges=>{
      if (lawChanges.length == 0)return;
      this.lawChanges=lawChanges;
      this.lawAnalysisService.lawChange.next(this.lawChanges[0]);
    });
  }

}

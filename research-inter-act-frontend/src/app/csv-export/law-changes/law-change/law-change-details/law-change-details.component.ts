import {Component, OnDestroy, OnInit} from '@angular/core';
import {Law} from '../../../laws/law/law';
import {ActivatedRoute, Router} from '@angular/router';
import {LawsService} from '../../../laws/laws.service';
import {LawChange} from '../law-change';
import {LawChangesService} from '../../law-changes.service';
import {ExportLawChangeService} from './export-law-change.service';
import {ExportLawService} from '../../../laws/law/law-details/export-law.service';

@Component({
  selector: 'app-law-change-details',
  templateUrl: './law-change-details.component.html',
  styleUrls: ['./law-change-details.component.css'],
  providers:[ExportLawChangeService]
})
export class LawChangeDetailsComponent implements OnInit,OnDestroy {

  lawChange: LawChange;
  private route_sub:any;
  activated: boolean;
  columns: string[];
  loaded: boolean;
  loadedLawChanges:boolean;
  loadedComments:boolean;
  loadedRatings:boolean;
  loadedReference:boolean;
  loadedZip:boolean;
  zipped: boolean;
  exportLawChanges:boolean;
  exportComments: boolean;
  exportRatings: boolean;
  exportLawChanges_comments:boolean;
  exportLawChanges_ratings:boolean;
  exportReference:boolean;

  constructor(private route:ActivatedRoute,
              private router:Router,
              private lawChangesService:LawChangesService,
              private exportLawChangeService:ExportLawChangeService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.lawChange=null;
    this.columns=[];
    this.loaded=true;
    this.loadedLawChanges=true;
    this.loadedComments=true;
    this.loadedRatings=true;
    this.loadedZip=true;
    this.loadedReference=true;
  }

  ngOnInit() {
    this.route_sub=this.route.params.subscribe(params=>{
      this.lawChangesService.getLawChange(+params['id']).subscribe((lawChange: LawChange)=>{
        this.lawChange=lawChange;
        this.exportLawChangeService.lawChangeLoaded(this.lawChange);
      });
    });
    this.columns=this.exportLawChangeService.selectedColumns;
    this.exportLawChangeService.exportLawChanges$.subscribe(
      (exportData: boolean)=>this.exportLawChanges=exportData
    );
    this.exportLawChangeService.exportComments$.subscribe(
      (exportData: boolean)=>this.exportComments=exportData
    );
    this.exportLawChangeService.exportRatings$.subscribe(
      (exportData: boolean)=>this.exportRatings=exportData
    );
    this.exportLawChangeService.downloadZipped$.subscribe(
      (exportData: boolean)=>this.zipped=exportData
    );
    this.exportLawChangeService.exportLawChanges_comments$.subscribe(
      (exportData: boolean)=>this.exportLawChanges_comments=exportData
    );
    this.exportLawChangeService.exportLawChanges_ratings$.subscribe(
      (exportData: boolean)=>this.exportLawChanges_ratings=exportData
    );
    this.exportLawChangeService.exportReference$.subscribe(
      (exportData: boolean)=>this.exportReference=exportData
    );
  }

  ngOnDestroy() {
    this.route_sub.unsubscribe();
  }

  changeZipped(){
    this.exportLawChangeService.downloadZipped.next(!this.zipped);
  }

  downloadZippedBlob(){
    this.loadedZip=false;
    this.exportLawChangeService.getLawChangeCSVZipped().subscribe(x=>{
      const file = new Blob([x], {type: 'application/octet-stream'});
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file);
        return;
      }
      const data=window.URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href=data;
      link.download="Änderungsvorschlag"+this.lawChange.aenderungs_id+".zip";
      link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

      setTimeout(function () {
        window.URL.revokeObjectURL(data);
      }, 100);
      this.loadedZip=true;
    });
  }

  downloadBlob(){
    this.loaded=false;
    this.exportLawChangeService.getLawChangeCSV().subscribe(x=>{
      const file = new Blob([x], {type: 'text/csv'});
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file);
        return;
      }
      const data=window.URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href=data;
      link.download="Änderungsvorschlag"+this.lawChange.aenderungs_id+".csv";
      link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

      setTimeout(function () {
        window.URL.revokeObjectURL(data);
      }, 100);
      this.loaded=true;
    });
    if (this.exportLawChanges) {
      this.loadedLawChanges=false;
      this.exportLawChangeService.getLawChangesCSV().subscribe(x=>{
        const file = new Blob([x], {type: 'text/csv'});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }
        const data=window.URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href=data;
        link.download="Änderungsvorschlag"+this.lawChange.aenderungs_id+"_Änderungsvorschläge.csv";
        link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

        setTimeout(function () {
          window.URL.revokeObjectURL(data);
        }, 100);
        this.loadedLawChanges=true;
      });
    }
    if (this.exportComments || (this.exportLawChanges_comments&&this.exportLawChanges)) {
      this.loadedComments=false;
      this.exportLawChangeService.getCommentsCSV().subscribe(x=>{
        const file = new Blob([x], {type: 'text/csv'});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }
        const data=window.URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href=data;
        link.download="Änderungsvorschlag"+this.lawChange.aenderungs_id+"_Kommentare.csv";
        link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

        setTimeout(function () {
          window.URL.revokeObjectURL(data);
        }, 100);
        this.loadedComments=true;
      });
    }
    if (this.exportRatings || (this.exportLawChanges_ratings&&this.exportLawChanges)) {
      this.loadedRatings=false;
      this.exportLawChangeService.getRatingsCSV().subscribe(x=>{
        const file = new Blob([x], {type: 'text/csv'});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }
        const data=window.URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href=data;
        link.download="Änderungsvorschlag"+this.lawChange.aenderungs_id+"_Ratings.csv";
        link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

        setTimeout(function () {
          window.URL.revokeObjectURL(data);
        }, 100);
        this.loadedRatings=true;
      });
    }
    if (this.exportReference) {
      this.loadedReference=false;
      this.exportLawChangeService.getReferenceCSV().subscribe(x=>{
        const file = new Blob([x], {type: 'text/csv'});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }
        const data=window.URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href=data;
        if (this.lawChange.typ === 'g')
          link.download="Änderungsvorschlag"+this.lawChange.aenderungs_id+"_Referenz_Paragraph"+this.lawChange.aenderungs_bezugs_id+".csv";
        else
          link.download="Änderungsvorschlag"+this.lawChange.aenderungs_id+"_Referenz_Änderungsvorschlag"+this.lawChange.aenderungs_bezugs_id+".csv";
        link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

        setTimeout(function () {
          window.URL.revokeObjectURL(data);
        }, 100);
        this.loadedReference=true;
      });
    }
  }
}

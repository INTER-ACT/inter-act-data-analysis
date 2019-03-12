import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LawsService} from '../../laws.service';
import {Law} from '../law';
import {ExportLawService} from './export-law.service';

@Component({
  selector: 'app-law-details',
  templateUrl: './law-details.component.html',
  styleUrls: ['./law-details.component.css'],
  providers:[ExportLawService]
})
export class LawDetailsComponent implements OnInit,OnDestroy {

  law: Law;
  private route_sub:any;
  columns: string[];
  loaded: boolean;
  loadedLawChanges:boolean;
  loadedComments:boolean;
  loadedRatings:boolean;
  loadedZip:boolean;
  zipped: boolean;
  exportLawChanges:boolean;
  exportComments: boolean;
  exportRatings: boolean;
  exportLawChanges_comments:boolean;
  exportLawChanges_ratings:boolean;

  constructor(private route:ActivatedRoute,
              private router:Router,
              private lawsService:LawsService,
              private exportLawService:ExportLawService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.law=null;
    this.columns=[];
    this.loaded=true;
    this.loadedLawChanges=true;
    this.loadedComments=true;
    this.loadedRatings=true;
    this.loadedZip=true;
  }

  ngOnInit() {
    this.route_sub=this.route.params.subscribe(params=>{
      this.lawsService.getLaw(+params['id']).subscribe((law: Law)=>{
        this.law=law;
        this.exportLawService.lawLoaded(law);
      });
    });
    this.columns=this.exportLawService.selectedColumns;
    this.exportLawService.exportLawChanges$.subscribe(
      (exportData: boolean)=>this.exportLawChanges=exportData
    );
    this.exportLawService.exportComments$.subscribe(
      (exportData: boolean)=>this.exportComments=exportData
    );
    this.exportLawService.exportRatings$.subscribe(
      (exportData: boolean)=>this.exportRatings=exportData
    );
    this.exportLawService.downloadZipped$.subscribe(
      (exportData: boolean)=>this.zipped=exportData
    );
    this.exportLawService.exportLawChanges_comments$.subscribe(
      (exportData: boolean)=>this.exportLawChanges_comments=exportData
    );
    this.exportLawService.exportLawChanges_ratings$.subscribe(
      (exportData: boolean)=>this.exportLawChanges_ratings=exportData
    );
  }

  ngOnDestroy() {
    this.route_sub.unsubscribe();
  }

  changeZipped(){
    this.exportLawService.downloadZipped.next(!this.zipped);
  }

  downloadZippedBlob(){
    this.loadedZip=false;
    this.exportLawService.getLawCSVZipped().subscribe(x=>{
      const file = new Blob([x], {type: 'application/octet-stream'});
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file);
        return;
      }
      const data=window.URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href=data;
      link.download="Paragraph"+this.law.gesetzes_id+".zip";
      link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

      setTimeout(function () {
        window.URL.revokeObjectURL(data);
      }, 100);
      this.loadedZip=true;
    });
  }

  downloadBlob(){
    this.loaded=false;
    this.exportLawService.getLawCSV().subscribe(x=>{
      const file = new Blob([x], {type: 'text/csv'});
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file);
        return;
      }
      const data=window.URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href=data;
      link.download="Paragraph"+this.law.gesetzes_id+".csv";
      link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

      setTimeout(function () {
        window.URL.revokeObjectURL(data);
      }, 100);
      this.loaded=true;
    });
    if (this.exportLawChanges) {
      this.loadedLawChanges=false;
      this.exportLawService.getLawChangesCSV().subscribe(x=>{
        const file = new Blob([x], {type: 'text/csv'});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }
        const data=window.URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href=data;
        link.download="Paragraph"+this.law.gesetzes_id+"_Änderungsvorschläge.csv";
        link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

        setTimeout(function () {
          window.URL.revokeObjectURL(data);
        }, 100);
        this.loadedLawChanges=true;
      });
    }
    if (this.exportComments || (this.exportLawChanges_comments&&this.exportLawChanges)) {
      this.loadedComments=false;
      this.exportLawService.getCommentsCSV().subscribe(x=>{
        const file = new Blob([x], {type: 'text/csv'});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }
        const data=window.URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href=data;
        link.download="Paragraph"+this.law.gesetzes_id+"_Kommentare.csv";
        link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

        setTimeout(function () {
          window.URL.revokeObjectURL(data);
        }, 100);
        this.loadedComments=true;
      });
    }
    if (this.exportRatings || (this.exportLawChanges_ratings&&this.exportLawChanges)) {
      this.loadedRatings=false;
      this.exportLawService.getRatingsCSV().subscribe(x=>{
        const file = new Blob([x], {type: 'text/csv'});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }
        const data=window.URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href=data;
        link.download="Paragraph"+this.law.gesetzes_id+"_Ratings.csv";
        link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

        setTimeout(function () {
          window.URL.revokeObjectURL(data);
        }, 100);
        this.loadedRatings=true;
      });
    }
  }

}

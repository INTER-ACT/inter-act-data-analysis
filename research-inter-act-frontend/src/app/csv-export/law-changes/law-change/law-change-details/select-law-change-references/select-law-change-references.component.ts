import {Component, Input, OnInit} from '@angular/core';
import {LawChange} from '../../law-change';
import {ExportLawChangeService} from '../export-law-change.service';

@Component({
  selector: 'app-select-law-change-references',
  templateUrl: './select-law-change-references.component.html',
  styleUrls: ['./select-law-change-references.component.css']
})
export class SelectLawChangeReferencesComponent implements OnInit {

  @Input("lawChange")lawChange:LawChange;
  exportLawChanges: boolean;
  exportAllLawChanges: boolean;
  exportComments: boolean;
  exportLawChanges_comments: boolean;
  exportRatings: boolean;
  exportLawChanges_ratings: boolean;
  exportReference:boolean;
  zipped:boolean;

  constructor(private exportLawChangeService:ExportLawChangeService) { }

  ngOnInit() {
    this.exportLawChangeService.exportLawChanges$.subscribe(
      (exportData:boolean)=>this.exportLawChanges=exportData
    );
    this.exportLawChangeService.exportAllLawChanges$.subscribe(
      (exportData: boolean)=>this.exportAllLawChanges=exportData
    );
    this.exportLawChangeService.exportComments$.subscribe(
      (exportData: boolean)=>this.exportComments=exportData
    );
    this.exportLawChangeService.exportLawChanges_comments.subscribe(
      (exportData: boolean)=>this.exportLawChanges_comments=exportData
    );
    this.exportLawChangeService.exportRatings$.subscribe(
      (exportData: boolean)=>this.exportRatings=exportData
    );
    this.exportLawChangeService.exportLawChanges_ratings$.subscribe(
      (exportData: boolean)=>this.exportLawChanges_ratings=exportData
    );
    this.exportLawChangeService.exportReference$.subscribe(
      (exportData: boolean)=>this.exportReference=exportData
    );
    this.exportLawChangeService.downloadZipped$.subscribe(
      (downloadZipped: boolean)=>this.zipped=downloadZipped
    );
  }

  changeExportLawChanges(){
    this.exportLawChangeService.exportLawChanges.next(!this.exportLawChanges);
    this.changeZipped();
  }
  setExportAllLawChanges(value:boolean) {
    this.exportLawChangeService.exportAllLawChanges.next(value);
  }
  changeExportComments(){
    this.exportLawChangeService.exportComments.next(!this.exportComments);
    this.changeZipped();
  }
  setExportLawChanges_comments(value:boolean){
    this.exportLawChangeService.exportLawChanges_comments.next(value);
  }
  changeExportRatings(){
    this.exportLawChangeService.exportRatings.next(!this.exportRatings);
    this.changeZipped();
  }
  setExportLawChanges_ratings(value:boolean){
    this.exportLawChangeService.exportLawChanges_ratings.next(value);
  }
  changeExportReference(){
    this.exportLawChangeService.exportReference.next(!this.exportReference);
    this.changeZipped();
  }
  changeZipped(){
    if (!this.exportLawChanges && !this.exportComments && !this.exportRatings && !this.exportReference)
      this.exportLawChangeService.downloadZipped.next(false);
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {Law} from '../../law';
import {ExportLawService} from '../export-law.service';
import {ProviderMeta} from '@angular/compiler';
import {reject} from 'q';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-select-law-references',
  templateUrl: './select-law-references.component.html',
  styleUrls: ['./select-law-references.component.css']
})
export class SelectLawReferencesComponent implements OnInit {

  @Input("law")law:Law;
  exportLawChanges: boolean;
  exportAllLawChanges: boolean;
  exportComments: boolean;
  exportLawChanges_comments: boolean;
  exportRatings: boolean;
  exportLawChanges_ratings: boolean;
  zipped:boolean;

  constructor(private exportLawService: ExportLawService) {
  }

  ngOnInit() {
    this.exportLawService.exportLawChanges$.subscribe(
      (exportData:boolean)=>this.exportLawChanges=exportData
    );
    this.exportLawService.exportAllLawChanges$.subscribe(
      (exportData: boolean)=>this.exportAllLawChanges=exportData
    );
    this.exportLawService.exportComments$.subscribe(
      (exportData: boolean)=>this.exportComments=exportData
    );
    this.exportLawService.exportLawChanges_comments.subscribe(
      (exportData: boolean)=>this.exportLawChanges_comments=exportData
    );
    this.exportLawService.exportRatings$.subscribe(
      (exportData: boolean)=>this.exportRatings=exportData
    );
    this.exportLawService.exportLawChanges_ratings$.subscribe(
      (exportData: boolean)=>this.exportLawChanges_ratings=exportData
    );
    this.exportLawService.downloadZipped$.subscribe(
      (downloadZipped: boolean)=>this.zipped=downloadZipped
    );
  }

  changeExportLawChanges(){
    this.exportLawService.exportLawChanges.next(!this.exportLawChanges);
    this.changeZipped();
  }
  setExportAllLawChanges(value:boolean) {
    this.exportLawService.exportAllLawChanges.next(value);
  }
  changeExportComments(){
    this.exportLawService.exportComments.next(!this.exportComments);
    this.changeZipped();
  }
  setExportLawChanges_comments(value:boolean){
    this.exportLawService.exportLawChanges_comments.next(value);
  }
  changeExportRatings(){
    this.exportLawService.exportRatings.next(!this.exportRatings);
    this.changeZipped();
  }
  setExportLawChanges_ratings(value:boolean){
    this.exportLawService.exportLawChanges_ratings.next(value);
  }
  changeZipped(){
    if (!this.exportLawChanges && !this.exportComments && !this.exportRatings)
      this.exportLawService.downloadZipped.next(false);
  }

}

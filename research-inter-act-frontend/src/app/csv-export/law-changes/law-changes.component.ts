import {Component, ElementRef, OnInit} from '@angular/core';
import {LawChange} from './law-change/law-change';
import {LawChangesService} from './law-changes.service';


@Component({
  selector: 'app-law-changes',
  templateUrl: './law-changes.component.html',
  styleUrls: ['./law-changes.component.css']
})
export class LawChangesComponent implements OnInit {

  sortList: string[]=["Paragraphen","ID","Konversationsrate"];
  sort: number=0;
  filter: string;
  lawChanges: LawChange[];
  loadedCSV: boolean;
  loaded: boolean;

  constructor(private lawChangesService:LawChangesService) {
    this.filter="";
    this.lawChanges=[];
    this.loaded=true;
    this.loadedCSV=true;
  }

  ngOnInit():void {
    this.loaded=false;
    this.lawChangesService.getLawChanges().subscribe((lawChanges: LawChange[])=>{
      this.lawChanges=lawChanges;
      this.loaded=true;
    });
  }

  getMaxConversationRate():number{
    return Math.max.apply(Math, this.lawChanges.map(function(l) { return l.conversationRate; }));
  }
  round(number: number): number{
    return Math.round(number);
  }

  downloadCSV() :void{
    this.loadedCSV=false;
    this.lawChangesService.getLawChangesCSV().subscribe(x=>{
      const file = new Blob([x], {type: 'text/csv'});
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file);
        return;
      }
      const data=window.URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href=data;
      link.download="Änderungsvorschläge.csv";
      link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

      setTimeout(function () {
        window.URL.revokeObjectURL(data);
      }, 100);
      this.loadedCSV=true;
    });
  }
}

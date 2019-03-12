import {Component, ElementRef, NgZone, OnInit} from '@angular/core';
import {LawsService} from './laws.service';
import {Law} from './law/law';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-laws',
  templateUrl: './laws.component.html',
  styleUrls: ['./laws.component.css']
})
export class LawsComponent implements OnInit {

  sortList: string[]=["Paragraphen","ID","Konversationsrate"];
  sort: number=0;
  filter: string;
  laws: Law[];
  loadedCSV: boolean;
  loaded: boolean;

  constructor(private lawsService:LawsService) {
    this.filter="";
    this.laws=[];
    this.loaded=true;
    this.loadedCSV=true;
  }

  ngOnInit():void {
    this.loaded=false;
    this.lawsService.getLaws().subscribe((laws: Law[])=>{
      this.laws=laws;
      this.loaded=true;
    });
  }

  getMaxConversationRate():number{
  return Math.max.apply(Math, this.laws.map(function(l) { return l.conversationRate; }));
}
  round(number: number): number{
    return Math.round(number);
  }

  downloadCSV() :void{
    this.loadedCSV=false;
    this.lawsService.getLawsCSV().subscribe(x=>{
      const file = new Blob([x], {type: 'text/csv'});
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file);
        return;
      }
      const data=window.URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href=data;
      link.download="Paragraphen.csv";
      link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

      setTimeout(function () {
        window.URL.revokeObjectURL(data);
      }, 100);
      this.loadedCSV=true;
    });
  }
}

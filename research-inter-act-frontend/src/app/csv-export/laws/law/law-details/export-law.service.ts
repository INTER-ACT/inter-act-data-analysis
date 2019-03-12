import { Injectable } from '@angular/core';
import {Comment} from '../../../comments/comment/comment';
import {HttpClient} from '@angular/common/http';
import {Law} from '../law';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';

@Injectable()
export class ExportLawService {

  selectedColumns: string[];
  deselectedColumns: string[];
  law: Law;

  exportLawChanges:BehaviorSubject<boolean>=new BehaviorSubject(false);
  exportLawChanges$=this.exportLawChanges.asObservable();

  exportAllLawChanges:BehaviorSubject<boolean>=new BehaviorSubject(false);
  exportAllLawChanges$=this.exportAllLawChanges.asObservable();

  exportComments:BehaviorSubject<boolean>=new BehaviorSubject(false);
  exportComments$=this.exportComments.asObservable();

  exportLawChanges_comments:BehaviorSubject<boolean>=new BehaviorSubject(false);
  exportLawChanges_comments$=this.exportLawChanges_comments.asObservable();

  exportRatings:BehaviorSubject<boolean>=new BehaviorSubject(false);
  exportRatings$=this.exportRatings.asObservable();

  exportLawChanges_ratings:BehaviorSubject<boolean>=new BehaviorSubject(false);
  exportLawChanges_ratings$=this.exportLawChanges_ratings.asObservable();

  downloadZipped:BehaviorSubject<boolean>=new BehaviorSubject(false);
  downloadZipped$=this.downloadZipped.asObservable();

  constructor(private http:HttpClient) {
    this.selectedColumns = [];
    this.deselectedColumns = [];
  }

  lawLoaded(law: Law):void {
    this.law = law;
    this.selectedColumns.push('Gesetzes_id');
    this.selectedColumns.push('Gesetz');
    this.selectedColumns.push('Paragraph');
    if (this.law.titel!="")
    this.selectedColumns.push('Titel');
    this.selectedColumns.push('Gesetzestext');
    if (this.law.erklaerung!="")
    this.selectedColumns.push('Erklärung');
    if (this.law.bgbl!="")
    this.selectedColumns.push('Bundesgesetzblatt');
    if (this.law.aenderungen_id!=null && this.law.aenderungen_id.length > 0)
      this.deselectedColumns.push('Änderungen_id');
    if (this.law.ratings_id!=null && this.law.ratings_id.length > 0)
      this.deselectedColumns.push('Ratings_id');
    if (this.law.kommentare_id!=null && this.law.kommentare_id.length > 0)
      this.deselectedColumns.push('Kommentare_id');
    if (this.law.tags!=null && this.law.tags.length > 0)
      this.deselectedColumns.push('Tags');
    if (this.law.originaltext!=null)
      this.selectedColumns.push('Originaltext');
    if (this.law.datum!=null)
      this.selectedColumns.push('Datum');
    if (this.law.user_id!=null)
      this.selectedColumns.push('User_id');
  }

  getLawCSVZipped():Observable<Blob> {
    return this.http.get(environment.apiURL+"gesetz/"+this.law.gesetzes_id+"/csv"+this.buildParamsStringZip(),
      {responseType: 'blob',headers: environment.headersCSV});
  }

  getLawCSV():Observable<Blob> {
    return this.http.get(environment.apiURL+"gesetz/"+this.law.gesetzes_id+"/csv"+this.buildParamsString(),
      {responseType: 'blob',headers: environment.headersCSV});
  }

  getLawChangesCSV():Observable<Blob>{
    let params: string =this.exportAllLawChanges.getValue()?"":"?direkte";
    return this.http.get(environment.apiURL+"gesetz/"+this.law.gesetzes_id+"/aenderungen/csv"+params,
      {responseType: 'blob',headers: environment.headersCSV});
  }

  getCommentsCSV():Observable<Blob>{
    let params: string="";
    if (this.exportLawChanges.getValue())
      if (this.exportLawChanges_comments.getValue()) {
        if (this.exportAllLawChanges.getValue())
          params="?alle";
        else
          params="?direkte"
        if (!this.exportComments.getValue())
          params+="&nur-aenderungen";
          }
    return this.http.get(environment.apiURL+"gesetz/"+this.law.gesetzes_id+"/kommentare/csv"+params,
      {responseType: 'blob',headers: environment.headersCSV});
  }

  getRatingsCSV():Observable<Blob>{
    let params: string="";
    if (this.exportLawChanges.getValue())
      if (this.exportLawChanges_ratings.getValue()) {
        if (this.exportAllLawChanges.getValue())
          params="?alle";
        else
          params="?direkte"
        if (!this.exportRatings.getValue())
          params+="&nur-aenderungen";
      }
    return this.http.get(environment.apiURL+"gesetz/"+this.law.gesetzes_id+"/ratings/csv"+params,
      {responseType: 'blob',headers: environment.headersCSV});
  }


  buildParamsStringZip():string{
    let returnstring: string =this.buildParamsString();
    if (this.exportLawChanges.getValue()){
      if (this.exportAllLawChanges.getValue())
      returnstring+="&"+'aenderungen=alle';
      else
        returnstring+="&"+'aenderungen=direkte';
      if (this.exportLawChanges_comments.getValue())
        returnstring+="&"+'aenderungen_kommentare';
      if (this.exportLawChanges_ratings.getValue())
        returnstring+="&"+'aenderungen_ratings';
    }
    if (this.exportComments.getValue())
      returnstring+="&"+'kommentare';
    if (this.exportRatings.getValue())
      returnstring+="&"+'ratings';
    return returnstring;
  }

  buildParamsString():string{
    let returnString: string="";
    if (this.selectedColumns.length > 0)
      returnString+="?";
    for (let i = 0; i < this.selectedColumns.length; i++) {
      if (this.selectedColumns[i] === 'Gesetzes_id')
        returnString+="gesetzesid";
      else if (this.selectedColumns[i] === 'Gesetz')
        returnString+="gesetz";
      else if (this.selectedColumns[i] === 'Paragraph')
        returnString+="paragraph";
      else if (this.selectedColumns[i] === 'Titel')
        returnString+="titel";
      else if (this.selectedColumns[i] === 'Gesetzestext')
        returnString+="gesetzestext";
      else if (this.selectedColumns[i] === 'Bundesgesetzblatt')
        returnString+="bgbl";
      else if (this.selectedColumns[i] === 'Änderungen_id')
        returnString+="aenderungenid";
      else if (this.selectedColumns[i] === 'Kommentare_id')
        returnString+="kommentareid";
      else if (this.selectedColumns[i] === 'Ratings_id')
        returnString+="ratingsid";
      else if (this.selectedColumns[i] === 'Tags')
        returnString+="tags";
      else if (this.selectedColumns[i] === 'Originaltext')
        returnString+="originaltext";
      else if (this.selectedColumns[i] === 'User_id')
        returnString+="userid";
      else if (this.selectedColumns[i] === 'Datum')
        returnString+="datum";
      if (i != this.selectedColumns.length - 1)
        returnString+="&";
    }
    return returnString;
  }


  spliceSelectedColumns(column: string){
    this.selectedColumns.forEach( (item, index) => {
      if(item === column) this.selectedColumns.splice(index,1);
    });
    this.deselectedColumns.push(column);
  }

  spliceDeSelectedColumns(column: string){
    this.deselectedColumns.forEach( (item, index) => {
      if(item === column) this.deselectedColumns.splice(index,1);
    });
    this.selectedColumns.push(column);
  }

}

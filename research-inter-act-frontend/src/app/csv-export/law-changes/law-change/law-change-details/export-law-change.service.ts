import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LawChange} from '../law-change';
import {environment} from '../../../../../environments/environment';

@Injectable()
export class ExportLawChangeService {

  selectedColumns: string[];
  deselectedColumns: string[];
  lawChange: LawChange;

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

  exportReference:BehaviorSubject<boolean>=new BehaviorSubject(false);
  exportReference$=this.exportReference.asObservable();

  downloadZipped:BehaviorSubject<boolean>=new BehaviorSubject(false);
  downloadZipped$=this.downloadZipped.asObservable();

  constructor(private http:HttpClient) {
    this.selectedColumns = [];
    this.deselectedColumns = [];
  }

  lawChangeLoaded(lawChange: LawChange):void {
    this.lawChange = lawChange;
    this.selectedColumns.push('Änderungs_id');
    this.selectedColumns.push('Gesetzes_id');
    this.selectedColumns.push('User_id');
    if (this.lawChange.titel_neu!="")
      this.selectedColumns.push('Titel_neu');
    if (this.lawChange.gesetzestext_neu!="")
    this.selectedColumns.push('Gesetzestext_neu');
    if (this.lawChange.begruendung!="")
      this.selectedColumns.push('Begründung');
    this.selectedColumns.push("Referenz");
    this.selectedColumns.push("Änderungs_Bezugs_id");
    this.selectedColumns.push("Datum");
    if (this.lawChange.aenderungen_id!=null && this.lawChange.aenderungen_id.length > 0)
      this.deselectedColumns.push('Änderungen_id');
    if (this.lawChange.ratings_id!=null && this.lawChange.ratings_id.length > 0)
      this.deselectedColumns.push('Ratings_id');
    if (this.lawChange.kommentare_id!=null && this.lawChange.kommentare_id.length > 0)
      this.deselectedColumns.push('Kommentare_id');
    if (this.lawChange.tags!=null && this.lawChange.tags.length > 0)
      this.deselectedColumns.push('Tags');
  }

  getLawChangeCSVZipped():Observable<Blob> {
    return this.http.get(environment.apiURL+"aenderung/"+this.lawChange.aenderungs_id+"/csv"+this.buildParamsStringZip(),
      {responseType: 'blob',headers: environment.headersCSV});
  }

  getLawChangeCSV():Observable<Blob> {
    return this.http.get(environment.apiURL+"aenderung/"+this.lawChange.aenderungs_id+"/csv"+this.buildParamsString(),
      {responseType: 'blob',headers: environment.headersCSV});
  }

  getLawChangesCSV():Observable<Blob>{
    let params: string =this.exportAllLawChanges.getValue()?"":"?direkte";
    return this.http.get(environment.apiURL+"aenderung/"+this.lawChange.aenderungs_id+"/aenderungen/csv"+params,
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
    return this.http.get(environment.apiURL+"aenderung/"+this.lawChange.aenderungs_id+"/kommentare/csv"+params,
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
    return this.http.get(environment.apiURL+"aenderung/"+this.lawChange.aenderungs_id+"/ratings/csv"+params,
      {responseType: 'blob',headers: environment.headersCSV});
  }

  getReferenceCSV():Observable<Blob> {
    return this.http.get(environment.apiURL+"aenderung/"+this.lawChange.aenderungs_id+"/referenz/csv"+this.buildParamsString(),
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
    if (this.exportReference.getValue())
      returnstring+="&"+'bezugs_element';
    return returnstring;
  }

  buildParamsString():string{
    let returnString: string="";
    if (this.selectedColumns.length > 0)
      returnString+="?";
    for (let i = 0; i < this.selectedColumns.length; i++) {
      if (this.selectedColumns[i] === 'Änderungs_id')
        returnString+="aenderungid";
      else if (this.selectedColumns[i] === 'User_id')
        returnString+="userid";
      else if (this.selectedColumns[i] === 'Titel_neu')
        returnString+="titel_neu";
      else if (this.selectedColumns[i] === 'Gesetzestext_neu')
        returnString+="gesetzestext_neu";
      else if (this.selectedColumns[i] === 'Begründung')
        returnString+="begruendung";
      else if (this.selectedColumns[i] === 'Referenz')
        returnString+="referenz";
      else if (this.selectedColumns[i] === 'Änderungs_Bezugs_id')
        returnString+="aenderungs_bezugs_id";
      else if (this.selectedColumns[i] === 'Datum')
        returnString+="datum";
      else if (this.selectedColumns[i] === 'Änderungen_id')
        returnString+="aenderungenid";
      else if (this.selectedColumns[i] === 'Kommentare_id')
        returnString+="kommentareid";
      else if (this.selectedColumns[i] === 'Ratings_id')
        returnString+="ratingsid";
      else if (this.selectedColumns[i] === 'Tags')
        returnString+="tags";
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

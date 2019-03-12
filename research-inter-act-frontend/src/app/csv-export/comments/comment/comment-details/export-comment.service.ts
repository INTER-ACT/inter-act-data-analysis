import {EventEmitter, Injectable} from '@angular/core';
import {Comment} from '../comment';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {forEach} from '@angular/router/src/utils/collection';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ExportCommentService {

  selectedColumns: string[];
  deselectedColumns: string[];
  comment: Comment;

  exportReference:BehaviorSubject<boolean>=new BehaviorSubject(false);
  exportReference$=this.exportReference.asObservable();

  exportSubcomments:BehaviorSubject<boolean>=new BehaviorSubject(false);
  exportSubcomments$=this.exportSubcomments.asObservable();

  downloadZipped:BehaviorSubject<boolean>=new BehaviorSubject(false);
  downloadZipped$=this.downloadZipped.asObservable();

  constructor(private http:HttpClient) {
    this.selectedColumns = [];
    this.deselectedColumns = [];
  }


  commentLoaded(comment: Comment):void {
    this.comment = comment;
    this.selectedColumns.push('Kommentar_id');
    this.selectedColumns.push('User_id');
    this.selectedColumns.push('Referenz');
    this.selectedColumns.push('Kommentar_Bezugs_id');
    this.selectedColumns.push('Kommentar');
    this.selectedColumns.push('Likes');
    this.selectedColumns.push('Datum');
    if (this.comment.kommentare_id!=null && this.comment.kommentare_id.length > 0)
      this.deselectedColumns.push('Kommentare_id');
    if (this.comment.tags!=null && this.comment.tags.length > 0)
      this.deselectedColumns.push('Tags');
  }

  getCommentCSVZipped():Observable<Blob> {
    return this.http.get(environment.apiURL+"kommentar/"+this.comment.kommentar_id+"/csv"+this.buildParamsStringZip(),
      {responseType: 'blob',headers: environment.headersCSV});
  }

  getCommentCSV():Observable<Blob> {
    return this.http.get(environment.apiURL+"kommentar/"+this.comment.kommentar_id+"/csv"+this.buildParamsString(),
      {responseType: 'blob',headers: environment.headersCSV});
  }

  getSubCommentsCSV():Observable<Blob>{
    return this.http.get(environment.apiURL+"kommentar/"+this.comment.kommentar_id+"/kommentare/csv",
      {responseType: 'blob',headers: environment.headersCSV});
  }

  getCommentReferenceCSV():Observable<Blob>{
    return this.http.get(environment.apiURL+"kommentar/"+this.comment.kommentar_id+"/referenz/csv",
      {responseType: 'blob',headers: environment.headersCSV});
  }

  buildParamsStringZip():string{
    let returnstring: string =this.buildParamsString();
    if (this.exportReference.getValue())
    returnstring+="&"+'bezugs_element';
    if (this.exportSubcomments.getValue())
      returnstring+="&"+'kommentare';
    return returnstring;
  }

  buildParamsString():string{
    let returnString: string="";
    if (this.selectedColumns.length > 0)
      returnString+="?";
    for (let i = 0; i < this.selectedColumns.length; i++) {
      if (this.selectedColumns[i] === 'Kommentar_id')
        returnString+="kommentarid";
      else if (this.selectedColumns[i] === 'User_id')
        returnString+="userid";
      else if (this.selectedColumns[i] === 'Referenz')
        returnString+="referenz";
      else if (this.selectedColumns[i] === 'Kommentar_Bezugs_id')
        returnString+="kommentar_bezugs_id";
      else if (this.selectedColumns[i] === 'Kommentar')
        returnString+="kommentar";
      else if (this.selectedColumns[i] === 'Likes')
        returnString+="likes";
      else if (this.selectedColumns[i] === 'Kommentare_id')
        returnString+="kommentareid";
      else if (this.selectedColumns[i] === 'Tags')
        returnString+="tags";
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

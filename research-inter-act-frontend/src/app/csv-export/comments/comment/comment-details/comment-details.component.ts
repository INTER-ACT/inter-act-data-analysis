import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Comment} from '../comment';
import {ActivatedRoute, Router} from '@angular/router';
import {CommentsService} from '../../comments.service';
import {ExportCommentService} from './export-comment.service';

@Component({
  selector: 'app-comment-details',
  templateUrl: './comment-details.component.html',
  styleUrls: ['./comment-details.component.css'],
  providers:[ExportCommentService]
})
export class CommentDetailsComponent implements OnInit,OnDestroy {

  comment: Comment;
  private route_sub:any;
  columns: string[];
  loaded: boolean;
  loadedSubComments:boolean;
  loadedReference:boolean;
  loadedZip:boolean;
  zipped: boolean;
  exportReference:boolean;
  exportSubcomments: boolean;

  constructor(private route:ActivatedRoute,
              private router:Router,
              private commentsService:CommentsService,
              private exportCommentService: ExportCommentService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.comment=null;
    this.columns=[];
    this.loaded=true;
    this.loadedSubComments=true;
    this.loadedReference=true;
    this.loadedZip=true;
  }

  ngOnInit() {
    this.route_sub=this.route.params.subscribe(params=>{
      this.commentsService.getComment(+params['id']).subscribe((comment: Comment)=>{
        this.comment=comment;
        this.exportCommentService.commentLoaded(comment);
      });
    });
    this.columns=this.exportCommentService.selectedColumns;
    this.exportCommentService.exportReference$.subscribe(
      (exportReference: boolean)=>this.exportReference=exportReference
    );
    this.exportCommentService.exportSubcomments$.subscribe(
      (exportSubcomments: boolean)=>this.exportSubcomments=exportSubcomments
    );
    this.exportCommentService.downloadZipped$.subscribe(
      (downloadZipped: boolean)=>this.zipped=downloadZipped
    );
  }

  ngOnDestroy() {
    this.route_sub.unsubscribe();
  }

  changeZipped(){
    this.exportCommentService.downloadZipped.next(!this.zipped);
  }

  downloadZippedBlob(){
    this.loadedZip=false;
    this.exportCommentService.getCommentCSVZipped().subscribe(x=>{
      const file = new Blob([x], {type: 'application/octet-stream'});
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file);
        return;
      }
      const data=window.URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href=data;
      link.download="Kommentar"+this.comment.kommentar_id+".zip";
      link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

      setTimeout(function () {
        window.URL.revokeObjectURL(data);
      }, 100);
      this.loadedZip=true;
    });
  }

  downloadBlob(){
    this.loaded=false;
    this.exportCommentService.getCommentCSV().subscribe(x=>{
      const file = new Blob([x], {type: 'text/csv'});
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file);
        return;
      }
      const data=window.URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href=data;
      link.download="Kommentar"+this.comment.kommentar_id+".csv";
      link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

      setTimeout(function () {
        window.URL.revokeObjectURL(data);
      }, 100);
      this.loaded=true;
    });
    if (this.exportSubcomments) {
      this.loadedSubComments=false;
      this.exportCommentService.getSubCommentsCSV().subscribe(x=>{
        const file = new Blob([x], {type: 'text/csv'});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }
        const data=window.URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href=data;
        link.download="Kommentar"+this.comment.kommentar_id+"_Kommentare.csv";
        link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

        setTimeout(function () {
          window.URL.revokeObjectURL(data);
        }, 100);
        this.loadedSubComments=true;
      });
    }
    if (this.exportReference) {
      this.loadedReference=false;
      this.exportCommentService.getCommentReferenceCSV().subscribe(x=>{
        const file = new Blob([x], {type: 'text/csv'});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }
        const data=window.URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href=data;
        if (this.comment.typ === 'k')
          link.download="Kommentar"+this.comment.kommentar_id+"_Referenz_Kommentar"+this.comment.kommentar_bezugs_id+".csv";
        else if (this.comment.typ === 'k')
          link.download="Kommentar"+this.comment.kommentar_id+"_Referenz_Paragraph"+this.comment.kommentar_bezugs_id+".csv";
        else
          link.download="Kommentar"+this.comment.kommentar_id+"_Referenz_Änderungsvorschlag"+this.comment.kommentar_bezugs_id+".csv";
        link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

        setTimeout(function () {
          window.URL.revokeObjectURL(data);
        }, 100);
        this.loadedReference=true;
      });
    }
  }

}

import { Component, OnInit } from '@angular/core';
import {CommentsService} from './comments.service';
import {Comment} from './comment/comment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  comments: Comment[];
  filter_id: number;
  loadedCSV: boolean;
  loaded: boolean;

  constructor(private commentsService: CommentsService) {
    this.comments=[];
    this.filter_id=null;
    this.loadedCSV=true;
    this.loaded=true;
  }

  ngOnInit() {
    this.loaded=false;
    this.commentsService.getComments().subscribe((comments: Comment[])=>{
      this.comments=comments;
      this.loaded=true;
    });
  }

  downloadCSV() {
    this.loadedCSV=false;
    this.commentsService.getCommentsCSV().subscribe(x=>{
      const file = new Blob([x], {type: 'text/csv'});
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file);
        return;
      }
      const data=window.URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href=data;
      link.download="Kommentare.csv";
      link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

      setTimeout(function () {
        window.URL.revokeObjectURL(data);
      }, 100);
      this.loadedCSV=true;
    });
  }
}

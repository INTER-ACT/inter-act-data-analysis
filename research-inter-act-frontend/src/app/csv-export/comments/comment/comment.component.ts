import {Component, Input, OnInit} from '@angular/core';
import {Comment} from './comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input("comment") comment: Comment;
  referenceText: string;

  constructor() {
    if (this.comment!=null) {
      if (this.comment.typ == 'k')
        this.referenceText = "Kommentar mit ID " + this.comment.kommentar_bezugs_id;
      else if (this.comment.typ == 'g')
        this.referenceText = "Gesetz mit ID " + this.comment.kommentar_bezugs_id;
      else
        this.referenceText = "Änderungsvorschlag mit ID " + this.comment.kommentar_bezugs_id;
    }
  }

  ngOnInit() {
  }

}

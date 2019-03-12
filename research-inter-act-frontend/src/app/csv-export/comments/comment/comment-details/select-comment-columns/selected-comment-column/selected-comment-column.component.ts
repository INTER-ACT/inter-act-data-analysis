import {Component, Input, OnInit} from '@angular/core';
import {ExportCommentService} from '../../export-comment.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-selected-comment-column',
  templateUrl: './selected-comment-column.component.html',
  styleUrls: ['./selected-comment-column.component.css']
})
export class SelectedCommentColumnComponent implements OnInit {

  @Input("column") column: string;

  constructor(public selectCommentColumnsService: ExportCommentService) {
    this.column="";
  }

  ngOnInit() {
  }

}

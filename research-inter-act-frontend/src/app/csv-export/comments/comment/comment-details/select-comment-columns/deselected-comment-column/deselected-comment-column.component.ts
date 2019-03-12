import {Component, Input, OnInit} from '@angular/core';
import {ExportCommentService} from '../../export-comment.service';

@Component({
  selector: 'app-deselected-comment-column',
  templateUrl: './deselected-comment-column.component.html',
  styleUrls: ['./deselected-comment-column.component.css']
})
export class DeselectedCommentColumnComponent implements OnInit {

  @Input("column") column: string;

  constructor(public selectCommentColumnsService: ExportCommentService) {
    this.column="";
  }

  ngOnInit() {
  }

}

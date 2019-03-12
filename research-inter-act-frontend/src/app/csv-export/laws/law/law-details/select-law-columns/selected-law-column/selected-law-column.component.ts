import {Component, Input, OnInit} from '@angular/core';
import {ExportCommentService} from '../../../../../comments/comment/comment-details/export-comment.service';
import {ExportLawService} from '../../export-law.service';

@Component({
  selector: 'app-selected-law-column',
  templateUrl: './selected-law-column.component.html',
  styleUrls: ['./selected-law-column.component.css']
})
export class SelectedLawColumnComponent implements OnInit {

  @Input("column") column: string;

  constructor(public exportLawService: ExportLawService) {
    this.column="";
  }

  ngOnInit() {
  }

}

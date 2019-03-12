import {Component, Input, OnInit} from '@angular/core';
import {Comment} from '../../comment';
import {ExportCommentService} from '../export-comment.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {getAllDebugNodes} from '@angular/core/src/debug/debug_node';

@Component({
  selector: 'app-select-comment-table',
  templateUrl: './select-comment-table.component.html',
  styleUrls: ['./select-comment-table.component.css']
})
export class SelectCommentTableComponent implements OnInit {

  @Input("comment") comment: Comment;
  columns: string[];
  showMore: boolean;
  commentDisplayLength: number;

  constructor(private exportCommentService: ExportCommentService) {
    this.showMore=false;
    this.commentDisplayLength=100;
  }

  ngOnInit() {
    this.columns=this.exportCommentService.selectedColumns;
  }

  contains(checkColumn: string):boolean{
    for (let column of this.columns)
      if (column===checkColumn)
        return true;
    return false
  }

  emptyColumnContains(checkColumn: string):boolean{
    return ((this.contains('Kommentare_id')&&this.comment.kommentare_id.length>1)||(this.contains('Tags')
      &&this.comment.tags.length>1))&&this.contains(checkColumn);
  }

  collectionContains(checkColumn: string,count:number){
    if (checkColumn == 'Kommentare_id')
      return this.contains('Kommentare_id') && count<this.comment.kommentare_id.length;
    if (checkColumn == 'Tags')
      return this.contains('Tags')&& count<this.comment.tags.length;
    return false;
  }

  emptyCollectionContains(checkColumn: string,count:number){
    if (checkColumn == 'Kommentare_id')
      return this.contains('Kommentare_id') && count>=this.comment.kommentare_id.length && this.contains('Tags');
    if (checkColumn == 'Tags')
      return this.contains('Tags')&& count>=this.comment.tags.length && this.contains('Kommentare_id');
    return false;
  }



  getRowCount():number{
    if (this.comment.kommentare_id != null && this.contains('Kommentare_id'))
    if ((this.comment.kommentare_id.length >= this.comment.tags.length)||!this.contains("Tags"))
      return this.comment.kommentare_id.length;
    else if(this.comment.tags!=null&&this.contains("Tags"))
      if ((this.comment.tags.length >= this.comment.kommentare_id.length)||!this.contains("Kommentare_id"))
      return this.comment.tags.length;
    return 0;
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {ExportCommentService} from '../export-comment.service';
import {Comment} from '../../comment';

@Component({
  selector: 'app-select-comment-references',
  templateUrl: './select-comment-references.component.html',
  styleUrls: ['./select-comment-references.component.css']
})
export class SelectCommentReferencesComponent implements OnInit {

  exportSubcomments: boolean;
  exportReference: boolean;
  zipped:boolean;
  @Input("comment")comment: Comment;

  constructor(private exportCommentService: ExportCommentService) {
    this.comment=null;
  }

  ngOnInit() {
    this.exportCommentService.exportReference$.subscribe(
      (exportReference:boolean)=>this.exportReference=exportReference
    );
    this.exportCommentService.exportSubcomments$.subscribe(
      (exportSubcomments: boolean)=>this.exportSubcomments=exportSubcomments
    );
    this.exportCommentService.downloadZipped$.subscribe(
      (downloadZipped: boolean)=>this.zipped=downloadZipped
    );
  }

  changeExportSubcomments(){
   this.exportCommentService.exportSubcomments.next(!this.exportSubcomments);
    this.changeZipped();
  }

  changeExportReference(){
    this.exportCommentService.exportReference.next(!this.exportReference);
    this.changeZipped();
  }
  changeZipped(){
    if (!this.exportSubcomments && !this.exportReference)
      this.exportCommentService.downloadZipped.next(false);
  }

}

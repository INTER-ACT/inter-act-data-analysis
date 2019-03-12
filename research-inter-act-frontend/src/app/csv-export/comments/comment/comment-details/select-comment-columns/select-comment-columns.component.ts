import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Output} from '@angular/core';
import {Comment} from '../../comment';
import {ExportCommentService} from '../export-comment.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-select-comment-columns',
  templateUrl: './select-comment-columns.component.html',
  styleUrls: ['./select-comment-columns.component.css'],
  animations:[    trigger('appearances', [
    state('in', style({
      opacity: 1,
      transform: 'translateX(0)'
    })),
    transition('void => *', [
      style({
        opacity: 0,
      }),
      animate(300)
    ]),
    transition('* => void', [
      animate(300, style({
        opacity: 0
      }))
    ])
  ])
  ]
})
export class SelectCommentColumnsComponent implements OnInit {

  @Input('comment') comment: Comment;
  @Output('selectedColumns') selectedColumns: string[];
  deselectedColumns: string[];

  constructor(private selectCommentColumnsService: ExportCommentService) {  }

  ngOnInit() {
    this.selectedColumns=this.selectCommentColumnsService.selectedColumns;
    this.deselectedColumns=this.selectCommentColumnsService.deselectedColumns;
  }

}

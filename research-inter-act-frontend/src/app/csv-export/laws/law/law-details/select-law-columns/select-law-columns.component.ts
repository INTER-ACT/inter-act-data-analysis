import {Component, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ExportCommentService} from '../../../../comments/comment/comment-details/export-comment.service';
import {Law} from '../../law';
import {ExportLawService} from '../export-law.service';

@Component({
  selector: 'app-select-law-columns',
  templateUrl: './select-law-columns.component.html',
  styleUrls: ['./select-law-columns.component.css'],
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
export class SelectLawColumnsComponent implements OnInit {

  @Input('law') law: Law;
  @Output('selectedColumns') selectedColumns: string[];
  deselectedColumns: string[];

  constructor(private exportLawService: ExportLawService) {  }

  ngOnInit() {
    this.selectedColumns=this.exportLawService.selectedColumns;
    this.deselectedColumns=this.exportLawService.deselectedColumns;
  }

}

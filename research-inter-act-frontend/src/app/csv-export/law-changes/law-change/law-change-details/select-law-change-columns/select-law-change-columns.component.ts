import {Component, Input, OnInit, Output} from '@angular/core';
import {LawChange} from '../../law-change';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ExportLawService} from '../../../../laws/law/law-details/export-law.service';
import {ExportLawChangeService} from '../export-law-change.service';

@Component({
  selector: 'app-select-law-change-columns',
  templateUrl: './select-law-change-columns.component.html',
  styleUrls: ['./select-law-change-columns.component.css'],
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
export class SelectLawChangeColumnsComponent implements OnInit {

  @Input("lawChange")lawChange: LawChange;
  selectedColumns: string[];
  deselectedColumns: string[];

  constructor(private exportLawChangeService: ExportLawChangeService) {  }

  ngOnInit() {
    this.selectedColumns=this.exportLawChangeService.selectedColumns;
    this.deselectedColumns=this.exportLawChangeService.deselectedColumns;
  }

}

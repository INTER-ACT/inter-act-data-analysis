import {Component, Input, OnInit} from '@angular/core';
import {ExportLawService} from '../../../../../laws/law/law-details/export-law.service';
import {ExportLawChangeService} from '../../export-law-change.service';

@Component({
  selector: 'app-selected-law-change-column',
  templateUrl: './selected-law-change-column.component.html',
  styleUrls: ['./selected-law-change-column.component.css']
})
export class SelectedLawChangeColumnComponent implements OnInit {

  @Input("column") column: string;

  constructor(public exportLawChangeService: ExportLawChangeService) {
    this.column="";
  }

  ngOnInit() {
  }

}

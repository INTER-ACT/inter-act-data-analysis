import {Component, Input, OnInit} from '@angular/core';
import {ExportLawService} from '../../../../../laws/law/law-details/export-law.service';
import {ExportLawChangeService} from '../../export-law-change.service';

@Component({
  selector: 'app-deselected-law-change-column',
  templateUrl: './deselected-law-change-column.component.html',
  styleUrls: ['./deselected-law-change-column.component.css']
})
export class DeselectedLawChangeColumnComponent implements OnInit {

  @Input("column") column: string;

  constructor(public exportLawChangeService: ExportLawChangeService) {
    this.column="";
  }

  ngOnInit(): void {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {ExportLawService} from '../../export-law.service';

@Component({
  selector: 'app-deselected-law-column',
  templateUrl: './deselected-law-column.component.html',
  styleUrls: ['./deselected-law-column.component.css']
})
export class DeselectedLawColumnComponent implements OnInit {

  @Input("column") column: string;

  constructor(public exportLawService: ExportLawService) {
    this.column="";
  }

  ngOnInit() {
  }

}

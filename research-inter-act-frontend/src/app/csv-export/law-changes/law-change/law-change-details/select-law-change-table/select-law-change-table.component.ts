import {Component, Input, OnInit} from '@angular/core';
import {LawChange} from '../../law-change';
import {ExportLawChangeService} from '../export-law-change.service';

@Component({
  selector: 'app-select-law-change-table',
  templateUrl: './select-law-change-table.component.html',
  styleUrls: ['./select-law-change-table.component.css']
})
export class SelectLawChangeTableComponent implements OnInit {

  @Input("lawChange") lawChange: LawChange;
  columns: string[];
  showMore_begruendung: boolean;
  showMore_gesetzestext_neu: boolean;
  lawChangeDisplayLength: number;

  constructor(private exportLawChangeService: ExportLawChangeService) {
    this.showMore_begruendung=false;
    this.lawChangeDisplayLength=100;
  }

  ngOnInit() {
    this.columns=this.exportLawChangeService.selectedColumns;
  }

  contains(checkColumn: string):boolean{
    for (let column of this.columns)
      if (column===checkColumn)
        return true;
    return false
  }

  emptyColumnContains(checkColumn: string):boolean{
    return ((this.contains('Änderungen_id')&&this.lawChange.aenderungen_id.length>1)||(this.contains('Tags')
      &&this.lawChange.tags.length>1)||(this.contains('Ratings_id')
      &&this.lawChange.ratings_id.length>1)||(this.contains('Kommentare_id')
      &&this.lawChange.kommentare_id.length>1))&&this.contains(checkColumn);
  }

  collectionContains(checkColumn: string,count:number):boolean{
    if (checkColumn == 'Kommentare_id')
      return this.contains('Kommentare_id') && count<this.lawChange.kommentare_id.length;
    if (checkColumn == 'Änderungen_id')
      return this.contains('Änderungen_id')&& count<this.lawChange.aenderungen_id.length;
    if (checkColumn == 'Ratings_id')
      return this.contains('Ratings_id')&& count<this.lawChange.ratings_id.length;
    if (checkColumn == 'Tags')
      return this.contains('Tags')&& count<this.lawChange.tags.length;
    return false;
  }

  emptyCollectionContains(checkColumn: string,count:number):boolean{
    if (checkColumn == 'Kommentare_id')
      return this.contains('Kommentare_id') && count>=this.lawChange.kommentare_id.length &&
        (this.contains('Tags')||this.contains('Änderungen_id')||this.contains("Ratings_id"));
    if (checkColumn == 'Tags')
      return this.contains('Tags')&& count>=this.lawChange.tags.length &&
        (this.contains('Kommentare_id')||this.contains('Änderungen_id')||this.contains("Ratings_id"));
    if (checkColumn == 'Änderungen_id')
      return this.contains('Änderungen_id')&& count>=this.lawChange.aenderungen_id.length &&
        (this.contains('Kommentare_id')||this.contains('Tags')||this.contains("Ratings_id"));
    if (checkColumn == 'Ratings_id')
      return this.contains('Ratings_id')&& count>=this.lawChange.ratings_id.length &&
        (this.contains('Kommentare_id')||this.contains('Tags')||this.contains("Änderungen_id"));
    return false;
  }

  getRowCount():number{
    if (this.lawChange.aenderungen_id != null && this.contains("Änderungen_id"))
      if ((this.lawChange.aenderungen_id.length >= this.lawChange.kommentare_id.length||!this.contains("Kommentare_id")) &&
        (this.lawChange.aenderungen_id.length >= this.lawChange.ratings_id.length||!this.contains("Ratings_id")) &&
        (this.lawChange.aenderungen_id.length >= this.lawChange.tags.length||!this.contains("Tags")))
        return this.lawChange.aenderungen_id.length;
    if (this.lawChange.kommentare_id != null && this.contains("Kommentare_id"))
      if ((this.lawChange.kommentare_id.length >= this.lawChange.aenderungen_id.length||!this.contains("Änderungen_id")) &&
        (this.lawChange.kommentare_id.length >= this.lawChange.ratings_id.length||!this.contains("Ratings_id")) &&
        (this.lawChange.kommentare_id.length >= this.lawChange.tags.length||!this.contains("Tags")))
        return this.lawChange.kommentare_id.length;
    if (this.lawChange.ratings_id != null && this.contains("Ratings_id"))
      if ((this.lawChange.ratings_id.length >= this.lawChange.aenderungen_id.length||!this.contains("Änderungen_id")) &&
        (this.lawChange.ratings_id.length >= this.lawChange.kommentare_id.length||!this.contains("Kommentare_id")) &&
        (this.lawChange.ratings_id.length >= this.lawChange.tags.length||!this.contains("Tags")))
        return this.lawChange.ratings_id.length;
    if (this.lawChange.tags != null && this.contains("Tags"))
      if ((this.lawChange.tags.length >= this.lawChange.aenderungen_id.length||!this.contains("Änderungen_id")) &&
        (this.lawChange.tags.length >= this.lawChange.kommentare_id.length||!this.contains("Kommentare_id")) &&
        (this.lawChange.tags.length >= this.lawChange.ratings_id.length||!this.contains("Ratings_id")))
        return this.lawChange.tags.length;
    return 0;
  }

}

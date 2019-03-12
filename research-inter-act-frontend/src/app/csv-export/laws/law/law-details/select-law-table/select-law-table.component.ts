import {Component, Input, OnInit} from '@angular/core';
import {Comment} from '../../../../comments/comment/comment';
import {Law} from '../../law';
import {ExportLawService} from '../export-law.service';

@Component({
  selector: 'app-select-law-table',
  templateUrl: './select-law-table.component.html',
  styleUrls: ['./select-law-table.component.css']
})
export class SelectLawTableComponent implements OnInit {

  @Input("law") law: Law;
  columns: string[];
  showMore_erklaerung: boolean;
  showMore_gesetzestext: boolean;
  lawDisplayLength: number;

  constructor(private exportLawService: ExportLawService) {
    this.showMore_erklaerung=false;
    this.lawDisplayLength=100;
  }

  ngOnInit() {
    this.columns=this.exportLawService.selectedColumns;
  }

  contains(checkColumn: string):boolean{
    for (let column of this.columns)
      if (column===checkColumn)
        return true;
    return false
  }

  emptyColumnContains(checkColumn: string):boolean{
    return ((this.contains('Änderungen_id')&&this.law.aenderungen_id.length>1)||(this.contains('Tags')
      &&this.law.tags.length>1)||(this.contains('Ratings_id')
      &&this.law.ratings_id.length>1)||(this.contains('Kommentare_id')
      &&this.law.kommentare_id.length>1))&&this.contains(checkColumn);
  }

  collectionContains(checkColumn: string,count:number):boolean{
    if (checkColumn == 'Kommentare_id')
      return this.contains('Kommentare_id') && count<this.law.kommentare_id.length;
    if (checkColumn == 'Änderungen_id')
      return this.contains('Änderungen_id')&& count<this.law.aenderungen_id.length;
    if (checkColumn == 'Ratings_id')
      return this.contains('Ratings_id')&& count<this.law.ratings_id.length;
    if (checkColumn == 'Tags')
      return this.contains('Tags')&& count<this.law.tags.length;
    return false;
  }

  emptyCollectionContains(checkColumn: string,count:number):boolean{
    if (checkColumn == 'Kommentare_id')
      return this.contains('Kommentare_id') && count>=this.law.kommentare_id.length && 
        (this.contains('Tags')||this.contains('Änderungen_id')||this.contains("Ratings_id"));
    if (checkColumn == 'Tags')
      return this.contains('Tags')&& count>=this.law.tags.length &&
        (this.contains('Kommentare_id')||this.contains('Änderungen_id')||this.contains("Ratings_id"));
    if (checkColumn == 'Änderungen_id')
      return this.contains('Änderungen_id')&& count>=this.law.aenderungen_id.length &&
        (this.contains('Kommentare_id')||this.contains('Tags')||this.contains("Ratings_id"));
    if (checkColumn == 'Ratings_id')
      return this.contains('Ratings_id')&& count>=this.law.ratings_id.length &&
        (this.contains('Kommentare_id')||this.contains('Tags')||this.contains("Änderungen_id"));
    return false;
  }



  getRowCount():number{
    if (this.law.aenderungen_id != null && this.contains("Änderungen_id"))
      if ((this.law.aenderungen_id.length >= this.law.kommentare_id.length||!this.contains("Kommentare_id")) &&
        (this.law.aenderungen_id.length >= this.law.ratings_id.length||!this.contains("Ratings_id")) &&
        (this.law.aenderungen_id.length >= this.law.tags.length||!this.contains("Tags")))
        return this.law.aenderungen_id.length;
    if (this.law.kommentare_id != null && this.contains("Kommentare_id"))
      if ((this.law.kommentare_id.length >= this.law.aenderungen_id.length||!this.contains("Änderungen_id")) &&
        (this.law.kommentare_id.length >= this.law.ratings_id.length||!this.contains("Ratings_id")) &&
        (this.law.kommentare_id.length >= this.law.tags.length||!this.contains("Tags")))
        return this.law.kommentare_id.length;
    if (this.law.ratings_id != null && this.contains("Ratings_id"))
      if ((this.law.ratings_id.length >= this.law.aenderungen_id.length||!this.contains("Änderungen_id")) &&
        (this.law.ratings_id.length >= this.law.kommentare_id.length||!this.contains("Kommentare_id")) &&
        (this.law.ratings_id.length >= this.law.tags.length||!this.contains("Tags")))
        return this.law.ratings_id.length;
    if (this.law.tags != null && this.contains("Tags"))
      if ((this.law.tags.length >= this.law.aenderungen_id.length||!this.contains("Änderungen_id")) &&
        (this.law.tags.length >= this.law.kommentare_id.length||!this.contains("Kommentare_id")) &&
        (this.law.tags.length >= this.law.ratings_id.length||!this.contains("Ratings_id")))
        return this.law.tags.length;
    return 0;
  }

}

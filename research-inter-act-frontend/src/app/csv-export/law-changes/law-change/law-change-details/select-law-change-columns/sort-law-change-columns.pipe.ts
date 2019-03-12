import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sortLawChangeColumns',
  pure: false
})
export class SortLawChangeColumnsPipe implements PipeTransform {

  compareColumns: string[] = ['Änderungs_id', 'Gesetzes_id', 'User_id',
    'Titel_neu', 'Gesetzestext_neu', 'Begründung', 'Referenz', 'Änderungs_Bezugs_id',
    'Datum','Änderungen_id' ,'Kommentare_id', 'Ratings_id', 'Tags'];

  transform(columns: string[]): string[] {
    if (columns.length < 1)
      return columns;
    const returnArray: string[] = [];

    for (let compareColumn of this.compareColumns)
      for (let column of columns)
        if (column == compareColumn)
          returnArray.push(column);
    return returnArray;

  }
}

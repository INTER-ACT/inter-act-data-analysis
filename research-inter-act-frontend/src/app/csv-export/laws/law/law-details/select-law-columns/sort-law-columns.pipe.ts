import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortLawColumns',
  pure: false
})
export class SortLawColumnsPipe implements PipeTransform {

  compareColumns: string[] = ['Gesetzes_id', 'Gesetz', 'Paragraph',
    'Titel', 'Gesetzestext', 'Erklärung', 'Bundesgesetzblatt', 'Änderungen_id',
    'Kommentare_id','Ratings_id','Tags','Originaltext','Datum','User_id'];

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

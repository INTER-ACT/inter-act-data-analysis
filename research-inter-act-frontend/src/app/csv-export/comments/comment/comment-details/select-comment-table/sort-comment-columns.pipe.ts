import {Pipe, PipeTransform} from '@angular/core';
import index from '@angular/cli/lib/cli';

@Pipe({
  name: 'sortCommentColumns',
  pure: false
})
export class SortCommentColumnsPipe implements PipeTransform {

  compareColumns: string[] = ['Kommentar_id', 'User_id', 'Referenz', 'Kommentar_Bezugs_id', 'Kommentar', 'Likes', 'Datum', 'Kommentare_id', 'Tags'];

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

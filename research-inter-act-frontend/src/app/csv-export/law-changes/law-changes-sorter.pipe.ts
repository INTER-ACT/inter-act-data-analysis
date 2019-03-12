import { Pipe, PipeTransform } from '@angular/core';
import {Law} from '../laws/law/law';
import {LawChange} from './law-change/law-change';

@Pipe({
  name: 'lawChangesSorter'
})
export class LawChangesSorterPipe implements PipeTransform {

  transform(lawChanges: LawChange[], sorter: string): LawChange[] {
    if (lawChanges.length===0 || sorter===null)
      return lawChanges;
    if (sorter === 'Konversationsrate')
      return lawChanges.sort((a, b) => a.conversationRate<b.conversationRate?1:a.conversationRate>b.conversationRate?-1:0);
    else if (sorter === 'ID')
      return lawChanges.sort((a, b) => a.aenderungs_id<b.aenderungs_id?-1:a.aenderungs_id>b.aenderungs_id?1:0);
    else
      return lawChanges.sort((a, b) => a.sort<b.sort?-1:a.sort>b.sort?1:0);

  }

}

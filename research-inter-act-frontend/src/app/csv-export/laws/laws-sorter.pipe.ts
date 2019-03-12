import { Pipe, PipeTransform } from '@angular/core';
import {Law} from './law/law';



@Pipe({
  name: 'lawsSorter'
})
export class LawsSorterPipe implements PipeTransform {

  transform(laws: Law[], sorter: string): Law[] {
    if (laws.length===0 || sorter===null)
      return laws;
    if (sorter === 'Konversationsrate')
      return laws.sort((a, b) => a.conversationRate<b.conversationRate?1:a.conversationRate>b.conversationRate?-1:0);
    else if (sorter === 'ID')
      return laws.sort((a, b) => a.gesetzes_id<b.gesetzes_id?-1:a.gesetzes_id>b.gesetzes_id?1:0);
    else
      return laws.sort((a, b) => a.sort<b.sort?-1:a.sort>b.sort?1:0);

  }

}

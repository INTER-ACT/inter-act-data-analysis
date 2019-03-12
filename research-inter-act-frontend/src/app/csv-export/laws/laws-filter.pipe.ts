import { Pipe, PipeTransform } from '@angular/core';
import {Law} from './law/law';

@Pipe({
  name: 'lawsFilter'
})
export class LawsFilterPipe implements PipeTransform {

  transform(laws: Law[], filter: string): Law[] {
    if (laws.length===0 || filter==="")
      return laws;
    const resultArray=[];
    for (const law of laws) {
      if (law.gesetzes_id === +filter || law.paragraph===filter||law.titel.toLowerCase().includes(filter.toLowerCase()))
        resultArray.push(law);
    }
    return resultArray;

  }

}

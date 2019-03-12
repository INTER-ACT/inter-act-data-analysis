import { Pipe, PipeTransform } from '@angular/core';
import {Law} from '../laws/law/law';
import {LawChange} from './law-change/law-change';

@Pipe({
  name: 'lawChangesFilter'
})
export class LawChangesFilterPipe implements PipeTransform {

  transform(lawChanges: LawChange[], filter: string): LawChange[] {
    if (lawChanges.length===0 || filter==="")
      return lawChanges;
    const resultArray=[];
    for (const lawChange of lawChanges) {
      if (lawChange.aenderungs_id === +filter || lawChange.paragraph===filter||lawChange.titel_neu.toLowerCase().includes(filter.toLowerCase()))
        resultArray.push(lawChange);
    }
    return resultArray;

  }

}

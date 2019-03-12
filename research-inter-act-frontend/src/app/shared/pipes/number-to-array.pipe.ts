import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToArray',
  pure: false
})
export class NumberToArrayPipe implements PipeTransform {

  transform(count: number): number[] {
    if (count == 0 || count == null)
      return [0];
    const resultArray: number[]=[];
    for (let i = 0; i < count; i++)
      resultArray.push(i);
    return resultArray;
  }

}

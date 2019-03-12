import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeFirstElementFromArray',
  pure: false
})
export class RemoveFirstElementFromArrayPipe implements PipeTransform {

  transform(array: any[]): any[] {
    array.forEach( (item, index) => {
      if(index === 0) array.splice(index,1);
    });
    return array;
  }

}

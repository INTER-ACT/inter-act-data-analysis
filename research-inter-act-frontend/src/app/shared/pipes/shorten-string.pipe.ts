import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenString'
})
export class ShortenStringPipe implements PipeTransform {

  transform(text: string, charsNumber: number): string {
    if (charsNumber === 0)
      return text;
    else if (text.length < charsNumber)
      return text;
    for (let i = charsNumber; i < text.length; i++)
      if (text[i]==" ")
        return text.substring(0,i)+ " ...";
    return text;
  }

}

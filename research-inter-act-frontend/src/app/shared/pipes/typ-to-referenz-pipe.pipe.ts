import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typToReferenzPipe'
})
export class TypToReferenzPipePipe implements PipeTransform {

  transform(typ: string): string {
    if (typ == null || typ.length > 1)
      return typ;
    else if (typ === 'k')
      return "Kommentar";
    else if (typ === 'g')
      return "Paragraph";
    else if (typ === 'v')
      return "Änderungsvorschlag"
    return null;
  }

}

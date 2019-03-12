import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeHtmlTagsFromString'
})
export class RemoveHtmlTagsFromStringPipe implements PipeTransform {

  transform(text: string): string {
    if (text==null||text==="")
      return text;
    const div=document.createElement("div");
    div.innerHTML=text;
    return div.textContent||div.innerText||"";
  }

}

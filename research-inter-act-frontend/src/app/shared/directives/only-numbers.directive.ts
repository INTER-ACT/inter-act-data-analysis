import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbersDirective]'
})
export class OnlyNumbersDirective {


  private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
  private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home' ];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', [ '$event' ])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}

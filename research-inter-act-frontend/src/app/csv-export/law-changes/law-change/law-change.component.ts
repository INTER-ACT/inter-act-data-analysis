import {Component, Input, OnInit} from '@angular/core';
import {LawChange} from './law-change';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-law-change',
  templateUrl: './law-change.component.html',
  styleUrls: ['./law-change.component.css'],
  animations:[    trigger('appearance', [
    transition('void => *', [
      style({
        width: '0%',
      }),
      animate(700)
    ])
  ])]
})
export class LawChangeComponent implements OnInit {

  @Input("lawChange") lawChange:LawChange;
  @Input("conversationPercent") conversationRate:number;

  constructor() { }

  ngOnInit() {
  }

}

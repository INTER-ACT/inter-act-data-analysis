import {Component, Input, OnInit} from '@angular/core';
import {Law} from './law';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-law',
  templateUrl: './law.component.html',
  styleUrls: ['./law.component.css'],
  animations:[    trigger('appearance', [
    transition('void => *', [
      style({
        width: '0%',
      }),
      animate(700)
    ])
  ])

  ]
})
export class LawComponent implements OnInit {

  @Input("law") law:Law;
  @Input("conversationPercent") conversationRate:number;

  constructor() { }

  ngOnInit() {
  }

}

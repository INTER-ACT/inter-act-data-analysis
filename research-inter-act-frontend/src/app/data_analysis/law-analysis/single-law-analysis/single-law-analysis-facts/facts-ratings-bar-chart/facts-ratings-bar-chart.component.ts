import {Component, Input, OnInit} from '@angular/core';
import { Chart } from 'chart.js';
import {Law} from '../../../../../csv-export/laws/law/law';
import {Rating} from './rating';
import {RatingsService} from './ratings.service';

@Component({
  selector: 'app-facts-ratings-bar-chart',
  templateUrl: './facts-ratings-bar-chart.component.html',
  styleUrls: ['./facts-ratings-bar-chart.component.css']
})
export class FactsRatingsBarChartComponent{
  rating:Rating[];
  @Input('rating') set Rating(value: Rating[])
  {
    if(this.chart==null)
    {

      this.generate();
    }

    if(value!=null) {
      this.rating=value;
      this.updateChart();
    }
  }
  law:Law;
  color:string;
  @Input('law') set Law(value: Law)
  {
    if(this.chart==null)
    {

      this.generate();
    }

    if(value!=null) {
      this.law=value;
      this.updateChart();
    }
  }
  chart: any;
  label: string[]=[];
  datas: { labels: string[], datasets: { backgroundColor, borderColor, label, data: number[] }[] } = {labels: [], datasets: []};

  constructor() {
  }

  updateChart() {
    this.datas.datasets = [];
    this.datas.labels = [];
    if (this.law != null&&this.rating!=null) {
      let countFor:number[]=[];
      countFor.push(0);
      countFor.push(0);
      countFor.push(0);
      let countAgainst:number[]=[];
      countAgainst.push(0);
      countAgainst.push(0);
      countAgainst.push(0);
      for (let i = 0; i < this.rating.length; i++) {
        if(this.rating[i].typ=='g'&&this.rating[i].rating_bezugs_id==this.law.gesetzes_id) {

          if (this.rating[i].aspect == 1) {
            if (this.rating[i].wertung == 1) {
              countFor[0]++;
            }
            if (this.rating[i].wertung == -1) {
              countAgainst[0]++;
            }
          }
          if (this.rating[i].aspect == 2) {
            if (this.rating[i].wertung == 1) {
              countFor[1]++;
            }
            if (this.rating[i].wertung == -1) {
              countAgainst[1]++;
            }
          }
          if (this.rating[i].aspect == 3) {
            if (this.rating[i].wertung == 1) {
              countFor[2]++;
            }
            if (this.rating[i].wertung == -1) {
              countAgainst[2]++;
            }
          }
        }
      }
      this.datas.labels.push('Verständlich');
      this.datas.labels.push('Fairness');
      this.datas.labels.push('DafürDagegen');
      this.datas.datasets.push({label: '+', backgroundColor: '#21568c', borderColor: '#21568c', data: countFor});
      this.datas.datasets.push({label: '-', backgroundColor: '#e9300b', borderColor: '#e9300b', data: countAgainst});
    }
    this.chart.data = this.datas;
    this.chart.update();
  }
  generate() {

    if (this.chart == null) {
      this.chart = new Chart('barchartratings', {
        type: 'bar',
        data: {},
        options: {
          responsive: true,
          legend: {
            display: true
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Anzahl der Bewertungen'
              }
            }]
          }

        }
      });

    }
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {Rating} from '../../../single-law-analysis/single-law-analysis-facts/facts-ratings-bar-chart/rating';
import {Law} from '../../../../../csv-export/laws/law/law';
import { Chart } from 'chart.js';
import {LawChange} from '../../../../../csv-export/law-changes/law-change/law-change';


@Component({
  selector: 'app-law-change-ratings-bar-chart',
  templateUrl: './law-change-ratings-bar-chart.component.html',
  styleUrls: ['./law-change-ratings-bar-chart.component.css']
})
export class LawChangeRatingsBarChartComponent {
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
  law:LawChange;
  color:string;
  @Input('law') set Law(value: LawChange)
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
        if(this.rating[i].typ=='v'&&this.rating[i].rating_bezugs_id==this.law.aenderungs_id) {
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
      this.datas.datasets.push({label: '+', backgroundColor: '#e9300b', borderColor: '#e9300b', data: countFor});
      this.datas.datasets.push({label: '-', backgroundColor: '#21568c', borderColor: '#21568c', data: countAgainst});
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

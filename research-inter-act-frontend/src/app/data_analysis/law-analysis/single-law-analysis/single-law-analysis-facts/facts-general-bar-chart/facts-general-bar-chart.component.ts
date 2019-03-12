import {Component, Input} from '@angular/core';
import { Chart } from 'chart.js';
import {Law} from '../../../../../csv-export/laws/law/law';


@Component({
  selector: 'app-facts-general-bar-chart',
  templateUrl: './facts-general-bar-chart.component.html',
  styleUrls: ['./facts-general-bar-chart.component.css']
})
export class FactsGeneralBarChartComponent {

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
    if (this.law != null) {
      let valueArray: number[] = [];
      valueArray.push(this.law.kommentare_id.length);
      this.datas.labels.push(' ');
      this.datas.datasets.push({label: 'Kommentare', backgroundColor: '#e9300b', borderColor: '#e9300b', data: valueArray});
      valueArray=[];
      valueArray.push(this.law.aenderungen_id.length);
      this.datas.datasets.push({label: 'Änderungen', backgroundColor: '#21568c', borderColor: '#21568c', data: valueArray});
      valueArray=[];
      valueArray.push(this.law.ratings_id.length);
      this.datas.datasets.push({label: 'Bewertungen', backgroundColor: '#7be00f', borderColor: '#7be00f', data: valueArray});
    }
    this.chart.data = this.datas;
    this.chart.update();
  }




  generate() {

    if (this.chart == null) {
      this.chart = new Chart('barchart', {
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
                labelString: 'Anzahl der Aktivitäten'
              }
            }]
          }

        }
      });

    }
  }
}


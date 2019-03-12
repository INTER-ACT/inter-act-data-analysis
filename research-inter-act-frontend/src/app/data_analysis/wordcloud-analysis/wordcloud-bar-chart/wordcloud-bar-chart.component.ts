import {
  Component,
  Input,
  AfterViewInit
} from '@angular/core';
import { Chart } from 'chart.js';
import {DatePipe} from "@angular/common";
import {Statistic} from '../statistic';

@Component({
  selector: 'app-wordcloud-bar-chart',
  templateUrl: './wordcloud-bar-chart.component.html',
  styleUrls: ['./wordcloud-bar-chart.component.css']
})
export class WordcloudBarChartComponent{
  statics: Statistic[]=[];
  generate(){

    if(this.chart==null) {
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
                labelString: 'Anzahl der Klicks'
              }
            }]
          }
        }
      });

    }
  }


  @Input('statistcs') set Statics(value: Statistic[])
  {
    this.generate();
    if(value!= null&&value != []) {
      if(value.length>this.statics.length) {
        this.statics = value;
        this.updateChart();
      }
    }
  }

  startDate: Date;
  @Input('startDate') set StartDate(value: Date)
  {

    if(value!=null) {
      let checkPreviousValue;
      if(this.startDate==null)
      {
        checkPreviousValue=''
      }
      else {
        checkPreviousValue=this.startDate.toString()
      }
      if (value.toString()!= checkPreviousValue) {
        this.startDate=value;
        this.updateChart();
      }
    }
  }
  endDate: Date;
  @Input('endDate') set EndDate(value: Date)
  {
    if(value!=null) {
      let checkPreviousValue;
      if(this.endDate==null)
      {
        checkPreviousValue=''
      }
      else {
        checkPreviousValue=this.endDate.toString()
      }
      if (value.toString()!= checkPreviousValue) {
        this.endDate=value;
        this.updateChart();
      }
    }
  }


  chart: any;
  label: string[]=[];
  datas: {labels: string[],datasets:{backgroundColor, borderColor,label, data:number[]}[]}={labels:[], datasets: []};


  constructor() {}

  updateChart() {
    this.datas.datasets=[];
    this.datas.labels=[];
    let pipe = new DatePipe('en-Us');
    let startDate=pipe.transform(this.startDate, 'yyyy-MM-dd');
    let endDate=pipe.transform(this.endDate, 'yyyy-MM-dd');
    if(this.statics!=null&&this.statics!=[]) {
      let countWords = 0;
      let countOther=0;
      let wordArray: number[]=[];
      let othersArray: number[]=[];
      let date;
      for (let i = 0; i < this.statics.length; i++) {

        date=pipe.transform(this.statics[i].datum, 'yyyy-MM-dd');
        if((date>=startDate|| this.startDate==null)&& (date<=endDate||this.endDate==null) ) {
          if(i+1<this.statics.length)
          {
          let nextdate=pipe.transform(this.statics[i+1].datum, 'yyyy-MM-dd');
          if(date==nextdate) {
            if (this.statics[i].link_ort == 'w') {
              countWords++;
            }
            else {
              countOther++;
            }
          }
          else {
            if (this.statics[i].link_ort == 'w') {
              countWords++;
            }
            else {
              countOther++;
            }
            this.datas.labels.push(date);
            wordArray.push(countWords);
            othersArray.push(countOther);
            countWords=0;
            countOther=0;
          }
          }
          if(i==this.statics.length-1)
          {
            if (this.statics[i].link_ort == 'w') {
              countWords++;
              wordArray.push(countWords);

            }
            else {
              countOther++;
              othersArray.push(countOther);
            }
            if(countWords>0||countOther>0)
            {
              this.datas.labels.push(date);
            }
          }
        }
      }
      this.datas.datasets.push({label: 'Wordcloud', backgroundColor: '#21568c', borderColor: '#21568c', data: wordArray });
      this.datas.datasets.push({label: 'Andere Links ', backgroundColor: '#e9300b', borderColor: '#e9300b', data: othersArray});
    }

    this.chart.data=this.datas;
    this.chart.update();
  }



}

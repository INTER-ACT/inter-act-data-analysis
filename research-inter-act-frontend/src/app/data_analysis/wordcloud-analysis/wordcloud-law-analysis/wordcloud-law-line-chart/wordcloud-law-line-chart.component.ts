import {Component, Input, OnInit} from '@angular/core';
import {Statistic} from '../../statistic';
import {DatePipe} from '@angular/common';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-wordcloud-law-line-chart',
  templateUrl: './wordcloud-law-line-chart.component.html',
  styleUrls: ['./wordcloud-law-line-chart.component.css']
})
export class WordcloudLawLineChartComponent  {
  statics: Statistic[]=[];
  generate(){

    if(this.chart==null) {
      this.chart = new Chart('linechartlaw', {
        type: 'line',
        labels: [],
        data: {
          datasets: []
        },
        options: {
          legend: {
            display: true
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'day',
                unitStepSize: 1,
                displayFormats: {
                  'day': 'MMM DD YYYY'
                }
              },
              scaleLabel:
                {
                  display: true,
                  labelString: 'Zeit'
                }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Anzahl der Klicks'
              }
            }]
          }
        }
      });
      this.updateChart();
    }
  }


  @Input('statistcs') set Statics(value: Statistic[])
  {

    this.generate()

    if(value!= null) {

      this.statics = value;
      this.updateChart();

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
  dataforGraph:{graphs: {x:Date,y:number}[]}[]=[{graphs:[]},{graphs:[]}];
  datas: {fill, borderColor,label: string,data:{x:Date,y:number}[]}[]=[];


  constructor() {}

  updateChart() {
    this.datas=[];
    let pipe = new DatePipe('en-Us');
    let startDate=pipe.transform(this.startDate, 'yyyy-MM-dd hh:mm:ss');
    let endDate=pipe.transform(this.endDate, 'yyyy-MM-dd hh:mm:ss');
    if(this.statics!=null) {
      let countWords = 0;
      let countOther=0;
      this.dataforGraph[0].graphs = [];
      this.dataforGraph[1].graphs = [];
      for (let i = 0; i < this.statics.length; i++) {
        if((this.statics[i].datum.toString()>startDate|| this.startDate==null)&& (this.statics[i].datum.toString()<endDate||this.endDate==null) ) {

          if(this.statics[i].link_ort=='w') {
            countWords++;
            this.dataforGraph[0].graphs.push({y: countWords, x: this.statics[i].datum});
          }
          else {
            countOther++;
            this.dataforGraph[1].graphs.push({y: countOther, x: this.statics[i].datum});
          }

        }
      }
      this.datas.push({label: 'Wordcloud', fill: null, borderColor: '#21568c', data: this.dataforGraph[0].graphs});
      this.datas.push({label: 'Andere Links ', fill: null, borderColor: '#e9300b', data: this.dataforGraph[1].graphs});
    }
    this.chart.data.datasets=this.datas;
    this.chart.update();
  }


}


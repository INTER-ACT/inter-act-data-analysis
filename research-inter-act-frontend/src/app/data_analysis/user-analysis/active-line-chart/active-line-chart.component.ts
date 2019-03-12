import {Component, Input, OnInit} from '@angular/core';
import { Chart } from 'chart.js';
import {DatePipe} from '@angular/common';
import {User} from '../../../consolidated_law/example-view/user';


@Component({
  selector: 'app-active-line-chart',
  templateUrl: './active-line-chart.component.html',
  styleUrls: ['./active-line-chart.component.css']
})
export class ActiveLineChartComponent {
  users: User[]=[];



  generate(){

    if(this.chart==null) {
      this.chart = new Chart('linechartactive', {
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
                labelString: 'Anzahl der Aktivitäten'
              }
            }]
          }
        }
      });
      this.updateChart();
    }

  }


  @Input('users') set Users(value: User[])
  {
    this.generate();
    this.users=value;
    this.updateChart();
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
  count: number=0;
  label: string[]=[];
  data:{x:Date,y:number}[]=[];
  datas: {fill, borderColor,label: string,data}[]=[];


  constructor() {}

  updateChart() {
    this.datas=[];
    let pipe = new DatePipe('en-Us');
    let startDate=pipe.transform(this.startDate, 'yyyy-MM-dd hh:mm:ss');
    let endDate=pipe.transform(this.endDate, 'yyyy-MM-dd hh:mm:ss');
    if(this.users!=null) {
      for (let i = 0; i < this.users.length; i++) {
        this.count = 0;
        this.data = [];
        for (let y = 0; y < this.users[i].aktivitaeten.length; y++) {
          if((this.users[i].aktivitaeten[y].datum.toString()>startDate|| this.startDate==null)&& (this.users[i].aktivitaeten[y].datum.toString()<endDate||this.endDate==null) ) {

              if(this.users[i].aktivitaeten[y].aktivitaet=='lawChange'||this.users[i].aktivitaeten[y].aktivitaet=='comment')
              {
                this.count++;
                this.data.push({y: this.count, x: this.users[i].aktivitaeten[y].datum});
              }

          }
        }
        this.datas.push({label: this.users[i].username, fill: null, borderColor: this.getRandomColor(), data: this.data});

      }

      this.chart.data.datasets=this.datas;
      this.chart.update();
    }

  }


  getRandomColor() {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


}


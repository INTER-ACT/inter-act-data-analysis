import {
  Component,
  Input,
  AfterViewInit, OnChanges, OnInit, AfterViewChecked
} from '@angular/core';
import {User} from '../../../../consolidated_law/example-view/user';
import { Chart } from 'chart.js';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-general-law-line-chart',
  templateUrl: './general-law-line-chart.component.html',
  styleUrls: ['./general-law-line-chart.component.css']
})
export class GeneralLawLineChartComponent {
  users: User[]=[];

  generate(){

    if(this.chart==null) {
      this.chart = new Chart('linechart', {
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
                unit: 'month',
                unitStepSize: 1,
                displayFormats: {
                  'month': 'MMM'
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
            }],
          }
        }
      });
    }
  }


  @Input('users') set Users(value: User[])
  {


    this.generate();

    if(value!= null) {
      if(value.length!==this.users.length) {
        this.users = value;
        this.updateChart();
      }
    }
  }



  selectedEducation:{ausbildungs_id,ausbildung};
  @Input('selectedEducation') set SelectedEducation(value: {ausbildungs_id,ausbildung})
  {

    this.selectedEducation=value;
    this.updateChart()


  }
  selectedLegalExpertise: {rechtskenntnis_id, rechtskenntnis};
  @Input('selectedLegalExpertise') set SelectedLegalExpertise(value: {rechtskenntnis_id, rechtskenntnis})
  {
    this.selectedLegalExpertise=value;
    this.updateChart();
  }
  minYear:number;
  @Input('minAge') set MinAge(value: number)
  {
    this.minYear=value;
    if(value!=null) {
      let date = new Date().getFullYear();
      this.minYear = date - value;
      this.updateChart();
    }
  }
  maxYear:number;
  @Input('maxAge') set MaxAge(value: number)
  {
    this.maxYear=value;
    if(value!=null) {
      let date = new Date().getFullYear();
      this.maxYear = date - value;
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
  count: number=0;
  countCom: number=0;
  countChange: number=0;
  label: string[]=[];
  data:{x:Date,y:number}[]=[];
  dataComment:{x:Date,y:number}[]=[];
  dataLawchange:{x:Date,y:number}[]=[];
  datas: {fill, borderColor,label: string,data}[]=[];


  constructor() {}

  updateChart() {
    let pipe = new DatePipe('en-Us');
    this.datas=[];
    this.count = 0;
    this.countCom=0;
    this.countChange=0;
    this.data = [];
    this.dataComment=[];
    this.dataLawchange=[];
    let startDate=pipe.transform(this.startDate, 'yyyy-MM-dd hh:mm:ss');
    let endDate=pipe.transform(this.endDate, 'yyyy-MM-dd hh:mm:ss');
    if(this.users!=null) {
      for (let i = 0; i < this.users.length; i++) {
        if(this.selectedEducation==null||this.users[i].ausbildung==this.selectedEducation.ausbildungs_id)
        {
          if(this.selectedLegalExpertise==null||this.users[i].rechtskenntnisse==this.selectedLegalExpertise.rechtskenntnis_id) {
            if(this.minYear==null||this.minYear<this.users[i].geb_jahr) {
              if (this.maxYear == null || this.maxYear > this.users[i].geb_jahr) {
                for (let y = 0; y < this.users[i].aktivitaeten.length; y++) {
                  if ((this.users[i].aktivitaeten[y].datum.toString() > startDate || this.startDate == null) && (this.users[i].aktivitaeten[y].datum.toString() < endDate || this.endDate == null)) {

                    this.count++;
                    this.data.push({y: this.count, x: this.users[i].aktivitaeten[y].datum});
                    if(this.users[i].aktivitaeten[y].aktivitaet=='comment')
                    {
                      this.countCom++;
                      this.dataComment.push({y: this.countCom, x: this.users[i].aktivitaeten[y].datum});
                    }
                    if(this.users[i].aktivitaeten[y].aktivitaet=='lawChange')
                    {
                      this.countChange++;
                      this.dataLawchange.push({y: this.countChange, x: this.users[i].aktivitaeten[y].datum});
                    }
                  }
                }
              }
            }
          }
        }
      }
        this.data.sort((a: {x: Date, y:number}, b: {x: Date, y:number}) => {
          return a.x<b.x?-1:a.x>b.x?1:0;
      });
      for (let i=0;i<this.data.length;i++)
      {
        this.data[i].y=i+1;
      }
      this.dataComment.sort((a: {x: Date, y:number}, b: {x: Date, y:number}) => {
        return a.x<b.x?-1:a.x>b.x?1:0;
      });
      for (let i=0;i<this.dataComment.length;i++)
      {
        this.dataComment[i].y=i+1;
      }
      this.dataLawchange.sort((a: {x: Date, y:number}, b: {x: Date, y:number}) => {
        return a.x<b.x?-1:a.x>b.x?1:0;
      });
      for (let i=0;i<this.dataLawchange.length;i++)
      {
        this.dataLawchange[i].y=i+1;
      }
      this.datas.push({label: 'Aktivität', fill: null, borderColor: '#21568c', data: this.data});
      this.datas.push({label: 'Kommentare', fill:null, borderColor: '#e9300b', data:this.dataComment});
      this.datas.push({label: 'Änderungsvorschläge', fill:null, borderColor: '#7be00f', data:this.dataLawchange});
      this.chart.data.datasets=this.datas;
      this.chart.update();
    }

  }





}

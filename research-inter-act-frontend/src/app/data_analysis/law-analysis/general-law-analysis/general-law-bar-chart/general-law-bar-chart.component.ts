import {
  Component,
  Input
} from '@angular/core';
import { Chart } from 'chart.js';
import {DatePipe} from "@angular/common";
import {User} from '../../../../consolidated_law/example-view/user';

@Component({
  selector: 'app-general-law-bar-chart',
  templateUrl: './general-law-bar-chart.component.html',
  styleUrls: ['./general-law-bar-chart.component.css']
})
export class GeneralLawBarChartComponent {
  users: User[]=[];
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
  label: string[]=[];
  data:{x:Date,y:number}[]=[];
  dataComment:{x:Date,y:number}[]=[];
  dataLawchange:{x:Date,y:number}[]=[];
  datas: { labels: string[], datasets: { backgroundColor, borderColor, label, data: number[] }[] } = {labels: [], datasets: []};


  constructor() {
  }

  updateChart() {
    this.getArrayReady();
    this.datas.datasets = [];
    this.datas.labels = [];
    let pipe = new DatePipe('en-Us');
    let startDate = pipe.transform(this.startDate, 'yyyy-MM-dd');
    let endDate = pipe.transform(this.endDate, 'yyyy-MM-dd');
    if (this.data != null && this.data != []) {
      let count = 0;
      let valueArray: number[] = [];
      let date;
      for (let i = 0; i < this.data.length; i++) {
        if ((this.data[i].x.toString() > startDate || this.startDate == null) && (this.data[i].x.toString() < endDate || this.endDate == null)) {


          date = pipe.transform(this.data[i].x, 'yyyy-MM-dd');

          if (i + 1 < this.data.length) {
            let nextdate = pipe.transform(this.data[i + 1].x, 'yyyy-MM-dd');
            if (date == nextdate) {

              count++;

            }
            else {

              count++;


              this.datas.labels.push(date);
              valueArray.push(count);
              count = 0;
            }
          }
          if (i == this.data.length - 1) {
            count++;
            valueArray.push(count);
          }
        }

      }
      this.datas.datasets.push({label: 'Aktivitäten', backgroundColor: '#21568c', borderColor: '#21568c', data: valueArray});
      count = 0;
      valueArray= [];
      for (let i = 0; i < this.dataComment.length; i++) {
        if ((this.dataComment[i].x.toString() > startDate || this.startDate == null) && (this.dataComment[i].x.toString() < endDate || this.endDate == null)) {


          date = pipe.transform(this.dataComment[i].x, 'yyyy-MM-dd');

          if (i + 1 < this.dataComment.length) {
            let nextdate = pipe.transform(this.dataComment[i + 1].x, 'yyyy-MM-dd');
            if (date == nextdate) {

              count++;

            }
            else {

              count++;
              valueArray.push(count);
              count = 0;
            }
          }
          if (i == this.dataComment.length - 1) {
            count++;
            valueArray.push(count);
          }
        }

      }
      this.datas.datasets.push({label: 'Kommentare', backgroundColor: '#e9300b', borderColor: '#e9300b', data: valueArray});
      count = 0;
      valueArray= [];
      for (let i = 0; i < this.dataLawchange.length; i++) {
        if ((this.dataLawchange[i].x.toString() > startDate || this.startDate == null) && (this.dataLawchange[i].x.toString() < endDate || this.endDate == null)) {


          date = pipe.transform(this.dataLawchange[i].x, 'yyyy-MM-dd');

          if (i + 1 < this.dataLawchange.length) {
            let nextdate = pipe.transform(this.dataLawchange[i + 1].x, 'yyyy-MM-dd');
            if (date == nextdate) {

              count++;

            }
            else {

              count++;
              valueArray.push(count);
              count = 0;
            }
          }
          if (i == this.dataLawchange.length - 1) {
            count++;
            valueArray.push(count);
          }
        }

      }
      this.datas.datasets.push({label: 'Änderungsvorschläge', backgroundColor: '#7be00f', borderColor: '#7be00f', data: valueArray});
    }


    this.chart.data = this.datas;
    this.chart.update();
  }

  getArrayReady() {
    let pipe = new DatePipe('en-Us');
    this.count = 0;
    this.data = [];
    this.dataComment=[];
    this.dataLawchange=[];
    let startDate = pipe.transform(this.startDate, 'yyyy-MM-dd hh:mm:ss');
    let endDate = pipe.transform(this.endDate, 'yyyy-MM-dd hh:mm:ss');
    if (this.users != null) {
      for (let i = 0; i < this.users.length; i++) {
        if (this.selectedEducation == null || this.users[i].ausbildung == this.selectedEducation.ausbildungs_id) {
          if (this.selectedLegalExpertise == null || this.users[i].rechtskenntnisse == this.selectedLegalExpertise.rechtskenntnis_id) {
            if (this.minYear == null || this.minYear < this.users[i].geb_jahr) {
              if (this.maxYear == null || this.maxYear > this.users[i].geb_jahr) {
                for (let y = 0; y < this.users[i].aktivitaeten.length; y++) {
                  if ((this.users[i].aktivitaeten[y].datum.toString() > startDate || this.startDate == null) && (this.users[i].aktivitaeten[y].datum.toString() < endDate || this.endDate == null)) {

                    this.count++;
                    this.data.push({y: this.count, x: this.users[i].aktivitaeten[y].datum});
                    if(this.users[i].aktivitaeten[y].aktivitaet=='comment')
                    {

                      this.dataComment.push({y: this.count, x: this.users[i].aktivitaeten[y].datum});
                    }
                    if(this.users[i].aktivitaeten[y].aktivitaet=='lawChange')
                    {
                      this.dataLawchange.push({y: this.count, x: this.users[i].aktivitaeten[y].datum});
                    }

                  }
                }
              }
            }
          }
        }
      }
      this.data.sort((a: { x: Date, y: number }, b: { x: Date, y: number }) => {
        return a.x < b.x ? -1 : a.x > b.x ? 1 : 0;
      });
      this.dataComment.sort((a: { x: Date, y: number }, b: { x: Date, y: number }) => {
        return a.x < b.x ? -1 : a.x > b.x ? 1 : 0;
      });
      this.dataLawchange.sort((a: { x: Date, y: number }, b: { x: Date, y: number }) => {
        return a.x < b.x ? -1 : a.x > b.x ? 1 : 0;
      });

    }
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

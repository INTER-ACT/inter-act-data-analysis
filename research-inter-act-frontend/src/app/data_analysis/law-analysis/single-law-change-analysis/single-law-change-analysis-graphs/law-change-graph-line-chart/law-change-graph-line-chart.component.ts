import {Component, Input, OnInit} from '@angular/core';
import {Rating} from '../../../single-law-analysis/single-law-analysis-facts/facts-ratings-bar-chart/rating';
import {Law} from '../../../../../csv-export/laws/law/law';
import {User} from '../../../../../consolidated_law/example-view/user';
import {Comment} from '../../../../../csv-export/comments/comment/comment';
import {DatePipe} from '@angular/common';
import { Chart } from 'chart.js';
import {LawChange} from '../../../../../csv-export/law-changes/law-change/law-change';

@Component({
  selector: 'app-law-change-graph-line-chart',
  templateUrl: './law-change-graph-line-chart.component.html',
  styleUrls: ['./law-change-graph-line-chart.component.css']
})
export class LawChangeGraphLineChartComponent  {

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
            }]
          }
        }
      });

    }
  }
  lawChanges: LawChange[];
  @Input('lawChanges') set LawChanges(value: LawChange[])
  {
    if(value!= null) {
      if(this.lawChanges==null||value.length!==this.lawChanges.length) {
        this.lawChanges = value;
        this.updateChart();
      }
    }
  }
  comments: Comment[];
  @Input('comments') set Comments(value: Comment[])
  {
    if(value!= null) {
      if(this.comments==null||value.length!==this.comments.length) {
        this.comments = value;
        this.updateChart();
      }
    }
  }
  ratings: Rating[];
  @Input('ratings') set Ratings(value: Rating[])
  {
    if(value!= null) {
      if(this.ratings==null||value.length!==this.ratings.length) {
        this.ratings = value;
        this.updateChart();
      }
    }
  }
  law: LawChange;
  @Input('law') set Law(value: LawChange)
  {
    if(value!= null) {
      if(this.law==null||value.aenderungs_id!==this.law.aenderungs_id) {
        this.law = value;
        this.updateChart();
      }
    }
  }
  users: User[]=[];
  @Input('users') set Users(value: User[])
  {
    this.generate();
    if(value!= null) {
      if(this.users==null||value.length!==this.users.length) {
        this.users = value;
        this.updateChart();
      }
    }
  }
  selectedEducation:{ausbildungs_id,ausbildung};
  @Input('selectedEducation') set SelectedEducation(value: {ausbildungs_id,ausbildung})
  {

    if(value!= null) {
      if(value!==this.selectedEducation) {
        this.selectedEducation = value;
        this.updateChart();
      }
    }


  }
  selectedLegalExpertise: {rechtskenntnis_id, rechtskenntnis};
  @Input('selectedLegalExpertise') set SelectedLegalExpertise(value: {rechtskenntnis_id, rechtskenntnis})
  {
    if(value!= null) {
      if(value!==this.selectedLegalExpertise) {
        this.selectedLegalExpertise = value;
        this.updateChart();
      }
    }
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
  searchUsers: number[]=[];
  data:{x:Date,y:number}[]=[];
  alldata:{x:Date,y:number}[]=[];
  datas: {fill, borderColor,label: string,data}[]=[];


  constructor() {}

  updateChart() {
    this.searchUsers=[];
    this.getArrayReady();
    let pipe = new DatePipe('en-Us');
    this.datas=[];
    this.alldata=[];
    this.count = 0;
    this.data = [];
    let startDate=pipe.transform(this.startDate, 'yyyy-MM-dd hh:mm:ss');
    let endDate=pipe.transform(this.endDate, 'yyyy-MM-dd hh:mm:ss');
    if(this.searchUsers!=null&&this.lawChanges!=null&&this.ratings!=null&&this.comments!=null&&this.law!=null) {
      for (let i = 0; i < this.lawChanges.length; i++) {
        let selectedUser=false;
        if(this.lawChanges[i].aenderungs_bezugs_id==this.law.aenderungs_id&&this.lawChanges[i].typ=='v') {
          for (let y = 0; y < this.searchUsers.length; y++) {
            if(this.searchUsers[y]==this.lawChanges[i].user_id)
            {
              selectedUser=true;

            }
          }
          if(selectedUser==true) {
            if ((this.lawChanges[i].datum.toString() > startDate || this.startDate == null) && (this.lawChanges[i].datum.toString() < endDate || this.endDate == null)) {
              this.count++;
              this.data.push({y: this.count, x: this.lawChanges[i].datum});
              this.alldata.push({y: this.count, x: this.lawChanges[i].datum});
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
      this.datas.push({label: 'Änderungen', fill: null, borderColor: '#e9300b', data: this.data});


      this.count=0;
      this.data=[];
      for (let i = 0; i < this.comments.length; i++) {
        let selectedUser=false;
        if(this.comments[i].kommentar_bezugs_id==this.law.aenderungs_id&&this.comments[i].typ=='v') {
          for (let y = 0; y < this.searchUsers.length; y++) {
            if(this.searchUsers[y]==this.comments[i].user_id)
            {
              selectedUser=true;
            }
          }
          if(selectedUser==true) {
            if ((this.comments[i].datum.toString() > startDate || this.startDate == null) && (this.comments[i].datum.toString() < endDate || this.endDate == null)) {
              this.count++;
              this.data.push({y: this.count, x: this.comments[i].datum});
              this.alldata.push({y: this.count, x: this.comments[i].datum});
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
      this.datas.push({label: 'Kommentare', fill: null, borderColor: '#21568c', data: this.data});

      this.count=0;
      this.data=[];
      for (let i = 0; i < this.ratings.length; i++) {
        let selectedUser = false;
        if (this.ratings[i].rating_bezugs_id == this.law.aenderungs_id && this.ratings[i].typ == 'v') {
          for (let y = 0; y < this.searchUsers.length; y++) {
            if (this.searchUsers[y] == this.ratings[i].user_id) {
              selectedUser = true;
            }
          }
          if (selectedUser == true) {
            if ((this.ratings[i].datum.toString() > startDate || this.startDate == null) && (this.ratings[i].datum.toString() < endDate || this.endDate == null)) {
              this.count++;
              this.data.push({y: this.count, x: this.ratings[i].datum});
              this.alldata.push({y: this.count, x: this.ratings[i].datum});
            }
          }
        }

      }
      this.data.sort((a: { x: Date, y: number }, b: { x: Date, y: number }) => {
        return a.x < b.x ? -1 : a.x > b.x ? 1 : 0;
      });
      for (let i=0;i<this.data.length;i++)
      {
        this.data[i].y=i+1;
      }
      this.datas.push({label: 'Bewertungen', fill: null, borderColor: '#7be00f', data: this.data});
      this.alldata.sort((a: { x: Date, y: number }, b: { x: Date, y: number }) => {
        return a.x < b.x ? -1 : a.x > b.x ? 1 : 0;
      });
      for (let i=0;i<this.alldata.length;i++)
      {
        this.alldata[i].y=i+1;
      }
      this.datas.push({label: 'Alles', fill: null, borderColor: '#0ed8cd', data: this.alldata});
      this.chart.data.datasets=this.datas;
      this.chart.update();
    }


  }
  getArrayReady() {
    this.data = [];
    if (this.users != null&&this.users.length>0) {
      for (let i = 0; i < this.users.length; i++) {
        if (this.selectedEducation == null || this.users[i].ausbildung == this.selectedEducation.ausbildungs_id) {
          if (this.selectedLegalExpertise == null || this.users[i].rechtskenntnisse == this.selectedLegalExpertise.rechtskenntnis_id) {
            if (this.minYear == null || this.minYear < this.users[i].geb_jahr) {
              if (this.maxYear == null || this.maxYear > this.users[i].geb_jahr) {
                this.searchUsers.push( this.users[i].user_id);

              }
            }
          }
        }
      }
    }
  }




}

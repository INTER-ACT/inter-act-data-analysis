import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../../consolidated_law/example-view/user';
import {DatePipe} from '@angular/common';
import { Chart } from 'chart.js';
import {Comment} from '../../../../../csv-export/comments/comment/comment';
import {Law} from '../../../../../csv-export/laws/law/law';
import {count} from 'rxjs/operators';

@Component({
  selector: 'app-comment-bar-chart',
  templateUrl: './comment-bar-chart.component.html',
  styleUrls: ['./comment-bar-chart.component.css']
})
export class CommentBarChartComponent{
  users: User[]=[];
  law:Law;
  @Input('law') set Law(value: Law)
  {
    this.law=value;
    if(this.comments!=null&&this.law!=null) {
      this.updateChart();
    }
  }
  comments:Comment[];
  @Input('comments') set Comments(value: Comment[])
  {
    if(this.chart==null)
    {

      this.generate();
    }


    if(value!=null&&value!=[]&&this.law!=null)
    {



          this.comments=value;



    }

    this.updateChart();
  }


  @Input('users') set Users(value: User[])
  {
    this.users=value;
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
  data:number[]=[];
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
    if (this.data != null && this.data != []&&this.comments!=null) {
      let like: number[] = [];
      let dislike:number[]=[];
      let countlike=0;
      let countdislike=0;
      let date;
      for (let i = 0; i < this.comments.length; i++) {

        if(this.comments[i].kommentare_likes.length>0) {
          if (this.comments[i].typ == 'g' && this.comments[i].kommentar_bezugs_id == this.law.gesetzes_id) {
            countdislike=0;
            countlike=0;
          for (let y = 0; y < this.comments[i].kommentare_likes.length; y++) {
              let selectedUser = false;
              for (let x = 0; x < this.data.length; x++) {
                if (this.data[x] == this.comments[i].kommentare_likes[y].user_id) {
                  selectedUser = true;
                }
              }
              if (selectedUser == true) {
                if((this.comments[i].kommentare_likes[y].datum.toString()>startDate|| this.startDate==null)&& (this.comments[i].kommentare_likes[y].datum.toString()<endDate||this.endDate==null) ) {

                  if (this.comments[i].kommentare_likes[y].bewertung == 1) {


                    countlike++;
                  }
                  else {
                    countdislike++;
                  }
                }
              }
            }
            like.push(countlike);
            dislike.push(countdislike);
            this.datas.labels.push('Kom. '+i+1);
          }

        }


      }

      this.datas.datasets.push({label: 'Likes', backgroundColor: '#21568c', borderColor: '#21568c', data: like});
      this.datas.datasets.push({label: 'Dislikes', backgroundColor: '#e9300b', borderColor: '#e9300b', data: dislike});

    }

    this.chart.data = this.datas;
    this.chart.update();
  }



  getArrayReady() {
    this.data = [];
    if (this.users != null&&this.comments!=null) {
      for (let i = 0; i < this.users.length; i++) {
        if (this.selectedEducation == null || this.users[i].ausbildung == this.selectedEducation.ausbildungs_id) {
          if (this.selectedLegalExpertise == null || this.users[i].rechtskenntnisse == this.selectedLegalExpertise.rechtskenntnis_id) {
            if (this.minYear == null || this.minYear < this.users[i].geb_jahr) {
              if (this.maxYear == null || this.maxYear > this.users[i].geb_jahr) {
                    this.data.push( this.users[i].user_id);
                }
              }
          }
        }
      }
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
                labelString: 'Anzahl der Likes/Dislikes'
              }
            }]
          }

        }
      });

    }
  }
}

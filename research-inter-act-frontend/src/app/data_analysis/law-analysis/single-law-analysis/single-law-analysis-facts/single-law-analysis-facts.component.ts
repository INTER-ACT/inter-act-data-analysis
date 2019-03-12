import { Component, OnInit } from '@angular/core';
import {Law} from '../../../../csv-export/laws/law/law';
import {LawAnalysisService} from '../../law-analysis.service';
import {RatingsService} from './facts-ratings-bar-chart/ratings.service';
import {Comment} from '../../../../csv-export/comments/comment/comment';
import {Rating} from './facts-ratings-bar-chart/rating';

@Component({
  selector: 'app-single-law-analysis-facts',
  templateUrl: './single-law-analysis-facts.component.html',
  styleUrls: ['./single-law-analysis-facts.component.css']
})
export class SingleLawAnalysisFactsComponent implements OnInit {

  law:Law;
  rating:Rating[];
  constructor(private lawAnalysisService:LawAnalysisService,private ratingsService:RatingsService
              ){}


  ngOnInit(): void {
    this.lawAnalysisService.law$.subscribe(law=>this.law=law);
    this.ratingsService.getRatings().subscribe((rating:Rating[])=>{
      this.rating=rating;
    });
  }

}

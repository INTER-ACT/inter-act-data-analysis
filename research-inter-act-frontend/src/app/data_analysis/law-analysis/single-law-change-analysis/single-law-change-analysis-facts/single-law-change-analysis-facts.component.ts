import { Component, OnInit } from '@angular/core';
import {LawAnalysisService} from '../../law-analysis.service';
import {RatingsService} from '../../single-law-analysis/single-law-analysis-facts/facts-ratings-bar-chart/ratings.service';
import {Rating} from '../../single-law-analysis/single-law-analysis-facts/facts-ratings-bar-chart/rating';
import {Law} from '../../../../csv-export/laws/law/law';
import {LawChange} from '../../../../csv-export/law-changes/law-change/law-change';

@Component({
  selector: 'app-single-law-change-analysis-facts',
  templateUrl: './single-law-change-analysis-facts.component.html',
  styleUrls: ['./single-law-change-analysis-facts.component.css']
})
export class SingleLawChangeAnalysisFactsComponent implements OnInit {

  lawChange:LawChange;
  rating:Rating[];
  constructor(private lawAnalysisService:LawAnalysisService,private ratingsService:RatingsService) { }

  ngOnInit() {
    this.lawAnalysisService.lawChange$.subscribe(law=>this.lawChange=law);
    this.ratingsService.getRatings().subscribe((rating:Rating[])=>{
      this.rating=rating;
    });
  }

}

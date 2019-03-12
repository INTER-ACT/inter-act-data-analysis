import { Component, OnInit } from '@angular/core';
import {Moment} from 'moment';
import {Observable} from 'rxjs';
import {Education} from '../../general-law-analysis/education';
import {LegalExpertise} from '../../general-law-analysis/legal-expertise';
import {User} from '../../../../consolidated_law/example-view/user';
import {EducationService} from '../../general-law-analysis/education.service';
import {LegalExpertiseService} from '../../general-law-analysis/legal-expertise.service';
import {UserService} from '../../../../consolidated_law/example-view/user.service';
import {LawAnalysisService} from '../../law-analysis.service';
import {Law} from '../../../../csv-export/laws/law/law';
import {Rating} from '../single-law-analysis-facts/facts-ratings-bar-chart/rating';
import {Comment} from '../../../../csv-export/comments/comment/comment';
import {RatingsService} from '../single-law-analysis-facts/facts-ratings-bar-chart/ratings.service';
import {CommentsService} from '../../../../csv-export/comments/comments.service';
import {LawChangesService} from '../../../../csv-export/law-changes/law-changes.service';
import {LawChange} from '../../../../csv-export/law-changes/law-change/law-change';

@Component({
  selector: 'app-single-law-analysis-graphs',
  templateUrl: './single-law-analysis-graphs.component.html',
  styleUrls: ['./single-law-analysis-graphs.component.css']
})
export class SingleLawAnalysisGraphsComponent implements OnInit {

  selected: {startDate: Moment, endDate: Moment};
  educations:Observable<Education[]>;
  legalExpertises:Observable<LegalExpertise[]>;
  selectedEducation:Education=null;
  selectedLegalExpertise:LegalExpertise=null;
  minAge:number=null;
  maxAge:number=null;
  users:User[];
  law:Law;
  ratings:Rating[];
  comments:Comment[];
  lawChanges:LawChange[];

  constructor(private educationService:EducationService,
              private legalExpertiseService:LegalExpertiseService,
              private userService:UserService,
              private lawAnalysisService:LawAnalysisService,
              private ratingsService:RatingsService,
              private commentService:CommentsService) { }

  ngOnInit() {
    this.lawAnalysisService.law$.subscribe(law=>this.law=law);
    this.educations = this.educationService.educations;
    this.legalExpertises = this.legalExpertiseService.legalExpertises;
    this.educationService.educations.subscribe(educations=>{
      if (educations.length == 0) {
        this.educationService.loadAll();
        return;
      }
    });
    this.legalExpertiseService.legalExpertises.subscribe(legalExpertises=>{
      if (legalExpertises.length == 0){
        this.legalExpertiseService.loadAll();
        return;
      }
    });
    this.userService.loadAllWithActivities();
    this.userService.users.subscribe(users=>{
      if (users.length==0) {
        this.userService.loadAllWithActivities();
        return;
      }
      this.users=users;
    });
    this.commentService.getComments().subscribe((comments:Comment[])=>{
      this.comments=comments;
    })
    this.ratingsService.getRatings().subscribe((ratings:Rating[])=>{
      this.ratings=ratings;
    });
    this.ratingsService.getLawChanges().subscribe((lawChanges:LawChange[])=>{
      this.lawChanges=lawChanges;
    })

  }

}

import { Component, OnInit } from '@angular/core';
import {Moment} from 'moment';
import {Observable} from 'rxjs';
import {Education} from '../../general-law-analysis/education';
import {LegalExpertise} from '../../general-law-analysis/legal-expertise';
import {User} from '../../../../consolidated_law/example-view/user';
import {Law} from '../../../../csv-export/laws/law/law';
import {EducationService} from '../../general-law-analysis/education.service';
import {LegalExpertiseService} from '../../general-law-analysis/legal-expertise.service';
import {UserService} from '../../../../consolidated_law/example-view/user.service';
import {LawAnalysisService} from '../../law-analysis.service';
import {LawChange} from '../../../../csv-export/law-changes/law-change/law-change';
import {Comment} from '../../../../csv-export/comments/comment/comment';
import {CommentsService} from '../../../../csv-export/comments/comments.service';

@Component({
  selector: 'app-single-law-change-analysis-comments',
  templateUrl: './single-law-change-analysis-comments.component.html',
  styleUrls: ['./single-law-change-analysis-comments.component.css']
})
export class SingleLawChangeAnalysisCommentsComponent implements OnInit {

  selected: {startDate: Moment, endDate: Moment};
  educations:Observable<Education[]>;
  legalExpertises:Observable<LegalExpertise[]>;
  selectedEducation:Education=null;
  selectedLegalExpertise:LegalExpertise=null;
  minAge:number=null;
  maxAge:number=null;
  users:User[];
  lawChange:LawChange;
  comments:Comment[];

  constructor(private educationService:EducationService,
              private legalExpertiseService:LegalExpertiseService,
              private userService:UserService,
              private lawAnalysisService:LawAnalysisService,
              private commentService:CommentsService) { }

  ngOnInit() {
    this.lawAnalysisService.lawChange$.subscribe(lawChange=>this.lawChange=lawChange);
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
    });

  }


}

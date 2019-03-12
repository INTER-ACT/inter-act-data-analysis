import { Component, OnInit } from '@angular/core';
import {Law} from '../../../../csv-export/laws/law/law';
import {Observable, Subscription} from 'rxjs';
import {LawsService} from '../../../../csv-export/laws/laws.service';
import {Moment} from 'moment';
import {Education} from '../../general-law-analysis/education';
import {LegalExpertise} from '../../general-law-analysis/legal-expertise';
import {User} from '../../../../consolidated_law/example-view/user';
import {EducationService} from '../../general-law-analysis/education.service';
import {LegalExpertiseService} from '../../general-law-analysis/legal-expertise.service';
import {UserService} from '../../../../consolidated_law/example-view/user.service';
import {LawAnalysisService} from '../../law-analysis.service';
import {Comment} from '../../../../csv-export/comments/comment/comment';
import {CommentsService} from '../../../../csv-export/comments/comments.service';

@Component({
  selector: 'app-single-law-analysis-comments',
  templateUrl: './single-law-analysis-comments.component.html',
  styleUrls: ['./single-law-analysis-comments.component.css']
})
export class SingleLawAnalysisCommentsComponent implements OnInit {

  selected: {startDate: Moment, endDate: Moment};
  educations:Observable<Education[]>;
  legalExpertises:Observable<LegalExpertise[]>;
  selectedEducation:Education=null;
  selectedLegalExpertise:LegalExpertise=null;
  minAge:number=null;
  maxAge:number=null;
  users:User[];
  law:Law;
  comments:Comment[];

  constructor(private educationService:EducationService,
              private legalExpertiseService:LegalExpertiseService,
              private userService:UserService,
              private lawAnalysisService:LawAnalysisService,
              private commentService: CommentsService) { }

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
    })
    this.commentService.getComments().subscribe((comments:Comment[])=>{
      this.comments=comments;
    })

  }

}

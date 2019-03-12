import { Component, OnInit } from '@angular/core';
import {Moment} from 'moment';
import {Observable} from 'rxjs';
import {Education} from './education';
import {LegalExpertise} from './legal-expertise';
import {EducationService} from './education.service';
import {LegalExpertiseService} from './legal-expertise.service';
import {UserService} from '../../../consolidated_law/example-view/user.service';
import {User} from '../../../consolidated_law/example-view/user';

@Component({
  selector: 'app-general-law-analysis',
  templateUrl: './general-law-analysis.component.html',
  styleUrls: ['./general-law-analysis.component.css']
})
export class GeneralLawAnalysisComponent implements OnInit {

  selected: {startDate: Moment, endDate: Moment};
  educations:Observable<Education[]>;
  legalExpertises:Observable<LegalExpertise[]>;
  selectedEducation:Education=null;
  selectedLegalExpertise:LegalExpertise=null;
  minAge:number=null;
  maxAge:number=null;
  users:User[];

  constructor(private educationService:EducationService,
              private legalExpertiseService:LegalExpertiseService,
              private userService:UserService) { }

  ngOnInit() {
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

  }


}

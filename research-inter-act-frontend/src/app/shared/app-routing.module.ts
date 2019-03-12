import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LawsComponent} from '../csv-export/laws/laws.component';
import {LawChangesComponent} from '../csv-export/law-changes/law-changes.component';
import {CommentsComponent} from '../csv-export/comments/comments.component';
import {UsersRatingsTagsComponent} from '../csv-export/users-ratings-tags/users-ratings-tags.component';
import {CommentDetailsComponent} from '../csv-export/comments/comment/comment-details/comment-details.component';
import {LawDetailsComponent} from '../csv-export/laws/law/law-details/law-details.component';
import {LawChangeDetailsComponent} from '../csv-export/law-changes/law-change/law-change-details/law-change-details.component';
import {ConsolidatedLawOverviewComponent} from '../consolidated_law/consolidated-law-overview.component';
import {UserAnalysisComponent} from '../data_analysis/user-analysis/user-analysis.component';
import {WordcloudAnalysisComponent} from '../data_analysis/wordcloud-analysis/wordcloud-analysis.component';
import {WordcloudLawAnalysisComponent} from '../data_analysis/wordcloud-analysis/wordcloud-law-analysis/wordcloud-law-analysis.component';
import {LawAnalysisComponent} from '../data_analysis/law-analysis/law-analysis.component';
import {GeneralLawAnalysisComponent} from '../data_analysis/law-analysis/general-law-analysis/general-law-analysis.component';
import {SingleLawChangeAnalysisComponent} from '../data_analysis/law-analysis/single-law-change-analysis/single-law-change-analysis.component';
import {SingleLawAnalysisFactsComponent} from '../data_analysis/law-analysis/single-law-analysis/single-law-analysis-facts/single-law-analysis-facts.component';
import {SingleLawAnalysisGraphsComponent} from '../data_analysis/law-analysis/single-law-analysis/single-law-analysis-graphs/single-law-analysis-graphs.component';
import {SingleLawAnalysisCommentsComponent} from '../data_analysis/law-analysis/single-law-analysis/single-law-analysis-comments/single-law-analysis-comments.component';
import {SingleLawAnalysisComponent} from '../data_analysis/law-analysis/single-law-analysis/single-law-analysis.component';
import {SingleLawChangeAnalysisFactsComponent} from '../data_analysis/law-analysis/single-law-change-analysis/single-law-change-analysis-facts/single-law-change-analysis-facts.component';
import {SingleLawChangeAnalysisGraphsComponent} from '../data_analysis/law-analysis/single-law-change-analysis/single-law-change-analysis-graphs/single-law-change-analysis-graphs.component';
import {SingleLawChangeAnalysisCommentsComponent} from '../data_analysis/law-analysis/single-law-change-analysis/single-law-change-analysis-comments/single-law-change-analysis-comments.component';


const appRoutes: Routes=[
  {path: 'csv_export', children:[
      {path: 'paragraphendiskussionen', component: LawsComponent},
      {path: 'paragraphendiskussionen/:id', component: LawDetailsComponent},
      {path: 'aenderungsvorschlaege', component: LawChangesComponent},
      {path: 'aenderungsvorschlaege/:id', component: LawChangeDetailsComponent},
      {path: 'kommentare', component: CommentsComponent},
      {path: 'kommentare/:id', component: CommentDetailsComponent},
      {path: 'user_ratings_tags', component: UsersRatingsTagsComponent},
      {path: '', redirectTo: 'paragraphendiskussionen',pathMatch: 'full'},
      {path: '**', redirectTo: 'paragraphendiskussionen', pathMatch: 'full'}
    ]},
  {path:'konsolidierte_gesetzesfassung', component: ConsolidatedLawOverviewComponent},
  {path:'datenanalyse',children:[
      {path:'user',component:UserAnalysisComponent},
      {path:'wordcloud',component:WordcloudAnalysisComponent,children:[
          {path:'',component:WordcloudLawAnalysisComponent},
          {path:':id',component:WordcloudLawAnalysisComponent}
        ]},
      {path:'paragraphendiskussionen',component:LawAnalysisComponent,children:[
          {path:'',component:GeneralLawAnalysisComponent},
          {path:'paragraph',component:SingleLawAnalysisComponent,children:[
              {path:':id',component:SingleLawAnalysisFactsComponent},
              {path:':id/fakten',component:SingleLawAnalysisFactsComponent},
              {path:':id/diagramme',component:SingleLawAnalysisGraphsComponent},
              {path:':id/kommentare',component:SingleLawAnalysisCommentsComponent}
            ]},
          {path:'aenderungsvorschlag',component:SingleLawChangeAnalysisComponent,children:[
              {path:':id',component:SingleLawChangeAnalysisFactsComponent},
              {path:':id/fakten',component:SingleLawChangeAnalysisFactsComponent},
              {path:':id/diagramme',component:SingleLawChangeAnalysisGraphsComponent},
              {path:':id/kommentare',component:SingleLawChangeAnalysisCommentsComponent}
            ]}
        ]}
    ]},
  {path: '', redirectTo: 'csv_export/paragraphendiskussionen',pathMatch: 'full'},
  {path: '**', redirectTo: 'csv_export/paragraphendiskussionen',pathMatch: 'full'}
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }

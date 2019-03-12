import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {LawsComponent} from './csv-export/laws/laws.component';
import {CommentsComponent} from './csv-export/comments/comments.component';
import {LawChangesComponent} from './csv-export/law-changes/law-changes.component';
import {UsersRatingsTagsComponent} from './csv-export/users-ratings-tags/users-ratings-tags.component';
import {HttpClientModule} from '@angular/common/http';
import {CommentComponent} from './csv-export/comments/comment/comment.component';
import {AppRoutingModule} from './shared/app-routing.module';
import {CommentsFilterPipe} from './csv-export/comments/comments-filter.pipe';
import {FormsModule} from '@angular/forms';
import {CommentDetailsComponent} from './csv-export/comments/comment/comment-details/comment-details.component';
import {LawComponent} from './csv-export/laws/law/law.component';
import {LawsFilterPipe} from './csv-export/laws/laws-filter.pipe';
import {LawsSorterPipe} from './csv-export/laws/laws-sorter.pipe';
import {PopoverModule} from 'ngx-popover';
import {LawDetailsComponent} from './csv-export/laws/law/law-details/law-details.component';
import {LawChangeComponent} from './csv-export/law-changes/law-change/law-change.component';
import {LawChangeDetailsComponent} from './csv-export/law-changes/law-change/law-change-details/law-change-details.component';
import {LawChangesFilterPipe} from './csv-export/law-changes/law-changes-filter.pipe';
import {LawChangesSorterPipe} from './csv-export/law-changes/law-changes-sorter.pipe';
import {LoadingAnimationComponent} from './shared/loading-animation/loading-animation.component';
import {SelectCommentColumnsComponent} from './csv-export/comments/comment/comment-details/select-comment-columns/select-comment-columns.component';
import {CloseMenuDirective} from './shared/navbar/close-menu.directive';
import {SelectedCommentColumnComponent} from './csv-export/comments/comment/comment-details/select-comment-columns/selected-comment-column/selected-comment-column.component';
import {DeselectedCommentColumnComponent} from './csv-export/comments/comment/comment-details/select-comment-columns/deselected-comment-column/deselected-comment-column.component';
import { SelectCommentReferencesComponent } from './csv-export/comments/comment/comment-details/select-comment-references/select-comment-references.component';
import { SelectCommentTableComponent } from './csv-export/comments/comment/comment-details/select-comment-table/select-comment-table.component';
import { SortCommentColumnsPipe } from './csv-export/comments/comment/comment-details/select-comment-table/sort-comment-columns.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TypToReferenzPipePipe } from './shared/pipes/typ-to-referenz-pipe.pipe';
import { NumberToArrayPipe } from './shared/pipes/number-to-array.pipe';
import { RemoveFirstElementFromArrayPipe } from './shared/pipes/remove-first-element-of-array.pipe';
import { RemoveHtmlTagsFromStringPipe } from './shared/pipes/remove-html-tags-from-string.pipe';
import { ShortenStringPipe } from './shared/pipes/shorten-string.pipe';
import { SelectLawColumnsComponent } from './csv-export/laws/law/law-details/select-law-columns/select-law-columns.component';
import { SelectedLawColumnComponent } from './csv-export/laws/law/law-details/select-law-columns/selected-law-column/selected-law-column.component';
import { DeselectedLawColumnComponent } from './csv-export/laws/law/law-details/select-law-columns/deselected-law-column/deselected-law-column.component';
import { SortLawColumnsPipe } from './csv-export/laws/law/law-details/select-law-columns/sort-law-columns.pipe';
import { SelectLawReferencesComponent } from './csv-export/laws/law/law-details/select-law-references/select-law-references.component';
import { SelectLawTableComponent } from './csv-export/laws/law/law-details/select-law-table/select-law-table.component';
import { SelectLawChangeColumnsComponent } from './csv-export/law-changes/law-change/law-change-details/select-law-change-columns/select-law-change-columns.component';
import { SelectedLawChangeColumnComponent } from './csv-export/law-changes/law-change/law-change-details/select-law-change-columns/selected-law-change-column/selected-law-change-column.component';
import { DeselectedLawChangeColumnComponent } from './csv-export/law-changes/law-change/law-change-details/select-law-change-columns/deselected-law-change-column/deselected-law-change-column.component';
import { SortLawChangeColumnsPipe } from './csv-export/law-changes/law-change/law-change-details/select-law-change-columns/sort-law-change-columns.pipe';
import { SelectLawChangeReferencesComponent } from './csv-export/law-changes/law-change/law-change-details/select-law-change-references/select-law-change-references.component';
import { SelectLawChangeTableComponent } from './csv-export/law-changes/law-change/law-change-details/select-law-change-table/select-law-change-table.component';
import { ConsolidatedLawOverviewComponent } from './consolidated_law/consolidated-law-overview.component';
import { SettingButtonComponent } from './consolidated_law/setting-button/setting-button.component';
import { ExampleViewComponent } from './consolidated_law/example-view/example-view.component';
import {NgSelectModule} from '@ng-select/ng-select';
import { OnlyNumbersDirective } from './shared/directives/only-numbers.directive';
import { SafePipe } from './shared/pipes/safe.pipe';
import { UserAnalysisComponent } from './data_analysis/user-analysis/user-analysis.component';
import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';
import { WordcloudAnalysisComponent } from './data_analysis/wordcloud-analysis/wordcloud-analysis.component';
import { WordcloudLawAnalysisComponent } from './data_analysis/wordcloud-analysis/wordcloud-law-analysis/wordcloud-law-analysis.component';
import {UserLineChartComponent} from './data_analysis/user-analysis/user-line-chart/user-line-chart.component';
import { GeneralLawAnalysisComponent } from './data_analysis/law-analysis/general-law-analysis/general-law-analysis.component';
import {LawAnalysisComponent} from './data_analysis/law-analysis/law-analysis.component';
import { SingleLawChangeAnalysisComponent } from './data_analysis/law-analysis/single-law-change-analysis/single-law-change-analysis.component';
import { WordcloudLineChartComponent } from './data_analysis/wordcloud-analysis/wordcloud-line-chart/wordcloud-line-chart.component';
import { SingleLawAnalysisFactsComponent } from './data_analysis/law-analysis/single-law-analysis/single-law-analysis-facts/single-law-analysis-facts.component';
import { SingleLawAnalysisGraphsComponent } from './data_analysis/law-analysis/single-law-analysis/single-law-analysis-graphs/single-law-analysis-graphs.component';
import { SingleLawAnalysisCommentsComponent } from './data_analysis/law-analysis/single-law-analysis/single-law-analysis-comments/single-law-analysis-comments.component';
import { SingleLawAnalysisComponent } from './data_analysis/law-analysis/single-law-analysis/single-law-analysis.component';
import { WordcloudBarChartComponent } from './data_analysis/wordcloud-analysis/wordcloud-bar-chart/wordcloud-bar-chart.component';
import { GeneralLawLineChartComponent } from './data_analysis/law-analysis/general-law-analysis/general-law-line-chart/general-law-line-chart.component';
import { SingleLawChangeAnalysisCommentsComponent } from './data_analysis/law-analysis/single-law-change-analysis/single-law-change-analysis-comments/single-law-change-analysis-comments.component';
import { SingleLawChangeAnalysisFactsComponent } from './data_analysis/law-analysis/single-law-change-analysis/single-law-change-analysis-facts/single-law-change-analysis-facts.component';
import { SingleLawChangeAnalysisGraphsComponent } from './data_analysis/law-analysis/single-law-change-analysis/single-law-change-analysis-graphs/single-law-change-analysis-graphs.component';
import {GeneralLawBarChartComponent} from './data_analysis/law-analysis/general-law-analysis/general-law-bar-chart/general-law-bar-chart.component';
import {FactsGeneralBarChartComponent} from './data_analysis/law-analysis/single-law-analysis/single-law-analysis-facts/facts-general-bar-chart/facts-general-bar-chart.component';
import { FactsRatingsBarChartComponent } from './data_analysis/law-analysis/single-law-analysis/single-law-analysis-facts/facts-ratings-bar-chart/facts-ratings-bar-chart.component';
import { CommentBarChartComponent } from './data_analysis/law-analysis/single-law-analysis/single-law-analysis-comments/comment-bar-chart/comment-bar-chart.component';
import { SingleLawLineChartComponent } from './data_analysis/law-analysis/single-law-analysis/single-law-analysis-graphs/single-law-line-chart/single-law-line-chart.component';
import { LawChangeCommentsBarChartComponent } from './data_analysis/law-analysis/single-law-change-analysis/single-law-change-analysis-comments/law-change-comments-bar-chart/law-change-comments-bar-chart.component';
import { LawChangeGeneralFactsBarChartComponent } from './data_analysis/law-analysis/single-law-change-analysis/single-law-change-analysis-facts/law-change-general-facts-bar-chart/law-change-general-facts-bar-chart.component';
import { LawChangeRatingsBarChartComponent } from './data_analysis/law-analysis/single-law-change-analysis/single-law-change-analysis-facts/law-change-ratings-bar-chart/law-change-ratings-bar-chart.component';
import { LawChangeGraphLineChartComponent } from './data_analysis/law-analysis/single-law-change-analysis/single-law-change-analysis-graphs/law-change-graph-line-chart/law-change-graph-line-chart.component';
import { WordcloudLawLineChartComponent } from './data_analysis/wordcloud-analysis/wordcloud-law-analysis/wordcloud-law-line-chart/wordcloud-law-line-chart.component';
import { PassiveLineChartComponent } from './data_analysis/user-analysis/passive-line-chart/passive-line-chart.component';
import { ActiveLineChartComponent } from './data_analysis/user-analysis/active-line-chart/active-line-chart.component';







@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LawsComponent,
    CommentsComponent,
    LawChangesComponent,
    UsersRatingsTagsComponent,
    CommentComponent,
    CommentsFilterPipe,
    CommentDetailsComponent,
    LawComponent,
    LawsFilterPipe,
    LawsSorterPipe,
    LawDetailsComponent,
    LawChangeComponent,
    LawChangeDetailsComponent,
    LawChangesFilterPipe,
    LawChangesSorterPipe,
    LoadingAnimationComponent,
    SelectCommentColumnsComponent,
    CloseMenuDirective,
    SelectedCommentColumnComponent,
    DeselectedCommentColumnComponent,
    SelectCommentReferencesComponent,
    SelectCommentTableComponent,
    SortCommentColumnsPipe,
    TypToReferenzPipePipe,
    NumberToArrayPipe,
    RemoveFirstElementFromArrayPipe,
    RemoveHtmlTagsFromStringPipe,
    ShortenStringPipe,
    SelectLawColumnsComponent,
    SelectedLawColumnComponent,
    DeselectedLawColumnComponent,
    SortLawColumnsPipe,
    SelectLawReferencesComponent,
    SelectLawTableComponent,
    SelectLawChangeColumnsComponent,
    SelectedLawChangeColumnComponent,
    DeselectedLawChangeColumnComponent,
    SortLawChangeColumnsPipe,
    SelectLawChangeReferencesComponent,
    SelectLawChangeTableComponent,
    ConsolidatedLawOverviewComponent,
    SettingButtonComponent,
    ExampleViewComponent,
    OnlyNumbersDirective,
    SafePipe,
    UserAnalysisComponent,
    WordcloudAnalysisComponent,
    WordcloudLawAnalysisComponent,
    UserLineChartComponent,
    LawAnalysisComponent,
    GeneralLawAnalysisComponent,
    SingleLawChangeAnalysisComponent,
    WordcloudLineChartComponent,
    SingleLawAnalysisFactsComponent,
    SingleLawAnalysisGraphsComponent,
    SingleLawAnalysisCommentsComponent,
    SingleLawAnalysisComponent,
    WordcloudBarChartComponent,
    GeneralLawLineChartComponent,
    SingleLawChangeAnalysisCommentsComponent,
    SingleLawChangeAnalysisFactsComponent,
    SingleLawChangeAnalysisGraphsComponent,
    GeneralLawBarChartComponent,
    FactsGeneralBarChartComponent,
    FactsRatingsBarChartComponent,
    CommentBarChartComponent,
    SingleLawLineChartComponent,
    LawChangeCommentsBarChartComponent,
    LawChangeGeneralFactsBarChartComponent,
    LawChangeRatingsBarChartComponent,
    LawChangeGraphLineChartComponent,
    WordcloudLawLineChartComponent,
    PassiveLineChartComponent,
    ActiveLineChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    PopoverModule,
    BrowserAnimationsModule,
    NgSelectModule,
    NgxDaterangepickerMd.forRoot({
      monthNames:['Jänner', 'Februar', 'März', 'April','Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      daysOfWeek:['Mo','Di','Mi','Do','Fr','Sa','So']

    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

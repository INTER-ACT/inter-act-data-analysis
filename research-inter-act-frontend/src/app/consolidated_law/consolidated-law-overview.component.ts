import { Component, OnInit } from '@angular/core';
import {SettingService} from './setting.service';
import {Observable} from 'rxjs';
import {Setting} from './setting';
import set = Reflect.set;

@Component({
  selector: 'app-consolidated-law-overview',
  templateUrl: './consolidated-law-overview.component.html',
  styleUrls: ['./consolidated-law-overview.component.css']
})
export class ConsolidatedLawOverviewComponent implements OnInit {

  settings:Observable<Setting[]>;
  loaded:boolean=false;

  constructor(private settingService:SettingService) { }

  ngOnInit() {
    this.settings=this.settingService.settings;
    this.settingService.settings.subscribe(settings=>{
      if (settings.length == 0) {
        this.settingService.loadSettings();
        this.loaded=false;
        return;
      }
      this.loaded=true;
    })
  }

}

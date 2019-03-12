import {Component, Input, OnInit} from '@angular/core';
import {Setting} from '../setting';
import {SettingService} from '../setting.service';

@Component({
  selector: 'app-setting-button',
  templateUrl: './setting-button.component.html',
  styleUrls: ['./setting-button.component.css']
})
export class SettingButtonComponent implements OnInit {

  @Input() setting:Setting;

  constructor(private settingService:SettingService) { }

  ngOnInit() {
  }

  editSetting(value:number){
    this.setting.wert=value;
    this.settingService.editSetting(this.setting);
  }

}

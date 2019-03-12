import {Component, OnInit} from '@angular/core';
import {UsersRatingsTagsService} from './users-ratings-tags.service';
import {CsvRequest} from './csv-request.enum';

@Component({
  selector: 'app-users-ratings-tags',
  templateUrl: './users-ratings-tags.component.html',
  styleUrls: ['./users-ratings-tags.component.css']
})
export class UsersRatingsTagsComponent implements OnInit {

  loadedUsers: boolean;
  loadedRatings: boolean;
  loadedTags: boolean;

  constructor(public usersRatingsTagsService: UsersRatingsTagsService) {
    this.loadedUsers=true;
    this.loadedRatings=true;
    this.loadedTags=true;
  }

  ngOnInit() {  }


  public downloadCSV(csv: CsvRequest){
    if (csv == CsvRequest.Users) {
      this.loadedUsers=false;
      this.usersRatingsTagsService.getUsers().subscribe(x=>{
        const file = new Blob([x], {type: 'text/csv'});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }
        const data=window.URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href=data;
        link.download="Users.csv";
        link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

        setTimeout(function () {
          window.URL.revokeObjectURL(data);
        }, 100);
        this.loadedUsers=true;
      });
    }

    if (csv == CsvRequest.Ratings) {
      this.loadedRatings=false;
      this.usersRatingsTagsService.getRatings().subscribe(x=>{
        const file = new Blob([x], {type: 'text/csv'});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }
        const data=window.URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href=data;
        link.download="Ratings.csv";
        link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

        setTimeout(function () {
          window.URL.revokeObjectURL(data);
        }, 100);
        this.loadedRatings=true;
      });
    }

    if (csv == CsvRequest.Tags) {
      this.loadedTags=false;
      this.usersRatingsTagsService.getTags().subscribe(x=>{
        const file = new Blob([x], {type: 'text/csv'});
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file);
          return;
        }
        const data=window.URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href=data;
        link.download="Tags.csv";
        link.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true, view: window}));

        setTimeout(function () {
          window.URL.revokeObjectURL(data);
        }, 100);
        this.loadedTags=true;
      });
    }
  }


}

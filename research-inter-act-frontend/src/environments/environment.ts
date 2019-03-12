// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


import {HttpHeaders} from '@angular/common/http';


export const environment = {
  production: false,
  apiURL: "http://localhost:8000/api/",
  username: admin,
  password: "",
  headers: new HttpHeaders().append("Authorization", "Basic " + btoa(this.username+":"+this.password)),
  headersCSV: new HttpHeaders().append("Authorization", "Basic " + btoa(this.username+":"+this.password))
    .append("Content-Type", "application/x-www-form-urlencoded")
};


/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

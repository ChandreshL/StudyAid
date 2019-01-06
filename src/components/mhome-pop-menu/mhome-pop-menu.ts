import { Component } from '@angular/core';
import {ViewController} from "ionic-angular";


@Component({
  template: `<ion-list><button ion-item (click)="logout()">Logout</button></ion-list>`
})
export class MhomePopMenuComponent {

  constructor(public viewCtrl: ViewController) {
  }

  logout() {
    
    //confirm logout

    //logout moodle here
    //clear the user token 
    //clear the database

    //close the menu
    this.viewCtrl.dismiss();
  }

}

import { Component } from '@angular/core';
import { ViewController, App } from "ionic-angular";
import { MoodledataProvider } from './../../providers/moodledata/moodledata';



@Component({
  template: `<ion-list><button ion-item (click)="logout()">Logout</button></ion-list>`
})
export class MhomePopMenuComponent {

  constructor(
    public viewCtrl: ViewController,
    public app: App,
    private mdata: MoodledataProvider) {
  }

  logout() {
    
    //confirm logout

    //logout moodle here
    this.mdata.logout();
    
    //close the menu
    this.viewCtrl.dismiss();

    //pop to root
    this.app.getActiveNav().popToRoot();

  }

}

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MloginPage} from "../mlogin/mlogin";
import {MhomePage} from "../mhome/mhome";
import { MMessageTabsPage } from './../m-message-tabs/m-message-tabs';
import {ShomePage} from "../shome/shome";
import {LhomePage} from "../lhome/lhome";

import { MoodledataProvider } from './../../providers/moodledata/moodledata';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private mdata: MoodledataProvider
    ) {


  }

  openMoodle(page){

    this.mdata.isLoggedIn().then(value => {
      if(value){
        if(page === "home"){
          this.navCtrl.push(MhomePage);
        }else{
          this.navCtrl.push(MMessageTabsPage);
        }
      }else{
        this.navCtrl.push(MloginPage, { returnTo: page});
      }
    });

  }

  openSchedule(){
    this.navCtrl.push(ShomePage);
  }

  openLibrary(){
    this.navCtrl.push(LhomePage);
  }


}

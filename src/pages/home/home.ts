import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MloginPage} from "../mlogin/mlogin";
import {MhomePage} from "../mhome/mhome";
import {MoodleApiProvider} from "../../providers/moodle-api/moodle-api";
import {ShomePage} from "../shome/shome";
import {LhomePage} from "../lhome/lhome";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public moodleApi: MoodleApiProvider
    ) {

  }

  openMoodle(){

    this.moodleApi.isLoggedIn().then(value => {

      if(value){
        this.navCtrl.push(MhomePage);
      }else{
        this.navCtrl.push(MloginPage);
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

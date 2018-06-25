import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MsearchPage} from "../msearch/msearch";
import {MdisplayCoursesPage} from "../mdisplay-courses/mdisplay-courses";
import { PopoverController } from 'ionic-angular';
import {MhomePopMenuComponent} from "../../components/mhome-pop-menu/mhome-pop-menu";

@IonicPage()
@Component({
  selector: 'page-mhome',
  templateUrl: 'mhome.html',
})
export class MhomePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController
  ) {

  }

  searchCourse(){
    this.navCtrl.push(MsearchPage);
  }

  refreshCourse(){

  }

  displayCourses(event){
    //this.navCtrl.push(MdisplayCoursesPage);
    //dispaly courses here..
    console.log("card clicked");
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(MhomePopMenuComponent);
    popover.present({
      ev: myEvent
    });
  }

}

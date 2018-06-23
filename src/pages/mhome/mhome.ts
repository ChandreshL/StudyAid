import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MsearchPage} from "../msearch/msearch";
import {McourseListPage} from "../mcourse-list/mcourse-list";


@IonicPage()
@Component({
  selector: 'page-mhome',
  templateUrl: 'mhome.html',
})
export class MhomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  searchCourse(){
    this.navCtrl.push(MsearchPage);
  }

  listCourse(){
    this.navCtrl.push(McourseListPage);
  }

}

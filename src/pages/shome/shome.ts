import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SlistPage} from "../slist/slist";
import {ScalenderPage} from "../scalender/scalender";


@IonicPage()
@Component({
  selector: 'page-shome',
  templateUrl: 'shome.html',
})
export class ShomePage {

  listpage = SlistPage;
  calenderpage = ScalenderPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShomePage');
  }

}

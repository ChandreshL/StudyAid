import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MsearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-msearch',
  templateUrl: 'msearch.html',
})
export class MsearchPage {

  searchResult: Array<string> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.searchResult = [ 'one', 'two', 'three'];

  }


}

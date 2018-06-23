import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";


@IonicPage()
@Component({
  selector: 'page-mlogin',
  templateUrl: 'mlogin.html',
})
export class MloginPage {

  loader: any;

  constructor(public auth: AuthProvider, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
  }

  tryLogin(){
    this.presentLoading();

    this.auth.loginToMoodle();

    this.loader.dismiss();

  }

  presentLoading(){
    this.loader = this.loadingCtrl.create({
      content: "Authenticating..."
    });
    this.loader.present();
  }

}

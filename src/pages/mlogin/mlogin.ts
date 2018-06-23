import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {MhomePage} from "../mhome/mhome";
import { AlertController } from "ionic-angular";


@IonicPage()
@Component({
  selector: 'page-mlogin',
  templateUrl: 'mlogin.html',
})
export class MloginPage {

  loader: any;

  constructor(
    public auth: AuthProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController) {
  }

  tryLogin(FormLogin){

    this.presentLoading();

    this.auth.loginToMoodle(FormLogin.value).then(data => {

      if(data){

        this.loader.dismiss();
        this.navCtrl.pop();
        this.navCtrl.push(MhomePage);

      }else{
        FormLogin.password = "";

        this.loader.dismiss();

        this.alertCtrl.create({
          title: "Login Failed",
          subTitle: "Login Failed",
          buttons: ["OK"]
        }).present();

      }

    });

    //this.loader.dismiss();

  }

  presentLoading(){
    this.loader = this.loadingCtrl.create({
      content: "Authenticating..."
    });
    this.loader.present();
  }

}

import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MhomePage} from "../mhome/mhome";
import { AlertController } from "ionic-angular";
import { MoodledataProvider } from './../../providers/moodledata/moodledata';


@IonicPage()
@Component({
  selector: 'page-mlogin',
  templateUrl: 'mlogin.html',
})
export class MloginPage {

  loader: any;

  constructor(
    private mdata: MoodledataProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController) {
  }

  tryLogin(FormLogin){

    let formdata: any = FormLogin.value

    //Form validation
    if(formdata.username && formdata.password){
      
      //this.auth.loginToMoodle(FormLogin.value).then(data => {
        this.presentLoading();
        this.mdata.login(formdata.username, formdata.password).then(data => {

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
  
        }).catch(reason =>{
          this.loader.dismiss();
        });

    } else {

      this.alertCtrl.create({
        title: "Required",
        subTitle: "Enter username and password.",
        buttons: ["OK"]
      }).present();

    }
    //this.loader.dismiss();

  }

  presentLoading(){
    this.loader = this.loadingCtrl.create({
      content: "Authenticating..."
    });
    this.loader.present();
  }

}

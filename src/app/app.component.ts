import {Component, ViewChild} from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {MhomePage} from "../pages/mhome/mhome";
import {ShomePage} from "../pages/shome/shome";
import {LhomePage} from "../pages/lhome/lhome";
import {MloginPage} from "../pages/mlogin/mlogin";
import {AuthProvider} from "../providers/auth/auth";



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = HomePage;
  pages: Array<{title: string, component: any}>;
  loader: any;

  constructor(public auth: AuthProvider, public loadingCtrl: LoadingController, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.pages = [
        {title:'Schedule', component: ShomePage},
        {title:'Library', component: LhomePage}
      ];

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openMoodle(){

    this.presentLoading();

    this.auth.checkMoodleLogin().then((isLoggedIn) => {
      if (isLoggedIn){
        this.nav.push(MhomePage);
      }else{
        this.nav.push(MloginPage);
      }

      this.loader.dismiss();
    });

  }

  openPage(page){
      this.nav.push(page.component);
  }

  presentLoading(){
    this.loader = this.loadingCtrl.create({
      content: "Authenticating..."
    });
    this.loader.present();
  }


}


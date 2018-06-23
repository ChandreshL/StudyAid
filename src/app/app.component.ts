import {Component, ViewChild} from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {MhomePage} from "../pages/mhome/mhome";
import {ShomePage} from "../pages/shome/shome";
import {LhomePage} from "../pages/lhome/lhome";



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = HomePage;
  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.pages = [
        {title:'Moodle', component: MhomePage},
        {title:'Schedule', component: ShomePage},
        {title:'Library', component: LhomePage}
      ];

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page){
      this.nav.push(page.component);
  }

}


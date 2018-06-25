import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule} from "@ionic/storage";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {MhomePage} from "../pages/mhome/mhome";
import {MloginPage} from "../pages/mlogin/mlogin";
import {MsearchPage} from "../pages/msearch/msearch";
import {MenrollPage} from "../pages/menroll/menroll";
import {MdisplayCoursesPage} from "../pages/mdisplay-courses/mdisplay-courses";
import {McourseListPage} from "../pages/mcourse-list/mcourse-list";
import {McourseContentPage} from "../pages/mcourse-content/mcourse-content";
import {ShomePage} from "../pages/shome/shome";
import {LhomePage} from "../pages/lhome/lhome";
import {SlistPage} from "../pages/slist/slist";
import {ScalenderPage} from "../pages/scalender/scalender";
import {DatabaseProvider} from "../providers/database/database";
import {MoodleApiProvider} from "../providers/moodle-api/moodle-api";
import {MpeekCoursePage} from "../pages/mpeek-course/mpeek-course";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MhomePage,
    MloginPage,
    MsearchPage,
    MenrollPage,
    MdisplayCoursesPage,
    McourseListPage,
    McourseContentPage,
    ShomePage,
    SlistPage,
    ScalenderPage,
    LhomePage,
    MpeekCoursePage

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MhomePage,
    MloginPage,
    MsearchPage,
    MenrollPage,
    MdisplayCoursesPage,
    McourseListPage,
    McourseContentPage,
    ShomePage,
    SlistPage,
    ScalenderPage,
    LhomePage,
    MpeekCoursePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    MoodleApiProvider
  ]
})
export class AppModule {}

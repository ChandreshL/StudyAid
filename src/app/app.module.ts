import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule} from "@ionic/storage";

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import {MhomePopMenuComponent} from "../components/mhome-pop-menu/mhome-pop-menu";

import {MhomePage} from "../pages/mhome/mhome";
import {MloginPage} from "../pages/mlogin/mlogin";
import {MsearchPage} from "../pages/msearch/msearch";
import {MenrollPage} from "../pages/menroll/menroll";
import {McourseContentPage} from "../pages/mcourse-content/mcourse-content";
import {MpeekCoursePage} from "../pages/mpeek-course/mpeek-course";

import { MMessageTabsPage } from './../pages/m-message-tabs/m-message-tabs';
import { ContactsPage } from './../pages/contacts/contacts';
import { MessagePage } from './../pages/message/message';

import {ShomePage} from "../pages/shome/shome";
import {SlistPage} from "../pages/slist/slist";
import {ScalenderPage} from "../pages/scalender/scalender";

import {LhomePage} from "../pages/lhome/lhome";

import {DatabaseProvider} from "../providers/database/database";
import {MoodleApiProvider} from "../providers/moodle-api/moodle-api";
import { MoodledataProvider } from '../providers/moodledata/moodledata';
import { MoodleMessageDataProvider } from '../providers/moodle-message-data/moodle-message-data';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MloginPage,
    MhomePage,
    MsearchPage,
    MpeekCoursePage,
    MenrollPage,
    McourseContentPage,
    MMessageTabsPage,
    MessagePage,
    ContactsPage,
    ShomePage,
    SlistPage,
    ScalenderPage,
    LhomePage,
    MhomePopMenuComponent

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
    MloginPage,
    MhomePage,
    MsearchPage,
    MpeekCoursePage,
    MenrollPage,
    McourseContentPage,
    MMessageTabsPage,
    MessagePage,
    ContactsPage,    
    ShomePage,
    SlistPage,
    ScalenderPage,
    LhomePage,
    MhomePopMenuComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    MoodleApiProvider,
    MoodledataProvider,
    MoodleMessageDataProvider
  ]
})
export class AppModule {}

import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MsearchPage} from "../msearch/msearch";
import { PopoverController } from 'ionic-angular';
import {MhomePopMenuComponent} from "../../components/mhome-pop-menu/mhome-pop-menu";
import {McourseContentPage} from "../mcourse-content/mcourse-content";
import { MMessageTabsPage } from './../m-message-tabs/m-message-tabs';
import { Storage } from '@ionic/storage';

import { ImEnrolledCourse } from "../../providers/database/database";
import { MoodledataProvider } from './../../providers/moodledata/moodledata';

@IonicPage()
@Component({
  selector: 'page-mhome',
  templateUrl: 'mhome.html',
})
export class MhomePage {

  coursesList: Array<ImEnrolledCourse> = [];
  loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private mdata: MoodledataProvider,
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController,
    private storage: Storage
  ) {

  }

  ionViewDidEnter() {

    /**
     * Enrolled is a temporary variable in storage
     * to auto refresh the enrolled courses after enrolling in the course.
     * the variable is set in mpeek-course.ts popToHome()
     */
    this.storage.get('enrolled').then((val)=>{

      if(val == 'yes'){
        this.getCoursesFromAPI();
      }else{
        this.getCoursesFromDb();
      }

      this.storage.remove('enrolled');

    }).catch( (reason) => {
      console.log("Error mhome ionViewDidEnter");
      this.storage.remove('enrolled');
      this.getCoursesFromDb();
    });


    //this.getCoursesFromDb();

  }


  searchButton(){
    this.navCtrl.push(MsearchPage);
  }

  messagesButton(){
    this.navCtrl.push(MMessageTabsPage);
  }

  refreshCourse(){
    this.getCoursesFromAPI();
  }


  openCourse(index){

    let courseid: number = this.coursesList[index].id;
    let courseName: string = this.coursesList[index].shortname;

    //open the card with courseid
    this.navCtrl.push(McourseContentPage, { courseid: courseid, courseName: courseName});

  }


  getCoursesFromAPI(){
    this.loader.dismissAll();
    this.presentLoading();

    this.mdata.getEnrolledCoursesFromAPI(true).then( (data: Array<ImEnrolledCourse>) =>{

      if(data)
        this.coursesList = data;
      else{
        this.coursesList = new Array<ImEnrolledCourse>();
      }
      
      this.loader.dismissAll();
      

    }).catch(reason => {
      
      console.log("error mhome getCoursesFromAPI.");
      this.loader.dismissAll();
    });

  }

  getCoursesFromDb(){
    this.presentLoading();

    this.mdata.getEnrolledCoursesFromDb().then((data: Array<ImEnrolledCourse>) =>{

        if(data && data.length > 0){
          this.coursesList = data;
        }
        this.loader.dismissAll();

    }).catch(reason => {
      this.loader.dismissAll();
      console.log("Error mhome getCourseFromDb");
    });

    this.loader.dismissAll();
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(MhomePopMenuComponent);
    popover.present({
      ev: myEvent
    });
  }

  presentLoading(){
    this.loader = this.loadingCtrl.create({
      content: "Processing..."
    });
    this.loader.present();
  }

}

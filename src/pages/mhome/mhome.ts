import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MsearchPage} from "../msearch/msearch";
import { PopoverController } from 'ionic-angular';
import {MhomePopMenuComponent} from "../../components/mhome-pop-menu/mhome-pop-menu";
import {DatabaseProvider, ImEnrolledCourse } from "../../providers/database/database";
import {MoodleApiProvider} from "../../providers/moodle-api/moodle-api";

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
    public popoverCtrl: PopoverController,
    private appdb: DatabaseProvider,
    private moodleApi: MoodleApiProvider,
    public loadingCtrl: LoadingController
  ) {

  }

  ionViewDidEnter() {

    this.getCoursesFromDb();

  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(MhomePopMenuComponent);
    popover.present({
      ev: myEvent
    });
  }

  searchCourse(){
    this.navCtrl.push(MsearchPage);
  }

  refreshCourse(){
    this.getCoursesFromAPI();
  }

  openCourse(event){
    //this.navCtrl.push(MdisplayCoursesPage);
    //dispaly courses here..
    console.log("card clicked");
  }

  getCoursesFromAPI(){
    this.presentLoading();

    console.log("getting from api");

    this.moodleApi.getEnrolledCourses().then((data: Array<ImEnrolledCourse>) => {

      if(data){
        this.coursesList = data;
        this.saveCoursesToDb(data);
      }

      this.loader.dismissAll();

    }).catch(reason => {

      this.loader.dismissAll();
    });
  }

  getCoursesFromDb(){

    this.presentLoading();

    this.appdb.enrolledCourses.toCollection().toArray().then(data =>{

        if(data && data.length == 0){

          this.loader.dismissAll();
          this.getCoursesFromAPI();

        } else {
          this.coursesList = data;
          this.loader.dismissAll();
        }
    }).catch(reason => {
      this.loader.dismissAll();
      console.log(reason);
    });
  }

  saveCoursesToDb(data: Array<ImEnrolledCourse>){

      this.appdb.transaction('rw', this.appdb.enrolledCourses, async() => {

         this.appdb.enrolledCourses.bulkAdd(data)
           .then(value => {})
           .catch(reason => {});

      }).catch(e => {
        console.log(e.stack || e);
      });
  }

  presentLoading(){
    this.loader = this.loadingCtrl.create({
      content: "Processing..."
    });
    this.loader.present();
  }

}

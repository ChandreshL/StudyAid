import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MsearchPage} from "../msearch/msearch";
import { PopoverController } from 'ionic-angular';
import {MhomePopMenuComponent} from "../../components/mhome-pop-menu/mhome-pop-menu";
import {DatabaseProvider, ImEnrolledCourse } from "../../providers/database/database";
import {MoodleApiProvider} from "../../providers/moodle-api/moodle-api";
import { Storage } from '@ionic/storage';
import {McourseContentPage} from "../mcourse-content/mcourse-content";

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
    private appdb: DatabaseProvider,
    private moodleApi: MoodleApiProvider,
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

      console.log("storage:enrolled with error");
      this.getCoursesFromDb();
      this.storage.remove('enrolled');
    });


    //this.getCoursesFromDb();

  }


  searchButton(){
    this.navCtrl.push(MsearchPage);
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

    console.log("getting from api");

    this.moodleApi.getEnrolledCourses().then((data: Array<ImEnrolledCourse>) => {

      if(data){

        this.coursesList = data;
        this.saveCoursesToDb();
      }

      this.loader.dismissAll();

    }).catch(reason => {

      console.log("error getting from api");
      this.loader.dismissAll();
    });
  }

  getCoursesFromDb(){

    this.presentLoading();

    this.appdb.enrolledCourses.toCollection().toArray().then(data =>{

        if(data && data.length == 0){

          console.log("no data in database.");
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

  saveCoursesToDb(){

      this.appdb.transaction('rw', this.appdb.enrolledCourses, async() => {

        this.appdb.enrolledCourses.clear().then( result => {

          this.appdb.enrolledCourses.bulkAdd(this.coursesList)
            .then(value => {})
            .catch(reason => {});

        });

      }).catch(e => {
        console.log(e.stack || e);
      });
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

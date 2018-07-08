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
    public popoverCtrl: PopoverController,
    private appdb: DatabaseProvider,
    private moodleApi: MoodleApiProvider,
    public loadingCtrl: LoadingController,
    private storage: Storage
  ) {

  }

  ionViewDidEnter() {

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

  openCourse(index){

    let courseid = this.coursesList[index].id;

    //open the card with courseid
    this.navCtrl.push(McourseContentPage, { courseid: courseid});


  }

  getCoursesFromAPI(){
    this.loader.dismissAll();
    this.presentLoading();

    console.log("getting from api");

    this.moodleApi.getEnrolledCourses().then((data: Array<ImEnrolledCourse>) => {

      if(data){

        this.coursesList = data;
        this.saveCoursesToDb(data);
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

  saveCoursesToDb(data: Array<ImEnrolledCourse>){

      this.appdb.transaction('rw', this.appdb.enrolledCourses, async() => {

        this.appdb.enrolledCourses.clear().then( result => {

          this.appdb.enrolledCourses.bulkAdd(data)
            .then(value => {})
            .catch(reason => {});

        });

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

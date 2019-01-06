import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { DatabaseProvider, ImCourseSectionContent } from "../../providers/database/database";
import {MoodleApiProvider} from "../../providers/moodle-api/moodle-api";

/**
 * Generated class for the McourseContentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mcourse-content',
  templateUrl: 'mcourse-content.html',
})
export class McourseContentPage {

  courseid: number;
  courseName: string;
  courseSections: Array<ImCourseSectionContent> = [];
  loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private appdb: DatabaseProvider,
    private moodleApi: MoodleApiProvider
  ) {

    this.courseid = this.navParams.get('courseid');
    this.courseName = this.navParams.get('courseName');

  }

  presentLoading(){
    this.loader = this.loadingCtrl.create({
      content: "Processing..."
    });
    this.loader.present();
  }

  ionViewDidLoad() {

    this.getCourseContentFromDb(this.courseid);

  }

  getCourseContentFromDb(courseId){

    this.presentLoading();

    //query database with courseid..

    this.appdb.courseSectionContent.where("courseId")
      .equals(courseId).toArray()
      .then(data =>{

      if(data && data.length == 0){

        console.log("no data in database.");
        this.getCourseContentFromAPI(courseId);

      } else {

        data.sort((a,b) => {
          if(a.section < b.section) return -1;
          if(a.section > b.section) return 1;
          return 0;
        });

        this.courseSections = data;
        this.loader.dismissAll();

      }
    }).catch(reason => {
      this.loader.dismissAll();
      console.log(reason);
    });

  }

  getCourseContentFromAPI(courseId){
    this.loader.dismissAll();
    this.presentLoading();

    console.log("getting from api");

    this.moodleApi.getCourseContent(this.courseid).then((data: Array<ImCourseSectionContent>) => {

      if(data){

        this.courseSections = data;

        //Add courseid into the data
        //this inside foreach referes to tempThis
        let tempThis = this;
        this.courseSections.forEach((d,tempThis) => {
          d.courseId = this.courseid;
        });

        this.saveCourseContentToDb();
      }

      this.loader.dismissAll();

    }).catch(reason => {

      console.log("error getting from api");
      this.loader.dismissAll();
    });

  }

  saveCourseContentToDb(){

    this.appdb.transaction('rw', this.appdb.courseSectionContent, async() => {

      this.appdb.courseSectionContent.bulkAdd(this.courseSections)
        .then(value => {})
        .catch(reason => {});

    }).catch(e => {
      console.log(e.stack || e);
    });

  }


}

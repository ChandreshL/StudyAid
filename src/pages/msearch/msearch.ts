import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MoodleApiProvider} from "../../providers/moodle-api/moodle-api";
import {ImCourseList, mCourse} from "../../providers/database/database";
import {MpeekCoursePage} from "../mpeek-course/mpeek-course";


@IonicPage()
@Component({
  selector: 'page-msearch',
  templateUrl: 'msearch.html',
})
export class MsearchPage {

  queryText: string;
  searchResult: Array<mCourse> = [];
  loader: any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    private moodleApi: MoodleApiProvider,
    public alertCtrl: AlertController
  ) {

  }

  fetchCourses($event){

    let queryTextLower = this.queryText.toLowerCase();

    let resultArr: Array<mCourse> = [];

    this.presentLoading();

    this.moodleApi.searchCourse(queryTextLower).then((data: ImCourseList) =>{

      if(data.hasOwnProperty('courses')){

        data.courses.forEach(c => {
          resultArr.push(c);
        });

        this.searchResult = resultArr;
      }
      this.loader.dismiss();

    },reason=>{

      this.alertCtrl.create({
        title: "Error",
        subTitle: "Error in search",
        buttons: ["OK"]
      }).present();

      console.log(reason);
      this.loader.dismiss();
    });

  }

  presentLoading(){
    this.loader = this.loadingCtrl.create({
      content: "Searching..."
    });
    this.loader.present();
  }


  peekCourse(index){

    if(index >= 0)
    this.navCtrl.push(MpeekCoursePage, { param1: this.searchResult[index]});
  }


}

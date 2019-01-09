import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {MpeekCoursePage} from "../mpeek-course/mpeek-course";

import {ImCourseList, ImCourse} from "../../providers/database/database";
import { MoodledataProvider } from './../../providers/moodledata/moodledata';


@IonicPage()
@Component({
  selector: 'page-msearch',
  templateUrl: 'msearch.html',
})
export class MsearchPage {

  queryText: string;
  searchResult: Array<ImCourse> = [];
  loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private mdata: MoodledataProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {

  }

  fetchCourses($event){

    let queryTextLower = this.queryText.toLowerCase();
    
    if(queryTextLower.length == 0) return;

    this.presentLoading();

    this.mdata.searchCourses(queryTextLower).then((data: ImCourseList) =>{

      if(data && data.hasOwnProperty('courses')){

        /* data.courses.forEach(c => {
          this.searchResult.push(c);
        }); */

        this.searchResult = data.courses;

      }
      this.loader.dismiss();

    },reason=>{

      this.alertCtrl.create({
        title: "Error",
        subTitle: "Error in search",
        buttons: ["OK"]
      }).present();

      console.log("Error msearch fetchCourses");
      this.loader.dismiss();
    });

  }

  peekCourse(index){

    if(index >= 0)
    this.navCtrl.push(MpeekCoursePage, { course: this.searchResult[index]});
  }

  
  presentLoading(){
    this.loader = this.loadingCtrl.create({
      content: "Searching..."
    });
    this.loader.present();
  }

}

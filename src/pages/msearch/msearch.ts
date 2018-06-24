import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MoodleApiProvider} from "../../providers/moodle-api/moodle-api";
import {ImCourseList, mCourse} from "../../providers/database/database";

/**
 * Generated class for the MsearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-msearch',
  templateUrl: 'msearch.html',
})
export class MsearchPage {

  queryText: string;
  searchResult: Array<mCourse> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private moodleApi: MoodleApiProvider
  ) {

  }

  fetchCourses($event){

    let queryTextLower = this.queryText.toLowerCase();

    let resultArr: Array<mCourse> = [];

    this.moodleApi.searchCourse(queryTextLower).then((data: ImCourseList) =>{

      if(data.hasOwnProperty('courses')){

        data.courses.forEach(c => {
          resultArr.push(c);
        });

        this.searchResult = resultArr;
      }

    },reason=>{
      console.log(reason);
    });

  }


}

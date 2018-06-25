import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {IContacts, mCourse } from "../../providers/database/database";
import {MoodleApiProvider} from "../../providers/moodle-api/moodle-api";


@IonicPage()
@Component({
  selector: 'page-mpeek-course',
  templateUrl: 'mpeek-course.html',
})
export class MpeekCoursePage {

  course: mCourse;

  constructor(
    private moodleApi: MoodleApiProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

    this.course = this.navParams.get('param1');

  }

  getTeachersName(contacts: Array<IContacts>){
    let contactsStr = "";
    console.log(contacts);
    contacts.forEach(c => {
      if(c.fullname) contactsStr+= ", " + c.fullname;
      console.log(c);
    });

    return contactsStr.substr(2);

  }

  enrollButton(){
    console.log("enrolled clicked");

  }



}

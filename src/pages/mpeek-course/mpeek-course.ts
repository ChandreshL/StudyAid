import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {IContacts, ImCourseEnrolmentMethods, ImEnrolledCourse, mCourse} from "../../providers/database/database";
import {MoodleApiProvider} from "../../providers/moodle-api/moodle-api";
import {MhomePage} from "../mhome/mhome";
import {McourseContentPage} from "../mcourse-content/mcourse-content";
import {McourseListPage} from "../mcourse-list/mcourse-list";


interface ImSelfEnrolUser {

  status: boolean,    //status: true if the user is enrolled, false otherwise
  warnings: Array<ImEnrolWarning>    //Optional list of warnings

}

interface ImEnrolWarning {

  item: string,  //Optional item
  itemid: number,  //Optional item id
  warningcode: string,   //the warning code can be used by the client app to implement specific behaviour
  message: string   //untranslated english message to explain the warning

}


@IonicPage()
@Component({
  selector: 'page-mpeek-course',
  templateUrl: 'mpeek-course.html',
})
export class MpeekCoursePage {

  course: mCourse;
  btnShow: boolean;
  enrolKey: string;
  instanceid: number;
  requirePassword: boolean;
  loader: any;

  constructor(
    private moodleApi: MoodleApiProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
  ) {

    this.course = this.navParams.get('param1');

    //this.moodleApi.getEnrolledCourses()
    this.btnShow = true;
    this.requirePassword = false;

  }

  ionViewDidEnter(){

    //todo show progress

    this.moodleApi.getEnrolledCourses().then((data: Array<ImEnrolledCourse>) => {
      data.forEach(d => {
        if (d.id = this.course.id){
          //todo hide enroll button
          this.btnShow = false;
        }
      });
    });

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

    if(this.requirePassword){
      this.enrollWithPassword();
      return;
    }

    if(!this.instanceid) {

      //get instance id
      this.presentLoading();

      this.moodleApi.getCourseEnrolmentMethods(this.course.id).then((data: Array<ImCourseEnrolmentMethods>) => {

        data.forEach(d => {
          if (d.type == 'self') {
            this.instanceid = d.id;
          }
        });

        //enroll without enrolkey
        if (this.instanceid && !this.requirePassword) {
          this.presentLoading();
          this.sendEnrollRequest(this.course.id, this.enrolKey, this.instanceid).then((data: ImSelfEnrolUser) => {

            if(data.status){
              console.log("enrolled without password");

              this.navCtrl.popTo(MhomePage);
              this.navCtrl.push(McourseListPage, { param1: this.course.id});

            }else {

              //if warningcode 4 = invalid key then mark requiredpassword.
              data.warnings.forEach(w => {
                if(w.warningcode == "4") {
                  this.requirePassword = true;
                  this.enrollWithPassword();
                }
              });
            }

            this.loader.dismiss();
          });
        }

        this.loader.dismiss();

      });
    }

  }

  enrollWithPassword(){

    //we are in mark requiredpassword.
    if(this.requirePassword && this.instanceid) {

      this.showPrompt();

      if(this.enrolKey.length > 0){
        this.presentLoading();
        this.sendEnrollRequest(this.course.id, this.enrolKey, this.instanceid).then((data: ImSelfEnrolUser) => {

          if(data.status){

            console.log("enrolled with password!!!");

            this.navCtrl.popTo(MhomePage);
            this.navCtrl.push(McourseListPage, { param1: this.course.id});

          }else{
            //if error
            this.showAlert();
          }

          this.loader.dismiss();

        });
      }
    }
  }

  sendEnrollRequest(courseid, password, instanceid){
    return this.moodleApi.enrollInCourse(courseid, password, instanceid).then(data => {
      return data;
    });
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Enroll',
      message: "Enter enrollment key",
      inputs: [
        {
          name: 'key',
          placeholder: 'Key'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enrol',
          handler: data => {
            this.enrolKey = data.toString().trim();
            console.log('Enrol clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Invalid key',
      buttons: ['OK']
    });
    alert.present();
  }

  presentLoading(){
    this.loader = this.loadingCtrl.create({
      content: "Searching..."
    });
    this.loader.present();
  }


}

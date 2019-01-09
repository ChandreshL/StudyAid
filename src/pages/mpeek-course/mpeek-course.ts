import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import { Storage } from "@ionic/storage";

import {IContacts, ImCourseEnrolmentMethods, ImEnrolledCourse, ImCourse} from "../../providers/database/database";
import { MoodledataProvider } from './../../providers/moodledata/moodledata';


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

  course: ImCourse;
  alradyEnrolled: boolean;
  enrolKey: string;
  instanceid: number;
  requirePassword: boolean;
  loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private mdata: MoodledataProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private storage: Storage
  ) {

    this.course = this.navParams.get('course');

    //this.moodleApi.getEnrolledCourses()
    this.alradyEnrolled = false;
    this.requirePassword = false;

  }

  ionViewDidEnter(){

    this.presentLoading();


    //check if the course is already enrolled.

    this.mdata.getEnrolledCoursesFromAPI().then((data: Array<ImEnrolledCourse>) => {

      if(data && this.isArray(data)) {

        //some will break the loop when it returns true otherwise false
        this.alradyEnrolled = data.some(c => c.id == this.course.id);

        /* data.forEach(d => {
          if (d.id == this.course.id) {
            this.alradyEnrolled = true;
          }
        }); */

      }
      this.loader.dismiss();

    }, reason => {
      console.log("error mpeek-course ionViewDidEnter");

      this.loader.dismiss();
    });

  }

  getTeachersName(contacts: Array<IContacts>){
    let contactsStr = "";
    contacts.forEach(c => {
      if(c.fullname) contactsStr += ", " + c.fullname;
    });
    return contactsStr.substr(2);
  }


  enrollButton(){

    /**
     * if user has clicked cancel in the password prompt first time.
     * then second time show prompt direct.
     */
    if(this.requirePassword){
      this.showPrompt();
      //this.enrollWithPassword();
      return;
    }

    this.presentLoading();
    
    //get instance id
    this.getInstanceId().then(data=>{
        //enroll without enrolkey
        if (this.instanceid && !this.requirePassword) {

          this.mdata.enrollInCourse(this.course.id, this.enrolKey, this.instanceid).then((data: ImSelfEnrolUser) => {

            //data.status is boolean
            if(data.status){
              this.popToHome();
            }else {
              //if status is false then check warnings codes.
              //if warningcode 4 = invalid key then mark requiredpassword.
              data.warnings.forEach(w => {
                if(w.warningcode == "4") {
                  this.requirePassword = true;
                  this.showPrompt();
                }
              });
            }

            this.loader.dismissAll();
          }).catch(reason => {
            this.loader.dismissAll();
          });

        }
    });

    if(this.loader) this.loader.dismissAll();

  }

  enrollWithPassword(){

    if(this.requirePassword && this.instanceid) {

      if(this.enrolKey && this.enrolKey.length > 0){
        this.presentLoading();
        this.mdata.enrollInCourse(this.course.id, this.enrolKey, this.instanceid).then((data: ImSelfEnrolUser) => {
          
          if(data.status){

            this.loader.dismissAll();
            this.popToHome();

          }else{
            //if error
            this.loader.dismissAll();
            this.showAlert();
          }


        }).catch(reason => {

          this.loader.dismissAll();
        });
      }
    }
  }

  /**
   * Instance Id parameter required to enroll in a course.
   * 
   */
  getInstanceId(){

    return new Promise(resolve => {
      this.mdata.getCourseEnrolmentMethods(this.course.id).then((data: Array<ImCourseEnrolmentMethods>) => {

        data.forEach(d => {
          if (d.type == 'self') {
            this.instanceid = d.id;
          }
        });

        if(this.instanceid) {
          resolve(true);
        }
        else{
          resolve(false);
        }
      }).catch(reason => {
        resolve(false);
      });
    });

  }

/*   sendEnrollRequest(courseid, password, instanceid){
    return this.moodleApi.enrollInCourse(courseid, password, instanceid).then(data => {
      return data;
    });
  } */


  popToHome(){

    /**
     * enrolled is a temporary variable in storage
     * to auto refresh the enrolled courses after enrolling in the course.
     * It is removed in mhome.ts
     */
      this.storage.set('enrolled','yes');
  
      //Pop to two pages to Mhomepage
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-3));
  
      //this.navCtrl.push(McourseListPage, { param1: this.course.id});
  
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
            this.loader.dismissAll();
          }
        },
        {
          text: 'Enrol',
          handler: data => {
            this.enrolKey = data.hasOwnProperty('key') ? data.key : "";
            this.enrollWithPassword();
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
      content: "Processing..."
    });
    this.loader.present();
  }

  isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
  }

}

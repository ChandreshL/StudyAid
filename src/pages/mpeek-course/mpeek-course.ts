import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {IContacts, ImCourseEnrolmentMethods, ImEnrolledCourse, ImCourse} from "../../providers/database/database";
import {MoodleApiProvider} from "../../providers/moodle-api/moodle-api";
import { Storage } from "@ionic/storage";


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
  btnShow: boolean;
  enrolKey: string;
  instanceid: number;
  requirePassword: boolean;
  loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private moodleApi: MoodleApiProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private storage: Storage
  ) {

    this.course = this.navParams.get('param1');

    //this.moodleApi.getEnrolledCourses()
    this.btnShow = true;
    this.requirePassword = false;

  }

  ionViewDidEnter(){

    this.presentLoading();

    this.moodleApi.getEnrolledCourses().then((data: Array<ImEnrolledCourse>) => {

      if(data && this.isArray(data)) {
        data.forEach(d => {
          if (d.id == this.course.id) {
            this.btnShow = false;
          }
        });
      }
      this.loader.dismiss();
    }, reason => {
      console.log("promise error");
      this.loader.dismiss();
    });

  }

  getTeachersName(contacts: Array<IContacts>){
    let contactsStr = "";
    contacts.forEach(c => {
      if(c.fullname) contactsStr+= ", " + c.fullname;
    });
    return contactsStr.substr(2);
  }

  enrollButton(){
    console.log("enrolled clicked");

    if(this.requirePassword){
      this.showPrompt();
      //this.enrollWithPassword();
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
          this.sendEnrollRequest(this.course.id, this.enrolKey, this.instanceid).then((data: ImSelfEnrolUser) => {

            if(data.status){
              console.log("enrolled without password");

              this.loader.dismissAll();
              this.popToHome();

            }else {

              //if warningcode 4 = invalid key then mark requiredpassword.
              data.warnings.forEach(w => {
                if(w.warningcode == "4") {
                  this.requirePassword = true;
                  this.loader.dismissAll();
                  this.showPrompt();
                  //this.enrollWithPassword();
                }
              });
            }


          }).catch(reason => {
            this.loader.dismissAll();
          });
        }

      }).catch(reason => {
        this.loader.dismissAll();
      });
    }

  }

  enrollWithPassword(){

    //we are in mark requiredpassword.
    if(this.requirePassword && this.instanceid) {

      //this.showPrompt();

      if(this.enrolKey && this.enrolKey.length > 0){
        this.presentLoading();
        this.sendEnrollRequest(this.course.id, this.enrolKey, this.instanceid).then((data: ImSelfEnrolUser) => {

          if(data.status){

            console.log("enrolled with password!!!");
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

  isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
  }

}

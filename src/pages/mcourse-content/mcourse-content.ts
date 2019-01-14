import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ImCourseSectionContent, ImSectionModule, ImModuleContent } from "../../providers/database/database";
import { MoodledataProvider } from './../../providers/moodledata/moodledata';


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

  private courseId: number;
  private courseName: string;
  private courseSections: Array<ImCourseSectionContent>;
  private downloadingFile: boolean;
  loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private mdata: MoodledataProvider,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {

    this.courseId = this.navParams.get('courseid');
    this.courseName = this.navParams.get('courseName');
    this.downloadingFile = false;
  }

  ionViewDidLoad() {

    this.getCourseContentFromDb();

  }

  getCourseContentFromDb(){

    this.presentLoading();

    this.mdata.getCourseContentFromDb(this.courseId).then(
      (data: Array<ImCourseSectionContent>) =>{

      if(data){

        data.sort((a,b) => {
          if(a.section < b.section) return -1;
          if(a.section > b.section) return 1;
          return 0;
        });

        this.courseSections = data;

      } else {
        this.getCourseContentFromAPI();
      }
      if(this.loader) this.loader.dismissAll();
    }).catch(reason => {
      console.log("Error mcourse-content getCourseContentFromDb");
    });

    if(this.loader) this.loader.dismissAll();
  }

  getCourseContentFromAPI(){
    if(this.loader) this.loader.dismissAll();
    this.presentLoading();
    this.mdata.getCourseContentFromAPI(this.courseId).then((data: Array<ImCourseSectionContent>) => {

      if(data){
        this.courseSections = data;
      }
    }).catch(reason => {
      console.log("error getting from api");
    });

    if(this.loader) this.loader.dismissAll();
  }

  downloadFile(filename, fileurl){
    this.downloadingFile = true;
    this.mdata.downloadFile(filename,fileurl).then(result => {
      this.presentToast("File downloaded.");
      this.downloadingFile = false;
    }).catch(reason => {
      this.presentToast("Download error.");
      this.downloadingFile = false;
    });

  }

  presentLoading(){
    this.loader = this.loadingCtrl.create({
      content: "Processing..."
    });
    this.loader.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
    });
  
    toast.present();
  }

}

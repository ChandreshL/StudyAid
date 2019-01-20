import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MloginPage} from "../mlogin/mlogin";
import {MhomePage} from "../mhome/mhome";
import { MMessageTabsPage } from './../m-message-tabs/m-message-tabs';
import {ShomePage} from "../shome/shome";
import {LhomePage} from "../lhome/lhome";

import { MoodledataProvider } from './../../providers/moodledata/moodledata';


interface iNotifaction{
  id: number;
  type: string;
  description: string;
  courseName: string;
  icon: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  notificationRefresh: any;
  notificationList: Array<iNotifaction>;
  unreadConversation: number;
  eventLastEventId: number;

  constructor(
    public navCtrl: NavController,
    private mdata: MoodledataProvider
    ) {

      // this.notificationRefresh = setInterval(() => {
      //   this.getStatus();    
      // }, 10000);

      this.notificationList = new Array<iNotifaction>();
      this.unreadConversation = 0;
      this.eventLastEventId = 0;

  }
  ionViewDidLoad() {
    console.log("view load");
    this.getStatus(null);  

    this.notificationList.push({
      id: 0,
      type: "Schedule",
      description: "Lecture today at 8:00",     
      courseName: "Applied Research Project",
      icon: "clock"
    });
    this.notificationList.push({
      id: 0,
      type: "Schedule",
      description: "Lecture today at 16:00",     
      courseName: "Data Mining",
      icon: "clock"
    });

  }

  ionViewWillLeave(){
    // clearInterval(this.notificationRefresh);
  }

  getStatus(refresher){
    this.mdata.isLoggedIn().then(value => {
      if(value){
        this.checkNewConverstation();
        this.checkCalenderEvents();
      }
      if(refresher) refresher.complete();
    });
  }

  checkNewConverstation(){
    this.mdata.checkUnreadConversation().then(count =>{
      try{
        //show message if there is a count > 0.
        if((count as number) > 0){

          this.unreadConversation = count as number;

          this.notificationList.push({
            id: 0,
            type: "Unread",
            description: "You have unread messages from " + count as string + " users",
            courseName: "",
            icon: "mail"
          });

        }else{
          //if count is 0 then find unread entry in the list and remove
          this.unreadConversation = 0;
          let index = this.notificationList.findIndex(n => n.type === "Unread");
          this.notificationList.splice(index,1);
        }
      }catch{}
    });

    
  }

  checkCalenderEvents(){
    this.mdata.getCalenderActionEvents(this.eventLastEventId).then(data => {
      if(data){
        (data as any[]).forEach(ent => {

          let icn = "alert"
          //assignment "modulename": "assign"
          if(ent['modulename'] === "assign") icn = "book"

          if(!this.notificationList.find(n=>n.id == ent['id'])){
            this.notificationList.push({
              id: ent['id'],
              type: ent['modulename'],
              description: ent['name'],
              courseName: ent['course']['shortname'],
              icon: icn
            });
          }

          this.eventLastEventId = ent['id'];
        });
      }

    }).catch(reason => {

    });
  }


  openMoodle(page){

    this.mdata.isLoggedIn().then(value => {
      if(value){
        if(page === "home"){
          this.navCtrl.push(MhomePage);
        }else{
          this.navCtrl.push(MMessageTabsPage);
        }
      }else{
        this.navCtrl.push(MloginPage, { returnTo: page});
      }
    });

  }

  openSchedule(){
    this.navCtrl.push(ShomePage);
  }

  openLibrary(){
    this.navCtrl.push(LhomePage);
  }


}

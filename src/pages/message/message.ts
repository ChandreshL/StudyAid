import { MessageUserPage } from './../message-user/message-user';
import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { MoodleMessageDataProvider } from './../../providers/moodle-message-data/moodle-message-data';
import { IMsgContact } from './../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

  conversationList: Array<IMsgContact> = [];

  constructor(
    private app: App,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private msgData: MoodleMessageDataProvider) {
  }

  ionViewDidLoad() {

    console.log("get inital data");
    
    this.msgData.getConversations().then(data => {
      if(data) this.conversationList = data as Array<IMsgContact>;
    });

  }

  openConversation(index: number){
    let otherUserId = this.conversationList[index].userid;
    let rootNav = this.app.getRootNav();
    if(rootNav){
      rootNav.push(MessageUserPage,{otherUserId: otherUserId});
    }
    //this.navCtrl.push(MessageUserPage,{otherUserId: otherUserId});
       
  }


  doRefresh(refresher) {

    this.msgData.getConversationsFromAPI().then(data => {
      if(data){
        this.conversationList = data as Array<IMsgContact>;
      }
      if(refresher) refresher.complete();
    }).catch(reason =>{
    });
    
  }

}

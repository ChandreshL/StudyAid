import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { MessageUserPage } from './../message-user/message-user';
import { MoodleMessageDataProvider } from './../../providers/moodle-message-data/moodle-message-data';
import { IMsgContact } from './../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

  conversationRefresh: any;
  conversationList: Array<IMsgContact> = [];

  constructor(
    private app: App,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private msgData: MoodleMessageDataProvider) {
  }

  ionViewDidLoad() {
    
    this.msgData.getConversations().then(data => {
      if(data) this.conversationList = data as Array<IMsgContact>;
    });

    this.conversationRefresh = setInterval(()=>{
      this.doRefresh(null);
    },5000);

  }

  ionViewWillLeave(){
    clearInterval(this.conversationRefresh);
  }

  openConversation(index: number){
    let otherUserId = this.conversationList[index].userid;
    let otherUserName = this.conversationList[index].fullname;
    let rootNav = this.app.getRootNavs()[0];
    if(rootNav){
      rootNav.push(MessageUserPage,{otherUserId: otherUserId, otherUserName: otherUserName});
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

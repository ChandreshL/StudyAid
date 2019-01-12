import { IMsgContact, IMsgUserMessage } from './../../providers/database/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MoodleMessageDataProvider } from '../../providers/moodle-message-data/moodle-message-data';

/**
 * Generated class for the MessageUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message-user',
  templateUrl: 'message-user.html',
})
export class MessageUserPage {
  otherUserId: number;
  otherUser: IMsgContact;
  messageList: Array<IMsgUserMessage> = [];
  limitfrom: number = 0;
  editorMsg: string;

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private msgdata: MoodleMessageDataProvider) {

  }

  ionViewDidLoad() {

    this.otherUserId = this.navParams.get('otherUserId');
    
    //get User.
    this.msgdata.getConversationUser(this.otherUserId).then(data => {
      if(data){
        this.otherUser = data;

        //get messages from database.
        this.getMessagesFromDatabase();

        //get new messages from webservice.
        this.getMessagesFromWebservice();

        console.log(this.messageList);
      }
    });

    //scroll to bottom

  }


  getMessagesFromDatabase(){
    this.msgdata.getMessagesFromUserdb(this.otherUser.userid).then(data =>{
      if(data){
          this.messageList = data;
          this.messageList.sort((a,b) => {
            if(a.timecreated < b.timecreated) return -1;
            if(a.timecreated > b.timecreated) return 1;
            return 0;
          });
          this.limitfrom = this.messageList.length;
      }
    });
  }

  getMessagesFromWebservice(){
    this.msgdata.getMessagesFromUser(this.otherUser.userid, this.limitfrom).then(data => {
        if(data){
          this.messageList.concat(data as Array<IMsgUserMessage>);
          this.messageList.sort((a,b) => {
            if(a.timecreated < b.timecreated) return -1;
            if(a.timecreated > b.timecreated) return 1;
            return 0;
          });
          this.limitfrom = this.messageList.length;
        }
    });
  }

  sendMessage(){

  }

}

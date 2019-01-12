import { MyApp } from './../../app/app.component';
import { IMsgContact, IMsgUserMessage } from './../../providers/database/database';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, List, Content } from 'ionic-angular';
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

  @ViewChild(Content) contentArea: Content;
  //@ViewChild(List, {read: ElementRef}) msgList: ElementRef;
  @ViewChild('msgListdiv', {read: ElementRef}) msgList: ElementRef;
  
  otherUserId: number;
  otherUser: IMsgContact;
  messageList: Array<IMsgUserMessage> = [];
  limitfrom: number = 0;
  editorMsg: string;
  sendingMsg: boolean;
  private mutationObserver: MutationObserver;


  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private msgdata: MoodleMessageDataProvider) {
      
      this.editorMsg = "";
      this.sendingMsg = false;

  }

  ionViewDidLoad() {

    this.mutationObserver = new MutationObserver((mutations) => {
        this.contentArea.scrollToBottom();
    });

    this.mutationObserver.observe(this.msgList.nativeElement, {
        childList: true
    });

    this.otherUserId = this.navParams.get('otherUserId');
    
    //get User.
    this.msgdata.getConversationUser(this.otherUserId).then(data => {
      if(data){
        this.otherUser = data;
        //get messages from database.
        this.getMessagesFromDatabase();
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
        
        //new messages from webservice.
        this.getMessagesFromWebservice();
      }
    });
  }

  getMessagesFromWebservice(){
    this.msgdata.getMessagesFromUser(this.otherUser.userid, this.limitfrom).then(data => {
      
      if(data){
          this.messageList.push.apply(this.messageList, data as Array<IMsgUserMessage>);

          this.messageList.sort((a,b) => {
            if(a.timecreated < b.timecreated) return -1;
            if(a.timecreated > b.timecreated) return 1;
            return 0;
          });

          this.limitfrom = this.messageList.length;

          //Mark new messages as read
          this.msgdata.markAmarkAllMessagesRead(this.otherUser.userid);
        }
    });

  }

  sendMessage(){
    
    if(this.editorMsg.trim().length > 0){
      this.sendingMsg = true;
    this.msgdata.sendMessageToUser(this.otherUser.userid, this.editorMsg).then(data=>{
      
      if(data){
        this.getMessagesFromWebservice();
        this.editorMsg = "";
      }
      this.sendingMsg = false;
    }).catch(error => {
      this.sendingMsg = false;
    });

     }

   }

}

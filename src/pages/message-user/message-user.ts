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
  otherUserName: string;
  messageList: Array<IMsgUserMessage> = [];
  limitfrom: number = 0;
  editorMsg: string;
  sendingMsg: boolean;
  msgRefresh: any;
  private mutationObserver: MutationObserver;


  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private msgdata: MoodleMessageDataProvider) {
      
      this.otherUserName = "";
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
    this.otherUserName = this.navParams.get('otherUserName');
    
    //console.log(this.otherUserName);

    if(this.otherUserId){
      //this.getMessagesFromDatabase();
      this.getMessagesFromWebservice();
    }else{
      //Show error message.
      console.error("Can not send message to unknown User.");
    }

    //refresh messages every 1 second.
    this.msgRefresh = setInterval(()=>{
            this.getMessagesFromWebservice();
          },5000);

    //scroll to bottom

  }

  ionViewWillLeave(){
    clearInterval(this.msgRefresh);
  }


  getMessagesFromDatabase(){
    this.msgdata.getMessagesFromUserdb(this.otherUserId).then(data =>{
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

  //console.log("Before " + this.limitfrom);

    this.msgdata.getMessagesFromUser(this.otherUserId, this.limitfrom).then(data => {
      
      if(data){
        //console.log(data);

          this.messageList.push.apply(this.messageList, data as Array<IMsgUserMessage>);

          this.messageList.sort((a,b) => {
            if(a.timecreated < b.timecreated) return -1;
            if(a.timecreated > b.timecreated) return 1;
            return 0;
          });

          this.limitfrom = this.messageList.length;

          //Mark new messages as read
          this.msgdata.markAmarkAllMessagesRead(this.otherUserId);
        }
    });

    //console.log("After " + this.limitfrom);

  }

  sendMessage(){
    
    if(this.editorMsg.trim().length > 0){
      this.sendingMsg = true;
      
      //console.log(this.otherUser);


    this.msgdata.sendMessageToUser(this.otherUserId, this.editorMsg).then(data=>{
      
      //console.log(data);
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

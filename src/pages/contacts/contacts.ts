import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { MessageUserPage } from './../message-user/message-user';
import { MoodleMessageDataProvider } from './../../providers/moodle-message-data/moodle-message-data';
import { IContact, IMsgContact } from './../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  queryText: string;
  searchResult: Array<IContact> = [];
  contactList: Array<IMsgContact> = [];
  showContactList: boolean;
  loader: any;

  constructor(
    private app: App,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private msgData: MoodleMessageDataProvider,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.showContactList = true;
    
    //getContacts from database
    this.msgData.getContactsList().then(data => {
      if(data) this.contactList = data as Array<IMsgContact>;
    });

  }

  openConversation(otherUserId){

    let rootNav = this.app.getRootNavs()[0];

    if(rootNav){
      rootNav.push(MessageUserPage,{otherUserId: otherUserId});
    }
    //this.navCtrl.push(MessageUserPage,{otherUserId: otherUserId});
       
  }

  searchContacts(){
    let queryTextLower = this.queryText.trim().toLowerCase();
    if(queryTextLower.length > 2){
      this.showContactList = false;
      this.msgData.searchContacts(queryTextLower).then((data: Array<IContact>)=>{
        if(data){
          //show loader for 500 ms
          this.presentLoading();
          this.searchResult = data;
          setTimeout(()=>{
            this.loader.dismiss();
          },500);
        }
        else{
          // No data
        }
      }).catch(reason =>{
      });
    }else{
      this.showContactList = true;
      this.searchResult = [];
    }
  }

  addContact(otherUserId){

    this.msgData.addContact(otherUserId).then(data=>{
      this.doRefresh(null);
    }).catch(reason => {
    });

    this.showContactList = true;
    this.searchResult = [];

  }

  removeContact(otherUserId){
    // item.close();
    this.msgData.removeContact(otherUserId).then(data=>{
      this.doRefresh(null);
    }).catch(reason => {
    });
  }

  //get Contacts from API

  doRefresh(refresher) {

    this.msgData.getContactsListFromAPI().then(data => {
      if(data){
        this.contactList = data as Array<IMsgContact>;
      }
      if(refresher) refresher.complete();
    }).catch(reason =>{
    });
    
  }

  presentLoading(){
    this.loader = this.loadingCtrl.create({
      content: "Searching..."
    });
    this.loader.present();
  }


}

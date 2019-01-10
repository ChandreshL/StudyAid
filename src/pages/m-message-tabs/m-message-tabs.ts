import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MessagePage } from './../message/message';
import { ContactsPage } from './../contacts/contacts';


@IonicPage()
@Component({
  selector: 'page-m-message-tabs',
  templateUrl: 'm-message-tabs.html'
})
export class MMessageTabsPage {

  messagePage = MessagePage;
  contactsPage = ContactsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

}

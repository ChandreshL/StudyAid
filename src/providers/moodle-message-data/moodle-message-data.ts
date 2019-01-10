import { Injectable } from '@angular/core';
import { MoodleApiProvider } from './../moodle-api/moodle-api';
import { DatabaseProvider } from './../database/database';

@Injectable()
export class MoodleMessageDataProvider {

  constructor(
    public mdb: DatabaseProvider,
    public mAPI: MoodleApiProvider
  ) {
    
  }


  /**
   * Search, add, remove and get CONTACTS
   */
  searchContacts(){

  }

  addContact(){

    this.getContactsListFromAPI();
  }

  removeContacts(){

    this.getContactsListFromAPI();
  }

  getContactsListFromAPI(){

    this.saveContactsList();
  }

  getContactsList(){

  }

  saveContactsList(){
    //overwrite the current list.

  }


  /**
   * Messages
   */
  //everytime from API not saved in the database.
  getConversations(){

  }

  /**
   * For messages,
   * Every time start with retriving all messages.
   * keep track of limitfrom.
   * limitfrom is a parameter in the api that is start index of msgs to download.
   * 
   * at first limitfrom is zero then count howmany msgs I have.
   */
  //??save messages to database??
  //Keep track of limitfrom = total messages I have.
  getMessagesFromUser(otherUserId){
    //set variables of limitfrom


    
    //Mark msg as read. when displayed.

  }

  sendMessageToUser(otherUserId, Message){
     //getMessageFromUser use limits to get only new messages.

  }






}

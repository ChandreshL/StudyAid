import { Injectable } from '@angular/core';
import { MoodleApiProvider } from './../moodle-api/moodle-api';
import { DatabaseProvider, IMsgContact, IMsgUserMessage } from './../database/database';
import { isArray } from 'ionic-angular/umd/util/util';

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
  searchContacts(searchText: string){

    return new Promise(resolve => {
      this.mAPI.searchContacts(searchText).subscribe(data => {
          if(data && this.isArray(data)){
            resolve(data);
          }else{
            console.log(data);

            // errorcode: "querystringcannotbeempty"
            // exception: "moodle_exception"
            // message: "The query string cannot be empty."

            resolve(false);
          }
        }, error =>{
          console.log("Error mmdata searchContacts");
          resolve(false);
      });
    });
 
  }

  addContact(contactId: number){
    return new Promise(resolve => {
      this.mAPI.createContacts(contactId).subscribe(data => {
          resolve(true);
        }, error =>{
          console.log("Error mmdata removeContact", error);
          resolve(false);
      });
    });
    
  }

  removeContact(contactId: number){
    return new Promise(resolve => {
      this.mAPI.deleteContacts(contactId).subscribe(data => {
          resolve(true);
        }, error =>{
          console.log("Error mmdata removeContact", error);
          resolve(false);
      });
    });
  }

  getContactsList(){
    return new Promise(resolve => {
      this.mdb.msgContact.toArray().then(data =>{
          if(data){
            resolve(data);
          }else{
            resolve(false);
          }
      }).catch(reason => {
        resolve(false);
      });
    });
  }

  //Refresh
  getContactsListFromAPI(){

    return new Promise(resolve => {
      this.mAPI.getMessageContacts().subscribe(data => {

          if(data && data.hasOwnProperty('contacts')){
            //this.saveContactsList();
            this.mdb.saveListToDb(this.mdb.msgContact, data['contacts'] as Array<IMsgContact>, true);
            resolve(data['contacts']);

          }else{
            resolve(false);
          }
        }, error =>{
          console.log("Error mmdata getContactsListFromAPI");
          resolve(false);
      });
    });

    
  }

  saveContactsList(){
    //overwrite the current list.
  }


  /**
   * Conversations
   */
  getConversations(){
    return new Promise(resolve => {
      this.mdb.msgConversation.toArray().then(data =>{
          if(data){
            resolve(data);
          }else{
            resolve(false);
          }
      }).catch(reason => {
        resolve(false);
      });
    });
  }

  //everytime from API not saved in the database.
  getConversationsFromAPI(){

    return new Promise(resolve => {
      this.mAPI.getMessageConversations().subscribe(data => {

          if(data && data.hasOwnProperty('contacts')){
            //this.saveContactsList();
            this.mdb.saveListToDb(this.mdb.msgConversation, data['contacts'] as Array<IMsgContact>, true);
            resolve(data['contacts']);
          }else{
            resolve(false);
          }
        }, error =>{
          console.log("Error mmdata getConversations");
          resolve(false);
      });
    });

  }


  getConversationUser(otherUserId){
    
    //to start new conversation there wont be any user in the database.
    //if result is null then get the data from webservice.
    
    //Check if there is user

    //get it from the API.

    return this.mdb.msgConversation.get(otherUserId);
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

  getMessagesFromUserdb(otherUserId){

    //Combine from and to messages.

    return this.mdb.userMessage.filter(m => {
      if(m.useridfrom === otherUserId || m.useridto === otherUserId)
        return true;
      else
        return false;
    }).toArray();


  }

  getMessagesFromUser(otherUserId, limitfrom){
    //set variables of limitfrom
    return new Promise(resolve => {
      this.mAPI.getMessages(otherUserId, limitfrom).subscribe(data=>{
        
        if(data && data.hasOwnProperty('messages')){

            //remove <p> tags from messages

            //save data to database.
            this.saveMessagesToDb(data['messages']);

            resolve(data['messages']);

        }else{
          resolve(false);
        }

      },error=>{
        resolve(false);
        console.error("Error MoodleMessageData getMessagesFromUser");
      });
    });

    //Mark msg as read. when displayed.
  }

  markAmarkAllMessagesRead(otherUserId){

    return new Promise(resolve => {
      this.mAPI.markAllMessagesRead(otherUserId).subscribe(data =>{
        if(data){
          resolve(true);
        }else{
          resolve(false);
        }
      },error => {
        resolve(false);
      });
    });

  }

  saveMessagesToDb(messages){
    this.mdb.saveListToDb(this.mdb.userMessage, messages as Array<IMsgUserMessage>);
  }

  sendMessageToUser(otherUserId, Message){
     //getMessageFromUser use limits to get only new messages.
     return new Promise(resolve =>{
      this.mAPI.sendMessage(otherUserId, Message).subscribe(data=>{
        if(data && this.isArray(data)){
          resolve(true);
        }else{
          resolve(false);
        }
      },error=> {
        resolve(false);
        console.error("error MoodleMessageData sendMessageToUser");
      });
     });
      
  }



  isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
  }


}

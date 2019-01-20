import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from '@angular/core';

@Injectable()
export class MoodleApiProvider {

  private siteUrl: string = "http://localhost/moodle";
  //private siteUrl: string = "https://moodle.hochschule-rhein-waal.de";
  private authUrl: string = "login/token.php";
  private apiUrl: string = "webservice/rest/server.php";
  private token: string;
  private userId: number;

  constructor(public http: HttpClient) {

  }

  setToken(t: string){
    //Only write once
    if(!this.token)
      this.token = t;
  }

  setUserId(u: number){
    //Only write once
    if(!this.userId)
      this.userId = u;
  }

  getUserId(){
    return this.userId;
  }

/*
* Send http request
*/

  sendPostRequest(body:string, login?: boolean){

    let url = this.siteUrl + "/" + this.apiUrl;
    if(login){
      url = this.siteUrl + "/" + this.authUrl;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    };

    return this.http.post(
      url,
      body,
      httpOptions
    );

  }

  downloadFile(fileurl){

    let body = new HttpParams()
      .set("wstoken", this.token );

    this.sendPostRequest(body.toString());

    let req = new HttpRequest('POST', fileurl, body.toString(), 
    { 
      responseType: 'arraybuffer',
      reportProgress: true
    });

    return this.http.request(req); 
  }


/*
* Login Methods
*/
  login(username:string, password:string){

    //"22123" "Abcdef1*"
    const body = new HttpParams()
      .set("service", "moodle_mobile_app")
      .set("username", username)
      .set("password", password);

    return this.sendPostRequest(body.toString(), true);

  }


/*
* get user id, which is used to get enrolled courses
*/

  getSiteInfo(){

    const body = new HttpParams()
      .set("wstoken", this.token)
      .set("moodlewsrestformat", "json")
      .set("wsfunction", "core_webservice_get_site_info");

    return this.sendPostRequest(body.toString());

  }


/*
* Search and enroll into course.
*/

  searchCourse(searchStr){

    const body = new HttpParams()
      .set("wstoken", this.token )
      .set("moodlewsrestformat", "json")
      .set("wsfunction", "core_course_search_courses")
      .set("criterianame", "search")
      .set("criteriavalue", searchStr)
      .set("page", "0")
      .set("perpage", "10");

    return this.sendPostRequest(body.toString());

  }

  getCourseEnrolmentMethods(courseid){

    const body = new HttpParams()
      .set("wstoken", this.token )
      .set("moodlewsrestformat", "json")
      .set("wsfunction", "core_enrol_get_course_enrolment_methods")
      .set("courseid", courseid);

    return this.sendPostRequest(body.toString());

  }

  enrollInCourse(courseid, password, instanceid){

    const body = new HttpParams()
      .set("wstoken", this.token )
      .set("moodlewsrestformat", "json")
      .set("wsfunction", "enrol_self_enrol_user")
      .set("courseid", courseid)
      .set("password", password)
      .set("instanceid", instanceid);

    return this.sendPostRequest(body.toString());

  }



/*
* Get enrolled courses
*/

  getEnrolledCourses(){

    const body = new HttpParams()
      .set("wstoken", this.token )
      .set("moodlewsrestformat", "json")
      .set("wsfunction", "core_enrol_get_users_courses")
      .set("userid", this.userId.toString());

      return this.sendPostRequest(body.toString());

  }


/*
* Get Content of courses
* Content is in sections.
*/

  getCourseContent(courseId){

    const body = new HttpParams()
      .set("wstoken", this.token )
      .set("moodlewsrestformat", "json")
      .set("wsfunction", "core_course_get_contents")
      .set("courseid", courseId);

    return this.sendPostRequest(body.toString());

  }




  /**
   * ************************************
   * Web service APIs for moodle messages.
   * ************************************
   */

   /**
    * get unread conversations count
    * returns int
    */
  getUnreadConversationsCount(){
    
    const body = new HttpParams()
    .set("wstoken", this.token )
    .set("moodlewsrestformat", "json")
    .set("wsfunction", "core_message_get_unread_conversations_count")
    .set("useridto", this.userId.toString());

    //returns int.
    return this.sendPostRequest(body.toString());

  }


  /**
   * 
   * Message Conversations.
   */

  getMessageConversations(){
    
    const body = new HttpParams()
    .set("wstoken", this.token )
    .set("moodlewsrestformat", "json")
    .set("wsfunction", "core_message_data_for_messagearea_conversations")
    .set("userid", this.userId.toString());

    return this.sendPostRequest(body.toString());

/*     {
      "contacts": [
          {
              "userid": 2,
              "fullname": "Admin Admin",
              "profileimageurl": "http://localhost/moodle/theme/image.php/boost/core/1527652034/u/f1",
              "profileimageurlsmall": "http://localhost/moodle/theme/image.php/boost/core/1527652034/u/f2",
              "ismessaging": true,
              "sentfromcurrentuser": false,
              "lastmessage": "second conversation test",
              "messageid": 6,
              "showonlinestatus": false,
              "isonline": null,
              "isread": false,
              "isblocked": false,
              "unreadcount": 1
          },
          {
              "userid": 3,
              "fullname": "Faustina Garstang",
              "profileimageurl": "http://localhost/moodle/theme/image.php/boost/core/1527652034/u/f1",
              "profileimageurlsmall": "http://localhost/moodle/theme/image.php/boost/core/1527652034/u/f2",
              "ismessaging": true,
              "sentfromcurrentuser": false,
              "lastmessage": "unread counter test",
              "messageid": 5,
              "showonlinestatus": false,
              "isonline": null,
              "isread": false,
              "isblocked": false,
              "unreadcount": 2
          }
      ]
  } */

  }


  getUsersById(otherUserId){


    const body = new HttpParams()
    .set("wstoken", this.token )
    .set("moodlewsrestformat", "json")
    .set("wsfunction", "core_message_data_for_messagearea_conversations")
    .set("criteria[0][key]", "id")
    .set("criteria[0][value]", otherUserId);

    console.log(this.sendPostRequest(body.toString()));
    //return this.sendPostRequest(body.toString());

  }
  
  /**
   * 
   * Message Messages.
   * limitfrom - start number of the messages to return.
   * limitnum - total number of messages to return in response
   */

  getMessages(otherUserId, limitFrom = "0", limitNum = "0"){
    
    const body = new HttpParams()
    .set("wstoken", this.token )
    .set("moodlewsrestformat", "json")
    .set("wsfunction", "core_message_data_for_messagearea_messages")
    .set("newest", "0")
    .set("timefrom", "0")
    .set("currentuserid", this.userId.toString())
    .set("otheruserid", otherUserId)
    .set("limitfrom", limitFrom)
    .set("limitnum", limitNum);

    return this.sendPostRequest(body.toString());

/*     {
      "iscurrentuser": true,
      "currentuserid": 3,
      "otheruserid": 4,
      "otheruserfullname": "Vonnie Bromfield",
      "showonlinestatus": true,
      "isonline": false,
      "messages": [
          {
              "id": 1,
              "useridfrom": 3,
              "useridto": 4,
              "text": "<p>From Messages, Course search, From Student</p>",
              "displayblocktime": true,
              "blocktime": "Thursday, 10 January 2019",
              "position": "right",
              "timesent": "12:44 PM",
              "timecreated": 1547120642,
              "isread": 0
          },
          {
              "id": 2,
              "useridfrom": 4,
              "useridto": 3,
              "text": "<p>unread notification, from message, From teacher</p>",
              "displayblocktime": false,
              "blocktime": "Thursday, 10 January 2019",
              "position": "left",
              "timesent": "12:50 PM",
              "timecreated": 1547121034,
              "isread": 1
          }
      ],
      "isblocked": false
  } */    

  }


/**
 * 
 * Mark all messages as read for a given user
 * 
 * core_message_mark_all_messages_as_read
 */
  markAllMessagesRead(otherUserId){

    const body = new HttpParams()
    .set("wstoken", this.token )
    .set("moodlewsrestformat", "json")
    .set("wsfunction", "core_message_mark_all_messages_as_read")
    .set("useridto", this.userId.toString())
    .set("useridfrom", otherUserId);

    return this.sendPostRequest(body.toString());

    //return int 
    //True if the messages were marked read, false otherwise

  }


  /**
   * 
   * Search Contacts.
   */

  searchContacts(searchText){
    
    const body = new HttpParams()
    .set("wstoken", this.token )
    .set("moodlewsrestformat", "json")
    .set("wsfunction", "core_message_search_contacts")
    .set("searchtext", searchText);
    //.set("onlymycourses", "0");

    //return type Array<IContact>
    return this.sendPostRequest(body.toString());

  }

  /**
   * 
   * send Message
   */

  sendMessage(toUserId, message){
    
    const body = new HttpParams()
    .set("wstoken", this.token )
    .set("moodlewsrestformat", "json")
    .set("wsfunction", "core_message_send_instant_messages")
    .set("messages[0][touserid]", toUserId)
    .set("messages[0][text]", message);
    
    return this.sendPostRequest(body.toString());

/*     [
      {
          "msgid": 7
      }
  ] */

  }


  /**
   * 
   * create message contacts.
   */

  createContacts(userId){
    
    const body = new HttpParams()
    .set("wstoken", this.token )
    .set("moodlewsrestformat", "json")
    .set("wsfunction", "core_message_create_contacts")
    .set("userids[0]", userId);
    
    return this.sendPostRequest(body.toString());

    
/*     [] // already in the list.

    [] // newly created. 
*/

  }

  /**
   * 
   * delete message contacts.
   */

  deleteContacts(userId){
    
    const body = new HttpParams()
    .set("wstoken", this.token )
    .set("moodlewsrestformat", "json")
    .set("wsfunction", "core_message_delete_contacts")
    .set("userids[0]", userId);
    
    return this.sendPostRequest(body.toString());

    // returns null
    // http response status: 200

  }


  /**
   * 
   * get list of message contacts.
   */

  getMessageContacts(){
    
    const body = new HttpParams()
    .set("wstoken", this.token )
    .set("moodlewsrestformat", "json")
    .set("wsfunction", "core_message_data_for_messagearea_contacts")
    .set("userid", this.userId.toString());
    
    return this.sendPostRequest(body.toString());

  }



}

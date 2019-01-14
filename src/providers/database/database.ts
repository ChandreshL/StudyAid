import { Injectable } from '@angular/core';
import Dexie from 'dexie';

@Injectable()
export class DatabaseProvider extends  Dexie{

  // Declare implicit table properties.
  // (just to inform Typescript. Instanciated by Dexie in stores() method)

  user: Dexie.Table<IUser, string>; // string = type of the primkey
  site: Dexie.Table<ISite, string>; // number = type of the primkey
  enrolledCourses: Dexie.Table<ImEnrolledCourse, number>;
  courseSectionContent: Dexie.Table<ImCourseSectionContent, number>;
  msgContact: Dexie.Table<IMsgContact, number>;
  msgConversation: Dexie.Table<IMsgContact, number>;
  userMessage: Dexie.Table<IMsgUserMessage, number>;

  constructor() {
    super("StudyAidDb");

    this.version(1).stores({
        user: "token",
        site: "siteurl",
        enrolledCourses: "id",
        courseSectionContent: "id, courseId",
        msgContact: "userid",
        msgConversation: "userid",
        userMessage: "id, useridfrom"
    });
  }

    //save data list to database
  saveListToDb(table: Dexie.Table<any,any>, dataList: any[], overwrite?: boolean){

    this.transaction('rw', table, () => {

      if(overwrite){
        table.clear().then( result => {
          table.bulkAdd(dataList)
            .then(value => {})
            .catch(reason => {});
        });
      }else{
        table.bulkAdd(dataList)
        .then(value => {})
        .catch(reason => {});
      }

    }).catch(e => {
      console.log("Error, moodledata saveToDb", e);
      //console.log(e.stack || e);
    });
  }

  clearAllTables(){

    this.user.clear();
    this.site.clear();
    this.enrolledCourses.clear();
    this.courseSectionContent.clear();
    this.msgContact.clear();
    this.msgConversation.clear();

  }

}

export interface IUser{
  token: string;
  privatetoken?: string;
}

export interface ISite {

  sitename: string;   //site name
  username: string;   //username
  firstname: string;   //first name
  lastname: string;   //last name
  fullname: string;   //user full name
  lang: string;   //Current language.
  userid: number;   //user id
  siteurl: string;   //site url
  userpictureurl: string;
  siteid?: number; // Optional Site course ID
  sitecalendartype?: string;  // Optional Calendar type set in the site.
  usercalendartype?: string;  // Optional

}

export interface ImEnrolledCourse {
  id: number, //id of course
  shortname: string,
  fullname: string,
  enrolledusercount: number,
  idnumber: string,   //id number of course
  visible: number,    //1 means visible, 0 means hidden course
  summary: string,
  summaryformat: number,   //Optional summary format (1 = HTML, 0 = MOODLE, 2 = PLAIN or 4 = MARKDOWN)
  format: string,
  showgrades: boolean,
  lang: string,
  enablecompletion: boolean,
  category: number,
  progress: number,
  startdate: number,
  enddate: number
}

export interface ImCourseSectionContent {

  courseId: number,
  id:  number,
  name:  string,
  visible:  number,
  summary:  string,
  summaryformat:  number,
  section:  number,
  hiddenbynumsections:  number,
  uservisible:  boolean,
  modules: Array<ImSectionModule>
  
}

export interface ImSectionModule{
  id: number,
  name: string,
  visible: number,
  uservisible: boolean,
  contents: Array<ImModuleContent>
}

export interface ImModuleContent{
  type: string,
  filename: string,
  fileurl: string,
  mimetype: string
}

export interface IContact {
  id: number,
  fullname: string,
  profileimageurl: string,
  profileimageurlsmall: string
}

export interface ImCourse {

  id: number,
  fullname: string,
  displayname: string,
  shortname: string,
  categoryid: number,
  categoryname: string,
  sortorder: number,
  summary: string,
  summaryformat: number,
  summaryfiles: Array<string>,
  overviewfiles: Array<string>,
  contacts: Array<IContact>,
  enrollmentmethods: Array<string>

}

export interface ImCourseList {
    total: number,
    courses: Array<ImCourse>,
    warnings: Array<any>
}

export interface ImCourseEnrolmentMethods {
  id: number,   //id of course enrolment instance
  courseid: number,   //id of course
  type: string,   //type of enrolment plugin
  name: string,   //name of enrolment plugin
  status: string,   //status of enrolment plugin
  wsfunction: string,   // Optional webservice function to get more information
}

export interface IMsgContact{

  userid: number,
  fullname: string,
  profileimageurl: string,
  profileimageurlsmall: string,
  ismessaging: boolean,
  sentfromcurrentuser: boolean,
  lastmessage: string,
  messageid: number,
  showonlinestatus: boolean,
  isonline: boolean,
  isread: boolean,
  isblocked: boolean,
  unreadcount: number

}

export interface IMsgUserMessage{
  id: number,
  useridfrom: number,
  useridto: number,
  text: string,
  displayblocktime: boolean,
  blocktime: string,  //"Thursday, 10 January 2019",
  position: string,   //"right",
  timesent:  string,  // "12:44 PM",
  timecreated: number,
  isread: number
}
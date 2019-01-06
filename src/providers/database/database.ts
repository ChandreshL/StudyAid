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

  constructor() {
    super("StudyAidDb");

    this.version(1).stores({
        user: "token, privatetoken",
        site: "sitename, username, firstname, lastname, fullname, lang, userid",
        enrolledCourses: "id, shortname, fullname",
        courseSectionContent: "id, courseId"
    });
  }

  saveToDatabase(table:string,data:any, id?: number){

    //convert data object to table data.
    let dataObj;
    switch (table){
      case "user":
        dataObj = User.fromJSON(data);
        break;
      case  "site":
        dataObj = Site.fromJSON(data);
        break;
      case "enrolledCourses":
        dataObj = mEnrolledCourse.fromJSON(data);
        break;
      case "courseSectionContent":
        if(id) {
          dataObj = null;
        }else {
          dataObj = mCourseSectionContent.fromJSONWithCourse(id, data);
        }
        break;
      default:
        dataObj = null;
    }

    return this.table(table).add(dataObj);

  }


}

export interface IContacts {
  id: number,
  fullname: string
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
  contacts: Array<IContacts>,
  enrollmentmethods: Array<string>

}

export interface ImCourseList {
    total: number,
    courses: Array<mCourse>,
    warnings: Array<any>
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

export interface ImCourseEnrolmentMethods {
  id: number,   //id of course enrolment instance
  courseid: number,   //id of course
  type: string,   //type of enrolment plugin
  name: string,   //name of enrolment plugin
  status: string,   //status of enrolment plugin
  wsfunction: string,   // Optional webservice function to get more information
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
  uservisible:  boolean

}



export class User implements IUser{

  token:string;
  privatetoken?: string;

  constructor(token:string, privatetoken?: string) {
    this.token = token;
    if (privatetoken) this.privatetoken = privatetoken;
  }

  static fromJSON(data){

    if((typeof data) != "object")
      data = JSON.parse(data);

    return new User(
      data.hasOwnProperty('token') ? data.token : "",
      data.hasOwnProperty('privatetoken') ? data.privatetoken : null
    );

  }

}

export class Site implements  ISite{
  constructor(
    public firstname: string,
    public fullname: string,
    public lang: string,
    public lastname: string,
    public sitecalendartype: string,
    public siteid: number,
    public sitename: string,
    public siteurl: string,
    public usercalendartype: string,
    public userid: number,
    public username: string,
    public userpictureurl: string
  ){

  }

  static fromJSON(data){

    if((typeof data) != "object")
      data = JSON.parse(data);

    return new Site(
      data.hasOwnProperty('firstname') ? data.firstname : "",
      data.hasOwnProperty('fullname') ? data.fullname : "",
      data.hasOwnProperty('lang') ? data.lang : "",
      data.hasOwnProperty('lastname') ? data.lastname : "",
      data.hasOwnProperty('sitecalendartype') ? data.sitecalendartype : "",
      data.hasOwnProperty('siteid') ? data.siteid : null,
      data.hasOwnProperty('sitename') ? data.sitename : "",
      data.hasOwnProperty('siteurl') ? data.siteurl : "",
      data.hasOwnProperty('usercalendartype') ? data.usercalendartype : "",
      data.hasOwnProperty('userid') ? data.userid : null,
      data.hasOwnProperty('username') ? data.username : "",
      data.hasOwnProperty('userpictureurl') ? data.userpictureurl : ""
    );

  }

}

export class mCourse implements ImCourse{

  constructor(
    public id: number,
    public fullname: string,
    public displayname: string,
    public shortname: string,
    public categoryid: number,
    public categoryname: string,
    public sortorder: number,
    public summary: string,
    public summaryformat: number,
    public summaryfiles: Array<string>,
    public overviewfiles: Array<string>,
    public contacts: Array<IContacts>,
    public enrollmentmethods: Array<string>
  ){}

  static fromJSON(data){

    if((typeof data) != "object")
      data = JSON.parse(data);

    return new mCourse(
      data.hasOwnProperty('id') ? data.id : "",
      data.hasOwnProperty('fullname') ? data.fullname : "",
      data.hasOwnProperty('displayname') ? data.displayname : "",
      data.hasOwnProperty('shortname') ? data.shortname : "",
      data.hasOwnProperty('categoryid') ? data.categoryid : "",
      data.hasOwnProperty('categoryname') ? data.categoryname : "",
      data.hasOwnProperty('sortorder') ? data.sortorder : "",
      data.hasOwnProperty('summary') ? data.summary : "",
      data.hasOwnProperty('summaryformat') ? data.summaryformat : "",
      null,
      null,
      null,
      data.hasOwnProperty('enrollmentmethods') ? data.enrollmentmethods : ""
    );
  }

}

export class mEnrolledCourse implements ImEnrolledCourse{
  constructor(
    public id: number,
    public shortname: string,
    public fullname: string,
    public enrolledusercount: number,
    public idnumber: string,
    public visible: number,
    public summary: string,
    public summaryformat: number,
    public format: string,
    public showgrades: boolean,
    public lang: string,
    public enablecompletion: boolean,
    public category: number,
    public progress: number,
    public startdate: number,
    public enddate: number
  ){}

  static fromJSON(data){

    if((typeof data) != "object")
      data = JSON.parse(data);

    return new mEnrolledCourse(
      data.hasOwnProperty('id') ? data.id : null,
      data.hasOwnProperty('shortname') ? data.shortname : null,
      data.hasOwnProperty('fullname') ? data.fullname : null,
      data.hasOwnProperty('enrolledusercount') ? data.enrolledusercount : null,
      data.hasOwnProperty('idnumber') ? data.idnumber : null,
      data.hasOwnProperty('visible') ? data.visible : null,
      data.hasOwnProperty('summary') ? data.summary : null,
      data.hasOwnProperty('summaryformat') ? data.summaryformat : null,
      data.hasOwnProperty('format') ? data.format : null,
      data.hasOwnProperty('showgrades') ? data.showgrades : null,
      data.hasOwnProperty('lang') ? data.lang : null,
      data.hasOwnProperty('enablecompletion') ? data.enablecompletion : null,
      data.hasOwnProperty('category') ? data.category : null,
      data.hasOwnProperty('progress') ? data.progress : null,
      data.hasOwnProperty('startdate') ? data.startdate : null,
      data.hasOwnProperty('enddate') ? data.enddate : null
    );
  }

}

export class mCourseSectionContent {

  constructor(
    public courseId: number,
    public id:  number,
    public name:  string,
    public visible:  number,
    public summary:  string,
    public summaryformat:  number,
    public section:  number,
    public hiddenbynumsections:  number,
    public uservisible:  boolean
  ){

  }

  static fromJSON(data){

    if((typeof data) != "object")
      data = JSON.parse(data);

    return new mCourseSectionContent(
      data.hasOwnProperty('courseId') ? data.courseId : "",
      data.hasOwnProperty('id') ? data.id : "",
      data.hasOwnProperty('name') ? data.name : "",
      data.hasOwnProperty('visible') ? data.visible : "",
      data.hasOwnProperty('summary') ? data.summary : "",
      data.hasOwnProperty('summaryformat') ? data.summaryformat : null,
      data.hasOwnProperty('section') ? data.section : "",
      data.hasOwnProperty('hiddenbynumsections') ? data.hiddenbynumsections : "",
      data.hasOwnProperty('uservisible') ? data.uservisible : ""
    );
  }

  static fromJSONWithCourse(courseid, data){

    if(courseid) return;

    if((typeof data) != "object")
      data = JSON.parse(data);

    return new mCourseSectionContent(
      courseid,
      data.hasOwnProperty('id') ? data.id : "",
      data.hasOwnProperty('name') ? data.name : "",
      data.hasOwnProperty('visible') ? data.visible : "",
      data.hasOwnProperty('summary') ? data.summary : "",
      data.hasOwnProperty('summaryformat') ? data.summaryformat : null,
      data.hasOwnProperty('section') ? data.section : "",
      data.hasOwnProperty('hiddenbynumsections') ? data.hiddenbynumsections : "",
      data.hasOwnProperty('uservisible') ? data.uservisible : ""
    );
  }


}

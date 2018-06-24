import { Injectable } from '@angular/core';
import Dexie from 'dexie';

@Injectable()
export class DatabaseProvider extends  Dexie{

  // Declare implicit table properties.
  // (just to inform Typescript. Instanciated by Dexie in stores() method)

  user: Dexie.Table<IUser, string>; // string = type of the primkey
  site: Dexie.Table<ISite, string>; // number = type of the primkey

  constructor() {
    super("StudyAidDb");

    this.version(1).stores({
        user: "token, privatetoken",
        site: "sitename, username, firstname, lastname, fullname, lang, userid"
    });
  }

  saveToDatabase(table:string,data:any){

    //convert data object to table data.
    let dataObj;
    switch (table){
      case "user":
        dataObj = User.fromJSON(data);
        break;
      case  "site":
        dataObj = Site.fromJSON(data);
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

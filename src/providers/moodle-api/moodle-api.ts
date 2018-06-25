import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import {DatabaseProvider, User, Site, IUser, ISite, ImEnrolledCourse} from "../database/database";

/*
  Generated class for the MoodleApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MoodleApiProvider {

  private siteUrl: string = "http://localhost/moodle";
  private authUrl: string = "login/token.php";
  private apiUrl: string = "webservice/rest/server.php";
  private token: string;
  private userId: number;

  constructor(public http: HttpClient, private appdb: DatabaseProvider) {

    this.appdb.user.mapToClass(User);
    this.appdb.site.mapToClass(Site);

  }

  async isLoggedIn(){

    //check in database
    let count = await this.appdb.user.count();
    if (count > 0) {

      await this.appdb.user.toCollection().first().then(data =>{
        if(data) this.token = data.token;
      });

      await this.appdb.site.toCollection().first().then(data => {
        if(data){ this.userId = data.userid; }
      });

    }

    return (this.token && this.token.length > 0)
  }

  async login(username:string, password:string){

    let url = this.siteUrl + "/" + this.authUrl;

    //"22123" "Abcdef1*"
    const body = new HttpParams()
      .set("service", "moodle_mobile_app")
      .set("username", username)
      .set("password", password);

    let Loggedin: boolean = false;

    await new Promise(resolve => {
      this.sendPostRequest(url,body.toString()).subscribe(data => {

        if(data.hasOwnProperty('token')){

          let d  = data as IUser;
          this.token = d.token;

          this.appdb.saveToDatabase('user' ,data);

          this.getSiteInfo();


          Loggedin = true;
          resolve(true);
        }else{
          Loggedin = false;
          resolve(false);
        }

        console.log("in await");

      }, error =>{
        console.log(error);
        Loggedin = false;
        resolve(false);
      });

    });

    console.log("outside await");

    return Loggedin;

  }

  getSiteInfo(){
    let url = this.siteUrl + "/" + this.apiUrl;

    const body = new HttpParams()
      .set("wstoken", this.token)
      .set("moodlewsrestformat", "json")
      .set("wsfunction", "core_webservice_get_site_info");

    this.sendPostRequest(url,body.toString()).subscribe((data: ISite) => {

      this.userId = data.userid;

      this.appdb.saveToDatabase('site', data);

    }, error => {
      console.log(error);
    });

  }

  searchCourse(searchStr){

    let url = this.siteUrl + "/" + this.apiUrl;

    const body = new HttpParams()
      .set("wstoken", this.token )
      .set("moodlewsrestformat", "json")
      .set("wsfunction", "core_course_search_courses")
      .set("criterianame", "search")
      .set("criteriavalue", searchStr)
      .set("page", "0")
      .set("perpage", "10");

    return new Promise(resolve => {

      this.sendPostRequest(url,body.toString()).subscribe(data => {
        if(data.hasOwnProperty('courses')){
          resolve(data);
        }else{
          resolve("");
        }
      }, error =>{
        console.log(error);
        resolve("");
      });

    });

  }

  getCourseEnrolmentMethods(courseid){

    let url = this.siteUrl + "/" + this.apiUrl;

    const body = new HttpParams()
      .set("wstoken", this.token )
      .set("moodlewsrestformat", "json")
      .set("wsfunction", "core_enrol_get_course_enrolment_methods")
      .set("courseid", courseid);


    return new Promise(resolve => {

      this.sendPostRequest(url,body.toString()).subscribe(data => {
        if(this.isArray(data)){
          resolve(data);
        }else{
          console.log(data);
          resolve(false);
        }
      }, error =>{
        console.log(error);
        resolve(false);
      });

    });

  }

  enrollInCourse(courseid, password, instanceid){

    let url = this.siteUrl + "/" + this.apiUrl;

    const body = new HttpParams()
      .set("wstoken", this.token )
      .set("moodlewsrestformat", "json")
      .set("wsfunction", "enrol_self_enrol_user")
      .set("courseid", courseid)
      .set("password", password)
      .set("instanceid", instanceid);


    return new Promise(resolve => {

      this.sendPostRequest(url,body.toString()).subscribe(data => {
        if(data.hasOwnProperty('status')){
          resolve(data);
        }else{
          console.log(data);
          resolve(false);
        }
      }, error =>{
        console.log(error);
        resolve(false);
      });

    });

  }

  async getEnrolledCourses(){

    let url = this.siteUrl + "/" + this.apiUrl;

    const body = new HttpParams()
      .set("wstoken", this.token )
      .set("moodlewsrestformat", "json")
      .set("wsfunction", "core_enrol_get_users_courses")
      .set("userid", this.userId.toString());

    return await new Promise(resolve => {

      this.sendPostRequest(url,body.toString()).subscribe(async (data: Array<ImEnrolledCourse>)=> {

        //Save in database
        if(data.length > 0){

          // await this.appdb.transaction('rw', this.appdb.enrolledCourses, () =>{
          //   data.forEach(async d => {
          //      await this.appdb.enrolledCourses.add(d);
          //   })
          // });

          resolve(data);
        }else{
          resolve(false);
        }
      }, error =>{
        console.log(error);
        resolve(false);
      });

    });

  }

  getCourseContent(courseId){

  }


  sendPostRequest(url:string, body:string){

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    };

    return this.http.post(
      url,
      body,
      httpOptions
    )

  }

  isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
  }

}

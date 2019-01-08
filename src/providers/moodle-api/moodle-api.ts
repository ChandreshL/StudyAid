import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { DatabaseProvider, IUser, ISite } from "../database/database";


@Injectable()
export class MoodleApiProvider {

  private siteUrl: string = "http://localhost/moodle";
  private authUrl: string = "login/token.php";
  private apiUrl: string = "webservice/rest/server.php";
  private token: string;
  private userId: number;

  constructor(public http: HttpClient, private appdb: DatabaseProvider) {

    // this.appdb.user.mapToClass(User);
    // this.appdb.site.mapToClass(Site);
    // this.appdb.enrolledCourses.mapToClass(mEnrolledCourse);

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

/*
* Login Methods
*/
  login(username:string, password:string){

    let url = this.siteUrl + "/" + this.authUrl;

    //"22123" "Abcdef1*"
    const body = new HttpParams()
      .set("service", "moodle_mobile_app")
      .set("username", username)
      .set("password", password);

    let Loggedin: boolean = false;

    return this.sendPostRequest(url,body.toString(), true);

  }


/*
* get user id, which is used to get enrolled courses
*/

  getSiteInfo(){
    let url = this.siteUrl + "/" + this.apiUrl;

    const body = new HttpParams()
      .set("wstoken", this.token)
      .set("moodlewsrestformat", "json")
      .set("wsfunction", "core_webservice_get_site_info");

    return this.sendPostRequest(url,body.toString());

  }


/*
* Search and enroll into course.
*/

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



/*
* Get enrolled courses
*/

  getEnrolledCourses(){

    let url = this.siteUrl + "/" + this.apiUrl;

    const body = new HttpParams()
      .set("wstoken", this.token )
      .set("moodlewsrestformat", "json")
      .set("wsfunction", "core_enrol_get_users_courses")
      .set("userid", this.userId.toString());

      return this.sendPostRequest(url,body.toString());

  }


/*
* Get Content of courses
* Content is in sections.
*/

  getCourseContent(courseId){

    let url = this.siteUrl + "/" + this.apiUrl;

    const body = new HttpParams()
      .set("wstoken", this.token )
      .set("moodlewsrestformat", "json")
      .set("wsfunction", "core_course_get_contents")
      .set("courseid", courseId);

    return this.sendPostRequest(url,body.toString());

  }


/*
* Send http request
*/

  sendPostRequest(url:string, body:string, login?: boolean){

    url = this.siteUrl + "/" + this.apiUrl;
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

  isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
  }

}

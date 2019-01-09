import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';

@Injectable()
export class MoodleApiProvider {

  private siteUrl: string = "http://localhost/moodle";
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

/*
* Login Methods
*/
  login(username:string, password:string){

    //"22123" "Abcdef1*"
    const body = new HttpParams()
      .set("service", "moodle_mobile_app")
      .set("username", username)
      .set("password", password);

    let Loggedin: boolean = false;

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


}

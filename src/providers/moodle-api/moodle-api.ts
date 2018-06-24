import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from '@angular/core';
import {DatabaseProvider, User, Site, IUser} from "../database/database";

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
  private userId: string;

  constructor(public http: HttpClient, private appdb: DatabaseProvider) {

    this.appdb.user.mapToClass(User);
    this.appdb.site.mapToClass(Site);

  }

  async isLoggedIn(){

    //check in database
    let count = await this.appdb.user.count();
    if (count > 0) {

      await this.appdb.user.toCollection().first().then(data =>{
        this.token = data.token;
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

          //todo: get sitedata and populate userid

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


  searchCourse(searchStr){

  }

  enrollInCourse(password){

  }

  getEnrolledCourses(userId){

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

}

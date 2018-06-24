import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Storage } from "@ionic/storage";

interface tokenJson {
  token: string,
  privatetoken: string
}

@Injectable()
export class AuthProvider {

  baseUrl: string = "http://localhost/moodle/login/token.php";
  mtoken: string;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {

  }

  async isMoodleLoggedin(){

    return await this.storage.get('mtoken').then( value => {
          return value && true;
      });
  }

  //return true if logged in and false if not.
  loginToMoodle(formdata: {username:string, password:string}){

    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type': 'application/json'
        "Content-Type": "application/x-www-form-urlencoded"
      })
    };

    //"22123"
    //"Abcdef1*"
    const body = new HttpParams()
      .set("username", formdata.username)
      .set("password", formdata.password)
      .set("service", "moodle_mobile_app");

    return new Promise(async resolve => {
      await this.http.post(
          this.baseUrl,
          body.toString(),
          httpOptions
        ).subscribe(data => {

            let d = data as tokenJson;
            if(d.token && d.token.length > 0){
              this.storage.set('mtoken', d.token);
              resolve(true);
            }else{
              resolve(false);
            }
          }, resError => {
            console.log(resError);
            resolve(false);
        });
    });

  }



}


/*

async loginToMoodle(){

    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type': 'application/json'
        "Content-Type": "application/x-www-form-urlencoded"
      })
    };

    // const formData = new FormData();
    // formData.append("username", "22123");
    // formData.append("password", "Abcdef1*");
    // formData.append("service", "moodle_mobile_app");

    const body = new HttpParams()
      .set("username", "22123")
      .set("password", "Abcdef1*")
      .set("service", "moodle_mobile_app");

    await this.http.post(
      this.baseUrl,
      //{"username": "22123", "password": "Abcdef1*", "service": "moodle_mobile_app"},
      //formData,
      body.toString(),
      httpOptions
    ).subscribe(data => {
        let d = data as tokenJson;
        if(d.token.length > 0){
          this.storage.setItem('mtoken', d.token);
        }
        return true;
      }, resError => {
        console.log(resError);
        return false;
    });

  }

 */

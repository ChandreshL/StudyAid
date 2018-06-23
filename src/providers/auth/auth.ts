import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";


interface loginRes {
  token: string,
  privatetoken: any
}

@Injectable()
export class AuthProvider {

  baseUrl: string = "http://localhost/moodle/login/token.php";

  constructor(private http: HttpClient) {

  }

  checkMoodleLogin(){
    return new Promise((resolve) => {

      setTimeout(()=>{
        resolve(false);
      },500);

    });
  }

  //return true if logged in and false if not.
  async loginToMoodle(){

    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type': 'application/json'
        "Content-Type": "application/x-www-form-urlencoded"
      })
    };

    const formData = new FormData();
    formData.append("username", "22123");
    formData.append("password", "Abcdef1*");
    formData.append("service", "moodle_mobile_app");

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
    )
      .subscribe(data => {
        let d = data as loginRes;
        console.log(data);
        console.log(d.token);
        return true;

      }, resError => {
        console.log(resError);
        return false;
    });

  }



}

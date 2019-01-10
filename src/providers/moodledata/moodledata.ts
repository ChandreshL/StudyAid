import { Injectable } from '@angular/core';
import { MoodleApiProvider } from './../moodle-api/moodle-api';
import { DatabaseProvider, IUser, ISite, ImEnrolledCourse, ImCourseSectionContent } from './../database/database';

@Injectable()
export class MoodledataProvider {

  constructor(
    public mdb: DatabaseProvider,
    public mAPI: MoodleApiProvider
  ) {
  }

  //check login
  async isLoggedIn(){

    //check in database
    let loggedin: boolean = false;
    let count = await this.mdb.user.count();

    if (count > 0) {

      await this.mdb.user.toCollection().first().then(async (data) =>{
        if(data) {
          
          this.mAPI.setToken(data.token);

          await this.mdb.site.toCollection().first().then(data => {
            if(data){ this.mAPI.setUserId(data.userid); }
          });

          loggedin = data.token && data.token.length > 0
        }
      });

    }

    return loggedin;
  }

  //login
  login(username:string, password:string){

      // let Loggedin: boolean = false;
      
      return new Promise(resolve => {
        this.mAPI.login(username,password).subscribe(data => {

          if(data.hasOwnProperty('token')){

            let d  = data as IUser;
            this.mAPI.setToken(d.token);
            
            this.mdb.user.add(d);

            this.getSiteInfo();

            // Loggedin = true;
            resolve(true);
          }else{
            //Loggedin = false;
            resolve(false);
          }

        }, error =>{
          console.log(error);
          //Loggedin = false;
          resolve(false);
        });

      });

      //return Loggedin;

    }

  //logout
  logout(){
      //delete all data from database.
      this.mdb.clearAllTables();      

    }

/*
* get user id, which is used to get enrolled courses
*/
  getSiteInfo(){
    
    this.mAPI.getSiteInfo().subscribe((data: ISite) => {

      this.mAPI.setUserId(data.userid);

      this.mdb.site.add(data);

    }, error => {
      console.log(error);
    });

  }


  //search course
  searchCourses(queryText){

    return new Promise(resolve => {
      this.mAPI.searchCourse(queryText).subscribe(data => {
        
        if(data.hasOwnProperty('courses')){
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

  //enroll into courses

  enrollInCourse(courseid, password, instanceid){
    
    return new Promise(resolve => {

      this.mAPI.enrollInCourse(courseid, password, instanceid).subscribe(data => {
        
        //the status is boolean
        //if password required then it is false if password is not given
        if(data.hasOwnProperty('status')){
          resolve(data);
        }else{
          resolve(false);
        }
      }, error =>{
        console.log("Error moodledata enrollInCourse");
        resolve(false);
      });

    });

  }
  
  getCourseEnrolmentMethods(courseId){
    
    return new Promise(resolve => {

      this.mAPI.getCourseEnrolmentMethods(courseId).subscribe(data => {
        if(this.isArray(data)){
          resolve(data);
        }else{
          console.log(data);
          resolve(false);
        }
      }, error =>{
        console.log("Error moodledata getCourseEnrolmentMethods");
        resolve(false);
      });

    });

  }

  
  //get enrolled course
  getEnrolledCoursesFromAPI(saveToDb?: boolean){

    return new Promise(resolve => {

      this.mAPI.getEnrolledCourses().subscribe((data: Array<ImEnrolledCourse>) => {

        if(data){
          
          //save data into database. overwrite = true
          if(saveToDb)
            this.mdb.saveListToDb(this.mdb.enrolledCourses,data, true);

          resolve(data);

        }else{
          resolve(false);
        }

      }, error => {
        console.log("error moodledata getEnrolledCoursesFromAPI");
        resolve(false);
      });
    });

  }

  getEnrolledCoursesFromDb(){

    return new Promise(resolve => {
      this.mdb.enrolledCourses.toCollection().toArray().then(data =>{

          if(data && data.length > 0){
              resolve(data);
          }else{
            resolve(false);
          }
      }).catch(reason => {
        console.log("Error moodledata getEnrolledCoursesFromDb");
        resolve(false);
      });
  });

  }


  //get course contents
  getCourseContentFromAPI(courseId){

    return new Promise(resolve => {
      this.mAPI.getCourseContent(courseId).subscribe((data: Array<ImCourseSectionContent>) => {

        if(data && data.length > 0){
          //Add courseId into the data
          //this inside foreach referes to tempThis          
          data.forEach((d) => {
            d.courseId = courseId;
          });
          //save data into database. overwrite = false
          this.mdb.saveListToDb(this.mdb.courseSectionContent,data);
          resolve(data);
        }else{
          resolve(false);
        }

      }, error => {
        console.log("Error moodledata getCourseContentFromAPI");     
        resolve(false);
      });
    });

  }

  getCourseContentFromDb(courseId){

    return new Promise(resolve => {
    this.mdb.courseSectionContent.where("courseId")
      .equals(courseId).toArray()
      .then(data =>{

      if(data && data.length == 0){

        resolve(false);
        //this.getCourseContentFromAPI(courseId);

      } else {

        data.sort((a,b) => {
          if(a.section < b.section) return -1;
          if(a.section > b.section) return 1;
          return 0;
        });

        //this.courseSections = data;
        resolve(data);

      }
    }).catch(reason => {
      console.log("Error moodledata getCourseContentFromDb");
      resolve(false);
    });

  });

  }

  isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
  }

}
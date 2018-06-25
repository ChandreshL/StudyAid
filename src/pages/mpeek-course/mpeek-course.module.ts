import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MpeekCoursePage } from './mpeek-course';

@NgModule({
  declarations: [
    MpeekCoursePage,
  ],
  imports: [
    IonicPageModule.forChild(MpeekCoursePage),
  ],
})
export class MpeekCoursePageModule {}

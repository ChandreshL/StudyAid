import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MdisplayCoursesPage } from './mdisplay-courses';

@NgModule({
  declarations: [
    MdisplayCoursesPage,
  ],
  imports: [
    IonicPageModule.forChild(MdisplayCoursesPage),
  ],
})
export class MdisplayCoursesPageModule {}

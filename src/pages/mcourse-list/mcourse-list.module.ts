import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { McourseListPage } from './mcourse-list';

@NgModule({
  declarations: [
    McourseListPage,
  ],
  imports: [
    IonicPageModule.forChild(McourseListPage),
  ],
})
export class McourseListPageModule {}

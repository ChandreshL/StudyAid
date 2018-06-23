import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MloginPage } from './mlogin';

@NgModule({
  declarations: [
    MloginPage,
  ],
  imports: [
    IonicPageModule.forChild(MloginPage),
  ],
})
export class MloginPageModule {}

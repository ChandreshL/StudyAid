import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MhomePage } from './mhome';

@NgModule({
  declarations: [
    MhomePage,
  ],
  imports: [
    IonicPageModule.forChild(MhomePage),
  ],
})
export class MhomePageModule {}

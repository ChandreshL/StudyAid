import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LhomePage } from './lhome';

@NgModule({
  declarations: [
    LhomePage,
  ],
  imports: [
    IonicPageModule.forChild(LhomePage),
  ],
})
export class LhomePageModule {}

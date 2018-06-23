import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MsearchPage } from './msearch';

@NgModule({
  declarations: [
    MsearchPage,
  ],
  imports: [
    IonicPageModule.forChild(MsearchPage),
  ],
})
export class MsearchPageModule {}

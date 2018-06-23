import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenrollPage } from './menroll';

@NgModule({
  declarations: [
    MenrollPage,
  ],
  imports: [
    IonicPageModule.forChild(MenrollPage),
  ],
})
export class MenrollPageModule {}

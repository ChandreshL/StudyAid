import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScalenderPage } from './scalender';

@NgModule({
  declarations: [
    ScalenderPage,
  ],
  imports: [
    IonicPageModule.forChild(ScalenderPage),
  ],
})
export class ScalenderPageModule {}

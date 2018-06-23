import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SlistPage } from './slist';

@NgModule({
  declarations: [
    SlistPage,
  ],
  imports: [
    IonicPageModule.forChild(SlistPage),
  ],
})
export class SlistPageModule {}

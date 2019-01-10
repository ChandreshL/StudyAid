import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MMessageTabsPage } from './m-message-tabs';

@NgModule({
  declarations: [
    MMessageTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(MMessageTabsPage),
  ]
})
export class MMessageTabsPageModule {}

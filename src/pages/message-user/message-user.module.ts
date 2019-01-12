import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageUserPage } from './message-user';

@NgModule({
  declarations: [
    MessageUserPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageUserPage),
  ],
})
export class MessageUserPageModule {}

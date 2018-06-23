import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShomePage } from './shome';

@NgModule({
  declarations: [
    ShomePage,
  ],
  imports: [
    IonicPageModule.forChild(ShomePage),
  ],
})
export class ShomePageModule {}

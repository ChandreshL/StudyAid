import { Component } from '@angular/core';
import {ViewController} from "ionic-angular";


@Component({
  template: `<ion-list><button ion-item (click)="close()">Logout</button></ion-list>`
})
export class MhomePopMenuComponent {

  constructor(public viewCtrl: ViewController) {
  }

  close() {
    this.viewCtrl.dismiss();
  }

}

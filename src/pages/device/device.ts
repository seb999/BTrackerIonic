import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, List } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-device',
  templateUrl: 'device.html'
})
export class DevicePage {
  deviceList :any;
  selectedDevice : any = {"deviceDescription" : ""};
  // userIdSession : string = "aed8e0fe-805c-4c85-8938-3f578f65bd74";  //replace this when you add loging page
  userIdSession : any;

  constructor(public navCtrl: NavController, public http: HttpClient, private storage: Storage) {
  }

  ionViewDidEnter() {
    this.storage.get('credentials').then((result) => {
      this.userIdSession = result;
      this.loadDeviceList();
    });
  }

  ionViewCanLeave(){
  }

  loadDeviceList(){
    let urlBase = !document.URL.startsWith('http') ? "http://dspx.eu/antea25" : "";
    let url =  "/api/MyDevice/AppGetDeviceList/" + this.userIdSession;
    this.http.get(url).subscribe(
      data => {
        this.deviceList = data;
      },
      err => { 
        console.log(err);
    });
  }

  showDevice(device){
    this.selectedDevice = device;
  }
}
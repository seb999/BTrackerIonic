import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';

@Component({
  selector: 'device-home',
  templateUrl: 'device.html'
})
export class DevicePage {
  deviceList :any;
  selectedDevice : any = {"deviceDescription" : ""};
  userIdSession : string = "770c413d-7ee0-4db9-a856-d73551e5db4c";  //replace this when you add loging page

  constructor(public navCtrl: NavController, public http: Http) {
    
  }

  ionViewDidEnter() {
    this.loadDeviceList();
  }

  ionViewCanLeave(){
    
  }

  loadDeviceList(){
    let urlBase = !document.URL.startsWith('http') ? "http://dspx.eu/antea25" : "";
    let url =  "/api/MyDevice/AppGetDeviceList/" + this.userIdSession;
    this.http.get(url).subscribe(data => {
      if(data.json().length > 0){
        this.deviceList = data.json();
        console.log( this.deviceList);
      }
    },err => {
    });
  }

  showDevice(device){
    this.selectedDevice = device;
  }
}
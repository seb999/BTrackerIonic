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
  userIdSession : string = "0bf2941e-633c-425f-9695-5792eb8e3efd";  //replace this when you add loging page

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
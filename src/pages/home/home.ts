import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import leaflet from 'leaflet';
import { Http } from '@angular/http';
import {antPath} from 'leaflet-ant-path';
import { Storage } from '@ionic/storage';
import { Observable } from "rxjs";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  isAlarmOn : boolean;
  deviceList : any;
  selectedDevice  :any;
  cursor : any = 1;
  path : any;
  marker : any;
  markerStart : any;
  lockMap : boolean = false;
  interval : any;
  subscription  :any;

  private alertClosed = true;
  private alert;

  userIdSession : string = "0bf2941e-633c-425f-9695-5792eb8e3efd";  //replace this when you add loging page

  constructor(public navCtrl: NavController, public http: Http, private localNotifications: LocalNotifications, public alertCtrl: AlertController, public storage: Storage ) {
    this.isAlarmOn = false;
  }

  ionViewDidEnter() {
    this.loadMap();
    this.loadDeviceList();
  }

  ionViewCanLeave(){
    document.getElementById("map").outerHTML = "";
  }

  loadDeviceList(){
    let urlBase = !document.URL.startsWith('http') ? "http://dspx.eu/antea25" : "";
    let url =  "/api/MyDevice/AppGetDeviceList/" + this.userIdSession;
    this.http.get(url).subscribe(data => {
      if(data.json().length > 0){
        this.deviceList = data.json();
        this.selectedDevice = this.deviceList[0];
        this.showLastPosition();
      }
    },err => {
    });
  }

  loadMap() {
    //Remove the map if we reload the page otherwise it crash the APP
    if(this.map) {
      this.map.remove();
    }

    this.map = leaflet.map("map").setView([51.505, -0.09], 13);
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'www.tphangout.com',
      maxZoom: 18
    }).addTo(this.map);
  }
  
  showLastPosition(){

    //Call to API is asynchronous, map is lock until response from API
    if(this.lockMap) return;
    this.lockMap = true;

    //remvove a path is already displayed on map
    if(this.path != undefined){
      this.path.remove();
    }

    if(this.marker != undefined){
      this.map.removeLayer(this.marker);
    }

    if(this.markerStart != undefined){
      this.map.removeLayer(this.markerStart);
    }
      

    //Load data from API
    let urlBase = !document.URL.startsWith('http') ? "http://dspx.eu/antea25" : "";
    let url =  "/api/Loc/AppGetGpsData/" + this.selectedDevice.deviceEUI + "/" + Math.round(this.cursor/5+1);
    this.http.get(url).subscribe(data => {
      if(data.json().length > 0){

        let gpsLastPostionList = data.json();
        let latlngs = [];
        gpsLastPostionList.forEach(element => {
          latlngs.push([element.gpsPositionLatitude, element.gpsPositionLongitude])
        });
    
        // Add path on the map
        this.path = antPath(latlngs, {color:"#0000FF", dashArray:[10,20], pulseColor:"#FFFFFF", delay:400, paused:false, reverse:true, weight:5},);
        this.path.addTo(this.map);

        // zoom the map to the polyline
        this.map.fitBounds(this.path.getBounds());

        //Add pointer on start end end
       this.marker = leaflet.marker([gpsLastPostionList[gpsLastPostionList.length-1].gpsPositionLatitude, gpsLastPostionList[gpsLastPostionList.length-1].gpsPositionLongitude]).bindPopup("<b>" + this.selectedDevice.deviceDescription + "</b><br>" + gpsLastPostionList[0].gpsPositionDate).openPopup();
       this.marker.addTo(this.map);

       this.markerStart = leaflet.marker([gpsLastPostionList[0].gpsPositionLatitude, gpsLastPostionList[0].gpsPositionLongitude]).bindPopup("<b>" + this.selectedDevice.deviceDescription + "</b><br>" + gpsLastPostionList[0].gpsPositionDate).openPopup();
       this.markerStart.addTo(this.map);

       this.lockMap = false;
      }
    },err => {
    });
  }

  alarmSwitcher(event){
    if(event.checked || event == null){
      this.saveInStorageAlarmStatus();
      this.interval = Observable.timer(300,15000);
      this.subscription = this.interval.subscribe(t=>{
        let urlBase = !document.URL.startsWith('http') ? "http://dspx.eu/antea25" : "";
        let url = urlBase + "/api/loc/getMotion/0004A30B00201302/" + this.getCurrentDate();
        this.http.get(url).subscribe(p => {
          
          //as it is asynchrone if user stop alarm
          if(event.checked){ 
              if(p.json() == true && this.alertClosed)
              {
                this.showAlert('Antea25 ALARM!', 'Something is happening!')
                this.showPushNotification();
              }
          }
        });
      });
    }
    //Unsubscribe timer
    if(!event.checked){
      this.subscription.unsubscribe();
      this.saveInStorageAlarmStatus();
    }
  }

  showPushNotification(){
    this.localNotifications.schedule({
      id: 1,
      title: 'Antea25 ALARM!',
      text: 'Something is happening!',
      data: { secret: 123 },
      //sound: this.isAndroid? 'file://sound.mp3': 'file://beep.caf',
    });
    this.localNotifications.isPresent(1);
  }

  showAlert(myTitle : string, mySubTitle : string ){
    this.alertClosed = false;  
    this.alert = this.alertCtrl.create({
      title: myTitle,
      subTitle: mySubTitle,
      buttons: [{text: 'OK', role: 'cancel',
        handler: () => {
          this.alertClosed = true;  
        }
      }]
    });
    this.alert.present(); 
  }

  getCurrentDate() : string{
    let currentDate = new Date();
    console.log(new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)));
    return new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().split('.')[0];
  }
  
  saveInStorageAlarmStatus() {
    this.storage.set('AlarmStatus', this.isAlarmOn);
  }
  
  readFromStorageAlarmStatus() {
    this.storage.get('AlarmStatus').then((value) => {
      value ? this.isAlarmOn = true : this.isAlarmOn = false
    }).catch(() => this.isAlarmOn = false);
  }

}
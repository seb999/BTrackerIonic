import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import leaflet from 'leaflet';
import { Http } from '@angular/http';
import {antPath} from 'leaflet-ant-path';
import { Observable } from "rxjs";
import { HelperService } from '../../service/helper.servcie';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  deviceList : any = [];
  deviceAlarmList : any = [];
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

  userIdSession : string = "770c413d-7ee0-4db9-a856-d73551e5db4c";  //replace this when you add loging page

  constructor(public navCtrl: NavController, 
    public http: Http, 
    private localNotifications: LocalNotifications, 
    public alertCtrl: AlertController, 
    private helperService: HelperService ) {
  }

  ionViewDidEnter() {
    //We read from storage (async)
    this.helperService.readFromStorageAlarmStatus().then((result) => {
      if(result != null) this.deviceAlarmList = result;
      this.loadMap();
      this.loadDeviceList();
    });
  }

  ionViewCanLeave(){
    document.getElementById("map").outerHTML = "";
  }

  loadDeviceList(){
    let urlBase = !document.URL.startsWith('http') ? "http://dspx.eu/antea25" : "";
    let url =  "/api/MyDevice/AppGetDeviceList/" + this.userIdSession;
    this.http.get(url).subscribe(data => {
      if(data.json().length > 0){

        data.json().forEach(element => {
          var deviceStatus = this.deviceAlarmList.filter(p=>p.deviceEUI == element.deviceEUI).map(p=>p.deviceStatus)[0];
          deviceStatus = deviceStatus == undefined ? false : deviceStatus;
          this.deviceList.push({"deviceDisplay" : false, 
          "deviceDescription" : element.deviceDescription , 
          "deviceEUI" : element.deviceEUI, 
          "deviceStatus" : deviceStatus})
        });

        //select default one
        this.selectedDevice = this.deviceList[0];
        this.showLastPosition(null, this.selectedDevice);

        //start timer
        if(this.subscription == undefined) this.startTimer();
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
  
  showLastPosition(event, device){
    this.selectedDevice = device;
    this.deviceList.forEach(p=>p.deviceDisplay = false);
    this.selectedDevice.deviceDisplay = true;
   
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
        console.log(data.json());
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
      }
      this.lockMap = false;
    },err => {
    });
  }

  saveAlarm(){
    this.helperService.saveInStorageAlarmStatus(this.deviceList);
  }
  
  startTimer(){
    this.interval = Observable.timer(300,10000);
    this.subscription = this.interval.subscribe(t=>{
      this.checkMotion();
    });
  }

  checkMotion(){
    this.deviceList.forEach(element => {
       if(element.deviceStatus){
          let urlBase = !document.URL.startsWith('http') ? "http://dspx.eu/antea25" : "";
          let url = urlBase + "/api/loc/getMotion/" + element.deviceEUI + "/" + this.helperService.getCurrentDate();
          this.http.get(url).subscribe(p => {
            //as it is asynchrone if user stop alarm
            if(element.deviceStatus){ 
              if(p.json() == true && this.alertClosed)
              {
                //for debugging(Push notification only available on device)
                this.showAlert('BTracker Alert!', 'Something is happening!'); 
                this.pushNotification();
              }
            }
          });
       } 
     });
  }

  pushNotification(){
    this.localNotifications.schedule({
      id: 1,
      title: 'BTracker Alert!',
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
}
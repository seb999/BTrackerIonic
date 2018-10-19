import { Injectable, } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, Platform } from 'ionic-angular';

@Injectable()
  
export class HelperService{
    isApp  :boolean;
    baseUrl  :string = "";

   // public result : any;
    constructor(private storage: Storage, public alertCtrl: AlertController, private platform : Platform){

    }

    //Return current date method
    getCurrentDate() : string{
        let currentDate = new Date();
        console.log(new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)));
        return new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().split('.')[0];
    }

    //Return URL from API method to access depend on running on device or runing on browser
    urlBuilder(path : string) : string {
      if(this.platform.is('core') || this.platform.is('mobileweb')) {
        this.isApp = false;
      } else {
        this.isApp = true;
      }

      if(this.isApp) {  this.baseUrl = "http://dspx.eu/antea25";}
      return this.baseUrl + path;
    }

    resetStorage(){
        this.storage.remove("AlarmStatus");
      }

      popup(myTitle : string, mySubTitle : string ){
        let alert = this.alertCtrl.create({
          title: myTitle,
          subTitle: mySubTitle,
          buttons: [{text: 'OK', role: 'cancel',
            handler: () => {
             // this.alertClosed = true;  
            }
          }]
        });
        
        alert.present(); 
      }
}
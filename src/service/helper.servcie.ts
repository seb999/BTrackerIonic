import { Injectable, } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

@Injectable()
  
export class HelperService{

   // public result : any;
    constructor(private storage: Storage, public alertCtrl: AlertController){

    }

    //Return current date method
    getCurrentDate() : string{
        let currentDate = new Date();
        console.log(new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)));
        return new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().split('.')[0];
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
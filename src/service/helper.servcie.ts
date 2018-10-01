import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
  
export class HelperService{

   // public result : any;
    constructor(private storage: Storage,){

    }

    //Return current date method
    getCurrentDate() : string{
        let currentDate = new Date();
        console.log(new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)));
        return new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().split('.')[0];
    }

    //save the alarm status in local storage
    saveInStorageAlarmStatus(status : any) {
        this.storage.set('AlarmStatus', status); 
    }
    
    //retrive alarm status from local storage
     readFromStorageAlarmStatus(){
        return this.storage.get('AlarmStatus');
    }

    resetStorage(){
        this.storage.remove("AlarmStatus");
      }
    

   
}
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HomePage } from '../../pages/home/home';
import { DevicePage } from '../../pages/device/device';
import { Storage } from '@ionic/storage';

interface LoginViewModel {
  email: string;
  password: string;
  rememberMe: boolean;
  result : string;
  userId : string;

}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  public registerCredentials : any = {};
  public loginFaill : boolean = false;
  public loginViewModel : LoginViewModel;

  constructor(public navCtrl: NavController, public http: HttpClient, private storage: Storage) {  
  }

  ionViewDidEnter() {   
  }

  ionViewCanLeave(){  
  }

  login(){
    
    let urlBase = !document.URL.startsWith('http') ? "http://dspx.eu/antea25" : "";
    let url =  "/api/AccountIonic/Login/";
    this.loginViewModel = {email : this.registerCredentials.email, password : this.registerCredentials.password, rememberMe : true, result:"", userId:""}
   
    this.http.post<LoginViewModel>(url, this.loginViewModel).subscribe(data => {
        console.log(data);
        if(data.result == "passed") {
            this.storeUserId();
            this.navCtrl.setRoot(DevicePage);
        }
        else{
            this.loginFaill = true;
        }
    },err => {
      console.log(err);
    });
  }

  storeUserId(){
    let urlBase = !document.URL.startsWith('http') ? "http://dspx.eu/antea25" : "";
    let url =  "/api/AccountIonic/GetUserId/" + this.registerCredentials.email;
    this.http.get<LoginViewModel>(url).subscribe(
      data => {
         this.storage.set('credentials',data.userId);
      },
      err => { 
        console.log(err);
    });
  }
}
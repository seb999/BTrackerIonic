import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { HomePage } from '../../pages/home/home';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
    public registerCredentials : any = {};
    public loginFaill : boolean = false;

  constructor(public navCtrl: NavController, public http: Http, private storage: Storage) {
    
  }

  ionViewDidEnter() {
      
  }

  ionViewCanLeave(){
    
  }

  login(){
    let urlBase = !document.URL.startsWith('http') ? "http://dspx.eu/antea25" : "";
    let url =  "/api/AccountIonic/Login/";
    let LoginViewModel = {"Email" : this.registerCredentials.email, "Password" : this.registerCredentials.password, "RememberMe" : true}
    this.http.post(url, LoginViewModel).subscribe(data => {
        if(data._body == "passed") {
            this.navCtrl.setRoot(HomePage);
        // this.storage.set('registerCredentials', )
        }
        else{
            this.loginFaill = true;
        }
    },err => {
    });
  }
}
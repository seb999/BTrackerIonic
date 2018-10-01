import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HomePage } from '../../pages/home/home';
import { Storage } from '@ionic/storage';

interface LoginViewModel {
  email: string;
  password: string;
  rememberMe: boolean;
  result : string;
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})



export class LoginPage {
    public registerCredentials : any = {};
    public loginFaill : boolean = false;



  constructor(public navCtrl: NavController, public http: HttpClient, private storage: Storage) {
    
  }

  ionViewDidEnter() {
      
  }

  ionViewCanLeave(){
    
  }

  login(){
    
    let urlBase = !document.URL.startsWith('http') ? "http://dspx.eu/antea25" : "";
    let url =  "/api/AccountIonic/Login/";
   let LoginViewModel = {"Email" : this.registerCredentials.email, "Password" : this.registerCredentials.password, "RememberMe" : true}
   
    this.http.post<LoginViewModel>(url, LoginViewModel).subscribe(data => {
        console.log(data);
        if(data.result == "passed") {
            this.navCtrl.setRoot(HomePage);
            //this.storage.set('registerCredentials', )
        }
        else{
            this.loginFaill = true;
        }
    },err => {
      console.log(err);
    });
  }
}
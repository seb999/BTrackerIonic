import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../../pages/home/home';
import { Storage } from '@ionic/storage';
import{ HelperService } from '../../service/helper.servcie';
import { Login } from '../../class/login.interface';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  public registerCredentials : any = {};
  public loginFaill : boolean = false;
  public noNetwork : boolean = false;
  public login : Login;
  public showSpinner : boolean;
  public isApp : boolean;

  constructor(public navCtrl: NavController, public http: HttpClient, private storage: Storage, private helperService: HelperService) {  
  }

  ionViewDidEnter() {   
  }

  ionViewCanLeave(){  
  }

  loginUser(){
    this.showSpinner = true;

    let url = this.helperService.urlBuilder("/api/AccountIonic/Login/");

    this.login = {email : this.registerCredentials.email, password : this.registerCredentials.password, rememberMe : true, result:"", userId:""}
    this.http.post<Login>(url, this.login).subscribe(data => {
        if(data.result == "passed") {
          this.showSpinner = false;
          this.storeUserId();
        }
        else{
          this.showSpinner = false;
          this.loginFaill = true;
        }
    },err => {
      console.log(err.message);
      this.noNetwork = true;
    });
  }

  storeUserId(){
    let url = this.helperService.urlBuilder("/api/AccountIonic/GetUserId/" + this.registerCredentials.email);

    this.http.get<Login>(url).subscribe(
      data => {
         this.storage.set('credentials',data.userId);
         this.navCtrl.setRoot(HomePage);
      },
      err => { 
        console.log(err);
    });
  }
}
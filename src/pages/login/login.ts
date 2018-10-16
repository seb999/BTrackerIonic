import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HomePage } from '../../pages/home/home';
import { Storage } from '@ionic/storage';
import{ HelperService } from '../../service/helper.servcie'
import { Platform } from 'ionic-angular';

interface LoginViewModel {
  email: string;
  password: string;
  rememberMe: boolean;
  result : string;
  userId : string;
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  
})

export class LoginPage {
  public registerCredentials : any = {};
  public loginFaill : boolean = false;
  public noNetwork : boolean = false;
  public loginViewModel : LoginViewModel;
  public showSpinner : boolean;
  public isApp : boolean;
  public baseUrl : string = "";

  constructor(public navCtrl: NavController, public http: HttpClient, 
    private storage: Storage, 
    private helperService: HelperService,
    private platform : Platform) {  
  
    if(this.platform.is('core') || this.platform.is('mobileweb')) {
      this.isApp = false;
    } else {
      this.isApp = true;
    }
  }

  ionViewDidEnter() {   
  }

  ionViewCanLeave(){  
  }

  login(){

    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      })
    };


    this.showSpinner = true;
    if(this.isApp) { this.baseUrl = "http://dspx.eu/antea25";}
    let url = this.baseUrl + "/api/AccountIonic/Login/";

    this.loginViewModel = {email : this.registerCredentials.email, password : this.registerCredentials.password, rememberMe : true, result:"", userId:""}
    this.http.post<LoginViewModel>(url, this.loginViewModel, httpOptions).subscribe(data => {
        if(data.result == "passed") {
          this.showSpinner = false;
          this.storeUserId();
          this.navCtrl.setRoot(HomePage);
        }
        else{
          this.showSpinner = false;
          this.loginFaill = true;
        }
    },err => {
      console.log(err);
      this.noNetwork = true;
    });
  }

  storeUserId(){
    if(this.isApp) { this.baseUrl = "http://dspx.eu/antea25";}
    let url = this.baseUrl + "/api/AccountIonic/GetUserId/" + this.registerCredentials.email;
    this.http.get<LoginViewModel>(url).subscribe(
      data => {
         this.storage.set('credentials',data.userId);
      },
      err => { 
        console.log(err);
    });
  }
}
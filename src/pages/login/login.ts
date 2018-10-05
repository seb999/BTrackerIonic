import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../../pages/home/home';
import { Storage } from '@ionic/storage';
import{ HelperService } from '../../service/helper.servcie'

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
  public noNetwork : boolean = false;
  public loginViewModel : LoginViewModel;
  public showSpinner : boolean;

  constructor(public navCtrl: NavController, public http: HttpClient, private storage: Storage, private helperService: HelperService) {  
  }

  ionViewDidEnter() {   
  }

  ionViewCanLeave(){  
  }

  login(){
    this.showSpinner = true;
    let urlBase = !document.URL.startsWith('http') ? "http://dspx.eu/antea25" : "";
    let url = urlBase + "/api/AccountIonic/Login/";
    this.helperService.popup("host URL", url);
    this.loginViewModel = {email : this.registerCredentials.email, password : this.registerCredentials.password, rememberMe : true, result:"", userId:""}
    this.http.post<LoginViewModel>(url, this.loginViewModel).subscribe(data => {
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
      console.log(err.message);
      this.noNetwork = true;
    });
  }

  storeUserId(){
    let urlBase = !document.URL.startsWith('http') ? "http://dspx.eu/antea25" : "";
    let url = urlBase + "/api/AccountIonic/GetUserId/" + this.registerCredentials.email;
    this.http.get<LoginViewModel>(url).subscribe(
      data => {
         this.storage.set('credentials',data.userId);
      },
      err => { 
        console.log(err);
    });
  }
}
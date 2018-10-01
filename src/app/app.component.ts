import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { DevicePage } from '../pages/device/device';
import { LoginPage } from '../pages/login/login';
import { HelperService } from '../service/helper.servcie';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = HomePage;
  rootPage: any = DevicePage;
  //rootPage: any = LoginPage;

  pages: Array<{title: string, component: any, icon: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private helperService: HelperService, private storage: Storage ) {
    this.initializeApp();
    this.helperService.resetStorage();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Position', component: HomePage, icon: "ios-compass" },
      { title: 'Devices', component: DevicePage, icon: "ios-settings" },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout(){
    this.storage.remove("registerCredentials");
    this.nav.setRoot(LoginPage);
  }
}

import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  networkListener: PluginListenerHandle;
  status: boolean;
  model = {};

  constructor(private ngZone: NgZone) {}

  async ngOnInit() {
    this.networkListener = await Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
      this.ngZone.run(() => {
        this.changeStatus(status);
      });
    });
    const status = await Network.getStatus();
    console.log('Network status:', status);
    this.changeStatus(status);
    console.log('Network status:', this.status);
  }

  changeStatus(status) {
    this.status = status?.connected;
    if(!this.status) {
      this.model = { 
        background: 'assets/imgs/12.png', 
        title: 'No Connection', 
        subtitle: 'Your internet connection was', 
        description: "interrupted, Please retry.", 
        titleColor: 'dark', 
        color: 'medium', 
        button: 'RETRY', 
        buttonColor: 'dark' 
      };
      this.ngOnDestroy();
    }
  }

  checkStatus(event) {
    this.ngOnInit();
  }

  ngOnDestroy(): void {
    if(this.networkListener) this.networkListener.remove();
  }

}

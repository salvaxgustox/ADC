import { Component } from '@angular/core';
import { DomController } from '@ionic/angular';
import { DataService, Message } from '../services/data.service';
import { ObjectResult } from '../objectResult';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private data: DataService) {}
  bomba: boolean = false;
  sensor: boolean = false;
  llave: boolean = false;
  resultP: string = "";
  url: string = "https://salvatst.azurewebsites.net/api/ADCII_sv_controller";


  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
      this.getMicrocontrollerStatus();
    }, 2000);
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }

  getMicrocontrollerStatus() {
    try {
      const status = fetch('https://salvatst.azurewebsites.net/api/ADCII_sv_controller', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }).then( response => response.json()).then(response => {
        /*if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }*/
        console.log(response);
        let jsonVal:ObjectResult = JSON.parse(response);
        console.log(jsonVal);
        console.log("Respuesta del get");
        return jsonVal;
      }).then(ORVal => {
        this.bomba = ORVal.b.valueOf();
        this.sensor = ORVal.s.valueOf();
        this.llave = ORVal.l.valueOf();
      })
  
      console.log('result is: ', JSON.stringify(status, null, 4));
    } catch (error) {
      if (error instanceof Error) {
        console.log('error message: ', error.message);
        return error.message;
      } else {
        console.log('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }

  setMicrocontrollerStatus() {
    try {
      const status = fetch(this.url + "?b=" + this.bomba + "&s=" + this.sensor + "&l=" + this.llave, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        // body: JSON.stringify({
        //   // variables: { name: name.toLowerCase() },
        // }),
      }).then(response => {
        /*if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }*/
        console.log(response);
        return response;
      })
    }catch (error) {
      if (error instanceof Error) {
        console.log('error message: ', error.message);
        return error.message;
      } else {
        console.log('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }

  onClickButton(event, _item){
    console.log('click ' + _item);
    switch(_item){
      case 'bomba':
        this.bomba = !this.bomba;
        break;
      case 'sensor':
        this.sensor = !this.sensor;
        break;
      case 'llave':
        this.llave = !this.llave;
      break;
    }
    console.log(this.bomba, this.sensor, this.llave);
    this.setMicrocontrollerStatus();
  }

  ngOnInit() {
    this.getMicrocontrollerStatus();
  }
}

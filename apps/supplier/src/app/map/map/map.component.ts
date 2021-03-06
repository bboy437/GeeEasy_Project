import { NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'project-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() data: any;
  @Input() let: string;
  @Input() long: string;

  title = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  placeService: any;
  public searchControl: FormControl;
  placeDetailsService: any;
  @ViewChild('search', { static: true }) searchElementRef: ElementRef;
  placeServiceIsReady: true;
  dataAddreess: any = [];

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private http: HttpClient
  ) {
   
  }

  ngOnInit() {
    this.setCurrentLocation();
    // this.map();
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        // this.getAddress(this.latitude, this.longitude);
        this.getGeocode(this.let, this.long);

      });
    }
  }

  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    // this.getAddress(this.latitude, this.longitude);
    this.getGeocode(this.latitude, this.longitude);
  }


  getGeocode(latitude, longitude) {
    this.http.get('https://maps.googleapis.com/maps/api/geocode/json' + '?latlng=' + latitude + ',' + longitude + '&key=AIzaSyB1OKRa5BEFf5rtLLwZ_pbtsfe5KJNIn5w' + "&language=th").subscribe(data => {
      const datalocationsfull: any = data;
      if (datalocationsfull.status === 'OK') {
        if (datalocationsfull.results[0]) {
          const values: any  = datalocationsfull.results[0].address_components
          this.zoom = 12;
          this.address = datalocationsfull.results[0].formatted_address;
          this.dataAddreess.address = datalocationsfull.results[0].formatted_address;

        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }


}
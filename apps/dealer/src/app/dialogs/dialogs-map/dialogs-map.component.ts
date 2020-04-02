
import { NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { FormControl } from '@angular/forms';



@Component({
  selector: 'project-dialogs-map',
  templateUrl: './dialogs-map.component.html',
  styleUrls: ['./dialogs-map.component.scss']
})
export class DialogsMapComponent implements OnInit {

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
    protected ref: NbDialogRef<DialogsMapComponent>,
    private http: HttpClient
  ) {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      this.placeService = new google.maps.places.AutocompleteService();

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        // types: ["address"]
      });

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();


          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          this.getGeocode(this.latitude, this.longitude);
        });

      });
    });
  }

  ngOnInit() {


  }



  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        // this.getAddress(this.latitude, this.longitude);
        this.getGeocode(this.latitude, this.longitude);

      });
    }
  }

  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    // this.getAddress(this.latitude, this.longitude);
    this.getGeocode(this.latitude, this.longitude);
  }


  onKey(event: any) { // without type info

  }



  getGeocode(latitude, longitude) {
    this.http.get('https://maps.googleapis.com/maps/api/geocode/json' + '?latlng=' + latitude + ',' + longitude + '&key=AIzaSyB1OKRa5BEFf5rtLLwZ_pbtsfe5KJNIn5w' + "&language=th").subscribe(data => {
      const datalocationsfull: any = data;
      if (datalocationsfull.status === 'OK') {
        if (datalocationsfull.results[0]) {
          const values: any  = datalocationsfull.results[0].address_components
          this.checkDataAddress(values)
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

  checkDataAddress(data: any) {
    const datalocation: any = [];

    //length 7 -------------------------------------
    if (data.length === 7) {
      console.log("length 7 ", data[0]);

      datalocation.num = data[0].long_name;

      //if ตำบล 
      if (data[2].long_name !== "") {
        const strCheckdata = data[2].long_name.split("ตำบล")
        if (strCheckdata[0] === "") {
          //ตำบล
          const strtown = strCheckdata[1].split(" ")
          if (strtown[0] === "") {
            datalocation.town = strtown[1];
          } else {
            datalocation.town = strtown[0];
          }
        } else {
          //แขวง
          const strCheckdata1 = data[2].long_name.split("แขวง")
          if (strCheckdata1[0] === "") {
            const strtown = strCheckdata1[1].split(" ")
            if (strtown[0] === "") {
              datalocation.town = strtown[1];
            } else {
              datalocation.town = strtown[0];
            }
          }
        }
      }
      //if อำเภอ
      if (data[3].long_name !== "") {
        const strCheckdata = data[3].long_name.split("อำเภอ")
        // อำเภอ
        if (strCheckdata[0] === "") {
          const strcity = strCheckdata[1].split(" ")
          if (strcity[0] === "") {
            datalocation.city = strcity[1];
          } else {
            datalocation.city = strcity[0];
          }
        } else {
          // เขต
          const strCheckdata1 = data[3].long_name.split("เขต")
          if (strCheckdata1[0] === "") {
            const strcity = strCheckdata1[1].split(" ")
            
            if (strcity[0] === "") {
              datalocation.city = "เขต" + strcity[1];
            } else {
              datalocation.city = "เขต" + strcity[0];
            }
          }
        }
      }
      datalocation.state = data[4].long_name;
      datalocation.zipcode = data[6].long_name;
    }

    //length 6 -------------------------------------
    else if (data.length === 6) {
      console.log("length 6 ", data[0]);
      datalocation.num = "";
      //if ตำบล 
      if (data[1].long_name !== "") {
        const strCheckdata = data[1].long_name.split("ตำบล")
        if (strCheckdata[0] === "") {
          //ตำบล
          const strtown = strCheckdata[1].split(" ")
          if (strtown[0] === "") {
            datalocation.town = strtown[1];
          } else {
            datalocation.town = strtown[0];
          }
        } else {
          //แขวง
          const strCheckdata1 = data[1].long_name.split("แขวง")
          if (strCheckdata1[0] === "") {
            const strtown = strCheckdata1[1].split(" ")
            if (strtown[0] === "") {
              datalocation.town = strtown[1];
            } else {
              datalocation.town = strtown[0];
            }
          }
        }
      }
      //if อำเภอ
      if (data[2].long_name !== "") {
        const strCheckdata = data[2].long_name.split("อำเภอ")
        // อำเภอ
        if (strCheckdata[0] === "") {
          const strcity = strCheckdata[1].split(" ")
          if (strcity[0] === "") {
            datalocation.city = strcity[1];
          } else {
            datalocation.city = strcity[0];
          }
        } else {
          // เขต
          const strCheckdata1 = data[2].long_name.split("เขต")
          if (strCheckdata1[0] === "") {
            const strcity = strCheckdata1[1].split(" ")
            if (strcity[0] === "") {
              datalocation.city = "เขต" + strcity[1];
            } else {
              datalocation.city = "เขต" + strcity[0];
            }
          }
        }
      }
      datalocation.state = data[3].long_name;
      datalocation.zipcode = data[5].long_name;
    }

    //length 5 -------------------------------------
    else if (data.length === 5) {
      console.log("length 5 ", data[0]);
      datalocation.num = "";
      //if ตำบล 
      if (data[0].long_name !== "") {
        const strCheckdata = data[0].long_name.split("ตำบล")
        if (strCheckdata[0] === "") {
          //ตำบล
          const strtown = strCheckdata[1].split(" ")
          if (strtown[0] === "") {
            datalocation.town = strtown[1];
          } else {
            datalocation.town = strtown[0];
          }
        } else {
          //แขวง
          const strCheckdata1 = data[0].long_name.split("แขวง")
          if (strCheckdata1[0] === "") {
            const strtown = strCheckdata1[1].split(" ")
            if (strtown[0] === "") {
              datalocation.town = strtown[1];
            } else {
              datalocation.town = strtown[0];
            }
          }
        }
      }
      //if อำเภอ
      if (data[1].long_name !== "") {
        const strCheckdata = data[1].long_name.split("อำเภอ")
        // อำเภอ
        if (strCheckdata[0] === "") {
          const strcity = strCheckdata[1].split(" ")
          if (strcity[0] === "") {
            datalocation.city = strcity[1];
          } else {
            datalocation.city = strcity[0];
          }
        } else {
          // เขต
          const strCheckdata1 = data[1].long_name.split("เขต")
          if (strCheckdata1[0] === "") {
            const strcity = strCheckdata1[1].split(" ")
            if (strcity[0] === "") {
              datalocation.city = "เขต" + strcity[1];
            } else {
              datalocation.city = "เขต" + strcity[0];
            }
          }
        }
      }
      datalocation.state = data[2].long_name;
      datalocation.zipcode = data[4].long_name;
    }

    //length 4 -------------------------------------
    else if (data.length === 4) {
      console.log("length 4 ", data[0]);
      //if ตำบล 
      if (data[0].long_name !== "") {
        const strCheckdata = data[0].long_name.split("ตำบล")
        if (strCheckdata[0] === "") {
          //ตำบล
          const strtown = strCheckdata[1].split(" ")
          if (strtown[0] === "") {
            datalocation.town = strtown[1];
          } else {
            datalocation.town = strtown[0];
          }
        } else {
          //แขวง
          const strCheckdata1 = data[0].long_name.split("แขวง")
          if (strCheckdata1[0] === "") {
            const strtown = strCheckdata1[1].split(" ")
            if (strtown[0] === "") {
              datalocation.town = strtown[1];
            } else {
              datalocation.town = strtown[0];
            }
          }
        }
      }
      //if อำเภอ
      if (data[1].long_name !== "") {
        const strCheckdata = data[1].long_name.split("อำเภอ")
        // อำเภอ
        if (strCheckdata[0] === "") {
          const strcity = strCheckdata[1].split(" ")
          if (strcity[0] === "") {
            datalocation.city = strcity[1];
          } else {
            datalocation.city = strcity[0];
          }
        } else {
          // เขต
          const strCheckdata1 = data[1].long_name.split("เขต")
          if (strCheckdata1[0] === "") {
            const strcity = strCheckdata1[1].split(" ")
            if (strcity[0] === "") {
              datalocation.city = "เขต" + strcity[1];
            } else {
              datalocation.city = "เขต" + strcity[0];
            }
          }
        }
      }
      datalocation.num = "";
      datalocation.state = data[2].long_name;
      datalocation.zipcode = "";
    }

    //length 3  -------------------------------------
    else if (data.length === 3) {
      datalocation.num = "";
      datalocation.town = "";
      datalocation.city = "";
      datalocation.state = data[0].long_name;
      datalocation.zipcode = data[2].long_name;;
    }

    this.dataAddreess.num = datalocation.num;
    this.dataAddreess.town = datalocation.town;
    this.dataAddreess.city = datalocation.city;
    this.dataAddreess.state = datalocation.state;
    this.dataAddreess.zipcode = datalocation.zipcode;
    this.dataAddreess.supplier_addr_location_lat = this.latitude;
    this.dataAddreess.supplier_addr_location_lng = this.longitude;

  }

  btnSaveClick() {
    this.ref.close(this.dataAddreess);
  }


  btnCancelClick(): void {
    this.ref.close();
  }


}
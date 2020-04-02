import { Component, OnInit, ViewChild, ElementRef, NgZone, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent, AgmMarker } from '@agm/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SupplierAPIService, BrowseSupplierAPIService, LocationAPIService } from '@project/services';
import { Router } from '@angular/router';

@Component({
  selector: 'project-maps',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  title = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  placeService: any;
  public searchControl: FormControl;
  placeDetailsService: any;
  @ViewChild('search', { static: true }) searchElementRef;
  placeServiceIsReady: true;
  dataAddreess: any = [];
  arrDistributor: any = [];
  private UrlRouter_Browse_Detail = "distributors/browse-distributor/detail";
  loading = false;
  loading1 = false;
  strsupCate = '';
  arrCategory: any = [];
  arrCategoryList: any = [];
  filter: any = [];
  Form: FormGroup;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private http: HttpClient,
    private browseSupplierAPIService: BrowseSupplierAPIService,
    private router: Router,
    private locationAPIService: LocationAPIService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      strMap: [],
    });
    this.loading1 = true;
    this.getSupList();
  }

  

  getSupList() {
    this.locationAPIService.getdDistLocation("0").subscribe(data => {
      this.arrDistributor = data.response_data;
      this.arrDistributor.forEach(element => {
        element.image_url = {
          url: 'assets/images/img_cate.png',
          scaledSize: {
            width: 40,
            height: 40
          }
        }
      });
      this.maps();
      console.log(this.arrDistributor);

    })
  }

  categoryEvent(data) {
    console.log('data', data);
    console.log('product_category__id', data.product_category__id);
    this.loading1 = true;
    if (data.product_category__id !== 0) {
      this.locationAPIService.getdDistLocation(data.product_category__id).subscribe(res => {
        this.arrDistributor = res.response_data;
        this.arrDistributor.forEach(element => {
          element.image_url = {
            url: element.distributor_image_url,
            scaledSize: {
              width: 40,
              height: 40
            }
          }
        });
        console.log('location',this.arrDistributor);
        this.loading1 = false;
      })

    } else {
      this.getSupList();
    }

  }



  maps() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      this.placeService = new google.maps.places.AutocompleteService();
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        // types: ["address"]
      });
      console.log('this.searchElementRef.nativeElement', this.searchElementRef.nativeElement);
      console.log('autocomplete', autocomplete);
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
  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
        // this.getAddress(this.latitude, this.longitude);
        this.getGeocode(this.latitude, this.longitude);

      });
    }
  }

  markerDragEnd($event: MouseEvent) {
    console.log('event', $event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    // this.getAddress(this.latitude, this.longitude);
    this.getGeocode(this.latitude, this.longitude);
  }

  btnRowMab(row: EventEmitter<AgmMarker>) {
    console.log('row', row);
    this.router.navigate([this.UrlRouter_Browse_Detail, row, "map"], { queryParams: { filterBy: this.Form.value.strMap } });
  }

  btnRefresh() {
    this.Form.get('strMap').patchValue('');
    this.maps();
  }

  getGeocode(latitude, longitude) {
    const value = 'latlng=' + latitude + ',' + longitude + '&key=' + 'AIzaSyB1OKRa5BEFf5rtLLwZ_pbtsfe5KJNIn5w' + "&language=" + 'th';
    this.http.get('https://maps.googleapis.com/maps/api/geocode/json?' + value).subscribe(data => {
      const datalocationsfull: any = data;
      console.log('datalocationsfull', datalocationsfull);

      if (datalocationsfull.status === 'OK') {
        if (datalocationsfull.results[0]) {
          const values: any = datalocationsfull.results[0].address_components
          this.zoom = 15;
          this.address = datalocationsfull.results[0].formatted_address;
          this.dataAddreess.address = datalocationsfull.results[0].formatted_address;

        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
      this.loading1 = false;
    });
  }

}

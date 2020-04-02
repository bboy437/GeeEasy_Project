import { Component, OnInit, ViewChild, ElementRef, NgZone, EventEmitter } from '@angular/core';
import { MapsAPILoader, MouseEvent, AgmMarker } from '@agm/core';
import { FormControl } from '@angular/forms';
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
  @ViewChild('search', { static: true }) searchElementRef: ElementRef;
  placeServiceIsReady: true;
  dataAddreess: any = [];
  arrMySupplier: any = [];
  private UrlRouter_Browse_Detail = "suppliers/browse-suppliers/detail";
  strMap: string;
  loading = false;
  loading1 = false;
  strsupCate = '';
  arrCategory: any = [];
  arrCategoryList: any = [];
  filter: any = [];
  strCategoryName: string;
  id: string;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private http: HttpClient,
    private browseSupplierAPIService: BrowseSupplierAPIService,
    private router: Router,
    private locationAPIService: LocationAPIService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getSupList();
    this.getCategory();
  }

  getSupList() {

    this.loading1 = true;
    this.locationAPIService.getdSupLocation("0").subscribe(data => {
      this.arrMySupplier = data.response_data;
      this.arrMySupplier.forEach(element => {
        element.image_url = {
          url: 'assets/images/img_cate.png',
          scaledSize: {
            width: 40,
            height: 40
          }
        }
      });
      this.maps();
      console.log(this.arrMySupplier);

    })
  }


  categoryEvent(data) {
    console.log('data', data);
    console.log('product_category__id', data.product_category__id);
    this.loading1 = true;
    if (data.product_category__id !== 0) {
      this.locationAPIService.getdSupLocation(data.product_category__id).subscribe(res => {
        this.arrMySupplier = res.response_data;
        this.arrMySupplier.forEach(element => {
          element.image_url = {
            url: element.supplier_image_url,
            scaledSize: {
              width: 40,
              height: 40
            }
          }
        });
        console.log('location', this.arrMySupplier);
        this.loading1 = false;
      })

    } else {
      this.getSupList();
    }

  }

  getCategory() {
    this.strsupCate = '';
    this.id = "";
    const valueCategory = 'cur_page=' + 1 + '&per_page=' + 10
    this.browseSupplierAPIService.getCategory(valueCategory).subscribe(data => {
      this.arrCategory = data.response_data;
      this.filter = data.response_data;
      console.log(this.arrCategory);
      this.loading = false;
    })
  }

  subCate(product_category_child_array, product_category_id, product_category_name) {
    this.loading1 = true;
    this.strsupCate = product_category_name;
    this.id = product_category_id;
    this.locationAPIService.getdSupLocation(product_category_id).subscribe(res => {
      this.arrMySupplier = res.response_data;
      this.arrMySupplier.forEach(element => {
        element.image_url = {
          url: element.supplier_image_url,
          scaledSize: {
            width: 40,
            height: 40
          }
        }
      });
      console.log('location', this.arrMySupplier);
      this.loading1 = false;
    })

    if (product_category_child_array.length > 0) {
      const valueCategory = 'cur_page=' + 1 + '&per_page=' + 10 + '&product_category_id=' + product_category_id
      this.browseSupplierAPIService.getCategory(valueCategory).subscribe(data => {
        this.arrCategory = data.response_data;
        this.filter = data.response_data;
        this.loading1 = false;
        console.log('subcate', this.arrCategory);
      })
    }
  }

  btnReload() {
    this.arrCategory = [];
    this.strCategoryName = "";
    this.strMap = "";
    this.id = "";
    this.loading = true;
    this.getCategory();
    this.getSupList();
  }


  filterCategoryName(value: any) {
    this.arrCategory = this.filter.filter(option =>
      option.product_category_name.toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10);
    return this.arrCategory.filter(option =>
      option.product_category_name.toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10);

  }

  refreshCate() {
    this.strCategoryName = "";
    this.filterCategoryName("");
    // this.getSupList();
    // this.getCategory();
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
    console.log(this.strMap);
    console.log('row', row);
    this.router.navigate([this.UrlRouter_Browse_Detail, row, "map"], { queryParams: { filterBy: this.strMap } });
  }

  btnRefreshMap() {
    this.strMap = '';
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

import { Component, ElementRef, NgModule, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, FormGroup } from "@angular/forms";
import { Location } from '../_models/index';
import { LocationService, AlertService } from '../_services/index';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    moduleId: module.id,
    styles: [`
    agm-map {
       height: 500px;
     }
  `],
    templateUrl: 'agm.component.html'
})

export class AGMComponent implements OnInit {
    model: Location;
    public latitude: number;
    public longitude: number;
    public searchControl: FormControl;
    public zoom: number;
    currentUser: any;
    locationList: any = [];
    public searchElementRef: ElementRef;

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private locationService: LocationService,
        private alertService: AlertService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    ngOnInit() {
        //set google maps defaults
        this.zoom = 4;
        this.latitude = 39.8282;
        this.longitude = -98.5795;
        //create search FormControl
        this.searchControl = new FormControl();

        //set current position
        this.getLocationList();
        this.setCurrentPosition();
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(
                <HTMLInputElement>document.getElementById("address"), {
                    types: ['address']
                });
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.zoom = 12;
                    var payload = {
                        username: this.currentUser.username,
                        lat: this.latitude,
                        long: this.longitude,
                        location: place.formatted_address
                    }
                    this.locationService.create(payload).subscribe(data => {
                        if (data)
                            this.alertService.success('Location Saved' + data, true);
                        this.getLocationList();
                    }, error => {
                        this.alertService.error(error);
                        //this.loading = false;
                    })

                });
            });
        });

    }
    private setCurrentPosition() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 12;
                var payload = {
                    username: this.currentUser.username,
                    lat: this.latitude,
                    long: this.longitude,
                    location: this.latitude + "_" + this.longitude
                }
                this.locationService.create(payload).subscribe(data => {
                    if (data)
                        this.alertService.success('Location Saved' + data, true);
                    this.getLocationList();
                }, error => {
                    this.alertService.error(error);
                    //this.loading = false;
                })

            });
        }
    }
    private getLocationList() {
        this.locationService.getAllByUsername(this.currentUser.username).subscribe(data => {
            if (data)
                this.locationList = data;
            else
                this.locationList = [];
        })
    }
}
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var index_1 = require("../_services/index");
var core_2 = require("@agm/core");
var AGMComponent = /** @class */ (function () {
    function AGMComponent(mapsAPILoader, ngZone, locationService, alertService) {
        this.mapsAPILoader = mapsAPILoader;
        this.ngZone = ngZone;
        this.locationService = locationService;
        this.alertService = alertService;
        this.locationList = [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    AGMComponent.prototype.ngOnInit = function () {
        var _this = this;
        //set google maps defaults
        this.zoom = 4;
        this.latitude = 39.8282;
        this.longitude = -98.5795;
        //create search FormControl
        this.searchControl = new forms_1.FormControl();
        //set current position
        this.getLocationList();
        this.setCurrentPosition();
        this.mapsAPILoader.load().then(function () {
            var autocomplete = new google.maps.places.Autocomplete(document.getElementById("address"), {
                types: ['address']
            });
            autocomplete.addListener('place_changed', function () {
                _this.ngZone.run(function () {
                    var place = autocomplete.getPlace();
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    _this.latitude = place.geometry.location.lat();
                    _this.longitude = place.geometry.location.lng();
                    _this.zoom = 12;
                    var payload = {
                        username: _this.currentUser.username,
                        lat: _this.latitude,
                        long: _this.longitude,
                        location: place.formatted_address
                    };
                    _this.locationService.create(payload).subscribe(function (data) {
                        if (data)
                            _this.alertService.success('Location Saved' + data, true);
                        _this.getLocationList();
                    }, function (error) {
                        _this.alertService.error(error);
                        //this.loading = false;
                    });
                });
            });
        });
    };
    AGMComponent.prototype.setCurrentPosition = function () {
        var _this = this;
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                _this.latitude = position.coords.latitude;
                _this.longitude = position.coords.longitude;
                _this.zoom = 12;
                var payload = {
                    username: _this.currentUser.username,
                    lat: _this.latitude,
                    long: _this.longitude,
                    location: _this.latitude + "_" + _this.longitude
                };
                _this.locationService.create(payload).subscribe(function (data) {
                    if (data)
                        _this.alertService.success('Location Saved' + data, true);
                    _this.getLocationList();
                }, function (error) {
                    _this.alertService.error(error);
                    //this.loading = false;
                });
            });
        }
    };
    AGMComponent.prototype.getLocationList = function () {
        var _this = this;
        this.locationService.getAllByUsername(this.currentUser.username).subscribe(function (data) {
            if (data)
                _this.locationList = data;
            else
                _this.locationList = [];
        });
    };
    AGMComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            styles: ["\n    agm-map {\n       height: 500px;\n     }\n  "],
            templateUrl: 'agm.component.html'
        }),
        __metadata("design:paramtypes", [core_2.MapsAPILoader,
            core_1.NgZone,
            index_1.LocationService,
            index_1.AlertService])
    ], AGMComponent);
    return AGMComponent;
}());
exports.AGMComponent = AGMComponent;
//# sourceMappingURL=agm.component.js.map
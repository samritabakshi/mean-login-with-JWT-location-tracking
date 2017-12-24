import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Location } from '../_models/index';

@Injectable()
export class LocationService {
    constructor(private http: Http) { }

    getAllByUsername(_username: string) {
        return this.http.get('/location/username/' + _username).map((response: Response) => response.json());
    }
    getAll(_username: string) {
        return this.http.get('/location').map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get('/location/' + _id).map((response: Response) => response.json());
    }

    create(_location: any) {
        return this.http.post('/location', _location);
    }

    delete(_id: string) {
        return this.http.delete('/location/' + _id);
    }
}
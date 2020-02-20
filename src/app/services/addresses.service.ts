import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Address {
    strasse: string,
    plz: string,
    ort: string,
    nr: string,
    addresszusatz: string,
    land: string
}

const addresses: Address[] = [
    {
        strasse: 'Bahnhofstrasse',
        plz: '6004',
        ort: 'Luzern',
        nr: '12',
        addresszusatz: '',
        land: 'Schweiz'
    },
    {
        strasse: 'Zürichstrasse',
        plz: '2000',
        ort: 'Zürich',
        nr: '1',
        addresszusatz: '',
        land: 'Schweiz'
    },
    {
        strasse: 'Seestrasse',
        plz: '4800',
        ort: 'Ebikon',
        nr: '23',
        addresszusatz: '',
        land: 'Schweiz'
    },
    {
        strasse: 'Bahnhofstrasse',
        plz: '6003',
        ort: 'Kriens',
        nr: '234',
        addresszusatz: '',
        land: 'Schweiz'
    },
    {
        strasse: 'Bahnhofstrasse',
        plz: '6001',
        ort: 'Horw',
        nr: '123',
        addresszusatz: '12',
        land: 'Schweiz'
    },
    {
        strasse: 'Bahnhofstrasse',
        plz: '4805',
        ort: 'Ebikon',
        nr: '232',
        addresszusatz: '23',
        land: 'Schweiz'
    },
    {
        strasse: 'Blumenfeld',
        plz: '6003',
        ort: 'Kriens',
        nr: '234',
        addresszusatz: '',
        land: 'Schweiz'
    },
    {
        strasse: 'Seefeld',
        plz: '6001',
        ort: 'Horw',
        nr: '123',
        addresszusatz: '12',
        land: 'Schweiz'
    },
    {
        strasse: 'SchöneStrasse',
        plz: '4805',
        ort: 'Ebikon',
        nr: '232',
        addresszusatz: '23',
        land: 'Schweiz'
    }
];

@Injectable({
    providedIn: 'root'
})
export class AddressesService {

    constructor() {
    }

    getAddresses(query: string): Observable<Address[]> {
        return of(this.filter(query));
    }

    getOrt(query: string, strasse: string): Observable<string[]> {
        return of(this.filterOrt(query, strasse));
    }

    getStrasse(query: string, ort: string): Observable<string[]> {
        return of(this.filterStrasse(query, ort));
    }

    private filter(query: string): Address[] {
        const list = addresses.filter((address: Address) =>
            this.includes(address.ort, query) ||
            this.includes(address.strasse, query) ||
            this.includes(address.plz, query)
        );
      const set = new Set<Address>(list);
      return [...set];
    }

    private filterStrasse(query: string, ort = ''):string[] {
        let list = [];
        if (ort) {
            list = addresses.filter((address: Address) => address.ort === ort);
        }
        list = addresses
            .filter((address: Address) => this.includes(address.strasse, query))
            .map((address: Address) => address.strasse);
        const set = new Set<string>(list);
        return [...set];
    }

    private filterOrt(query: string, strasse = ''): string [] {
        let list = [];
        if (strasse) {
            list = addresses.filter((address: Address) => address.strasse === strasse);
        }
        list = addresses
            .filter((address: Address) => this.includes(address.ort, query))
            .map((address) => address.ort);
        const set = new Set<string>(list);
        return [...set];
    }

    private includes(value: string, query: string){
      value = value.trim().toLowerCase();
      query = query.trim().toLowerCase();
      return value.includes(query);
    }

}

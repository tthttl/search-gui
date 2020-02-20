import { Component, OnInit } from '@angular/core';
import { Address } from '../services/addresses.service';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { AddressesService } from '../services/addresses.service';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

    model: string;
    searching = false;
    searchFailed = false;
    filteredAddresses: Address[] = [];

    strasse: string;
    plz: string;
    ort: string;
    nr: string;
    addresszusatz: string;
    land: string;

    availableCountries: string [] = ['Schweiz', 'Deutschland', 'Frankreich', 'Lichtenstein', 'Italien'];

    constructor(private addressService: AddressesService) {
    }

    ngOnInit(): void {
        this.land = this.availableCountries[0];
    }

    search = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.searching = true),
            switchMap(term =>
                this.addressService.getAddresses(term).pipe(
                    tap((addresses: Address[]) => {
                        this.searchFailed = false;
                        this.filteredAddresses = addresses;
                    }),
                    map((addresses: Address[]) => addresses.map(address => address.ort + " " + address.strasse + " " + address.nr)),
                    catchError(() => {
                        this.searchFailed = true;
                        return of([]);
                    }))
            ),
            tap(() => this.searching = false)
        );

    fillTemplate() {
        const selectedAddress = this.filteredAddresses.find(address => this.model.includes(address.strasse));
        if(selectedAddress){
            this.strasse = selectedAddress.strasse;
            this.plz = selectedAddress.plz;
            this.ort = selectedAddress.ort;
            this.nr = selectedAddress.nr;
            this.addresszusatz = selectedAddress.addresszusatz;
            this.land = selectedAddress.land;
        }
    }

}

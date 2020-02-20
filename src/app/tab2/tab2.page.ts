import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { Address, AddressesService } from '../services/addresses.service';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {


    searching = false;
    searchFailed = false;
    filteredAddresses: Address[] = [];

    ort: string;
    strasse: string;
    plz: string;
    nr: string;
    addresszusatz: string;
    land: string;
    availableCountries: string [] = ['Schweiz', 'Deutschland', 'Frankreich', 'Lichtenstein', 'Italien'];

    constructor(private addressService: AddressesService) {
    }

    ngOnInit(): void {
        this.addressService.getAddresses('').subscribe((addresses) => this.filteredAddresses = addresses);
        this.land = this.availableCountries[0];
    }


    searchOrt = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.searching = true),
            switchMap(term =>
                this.addressService.getOrt(term, this.strasse).pipe(
                    tap((addresses: string[]) => {
                        this.searchFailed = false;
                    }),
                    catchError(() => {
                        this.searchFailed = true;
                        return of([]);
                    }))
            ),
            tap(() => this.searching = false)
        );

    searchStrasse = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.searching = true),
            switchMap(term =>
                this.addressService.getStrasse(term, this.ort).pipe(
                    tap((addresses: string[]) => {
                        this.searchFailed = false;
                    }),
                    catchError(() => {
                        this.searchFailed = true;
                        return of([]);
                    }))
            ),
            tap(() => this.searching = false)
        );

    tryFillTemplate() {
        let selectedAddress;
        if (this.ort && this.strasse) {
            selectedAddress = this.filteredAddresses.find(address => {
                return address.ort === this.ort && address.strasse === this.strasse;
            });
            if (selectedAddress) {
                this.plz = selectedAddress.plz;
                this.land = selectedAddress.land;
            }
        }
    }

    clear(){
        this.strasse = '';
        this.plz = '';
        this.ort = '';
        this.nr = '';
        this.addresszusatz = '';
        this.land = this.availableCountries[0];
    }

}

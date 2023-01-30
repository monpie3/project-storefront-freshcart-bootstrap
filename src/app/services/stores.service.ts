import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { StoreModel } from "@app/models/store.model";

@Injectable({ providedIn: "root" })
export class StoresService {
	constructor(private _httpClient: HttpClient) {}

	getAll(): Observable<StoreModel[]> {
		return this._httpClient.get<StoreModel[]>(
			"https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-stores"
		);
	}

	getOne(storeId: string): Observable<StoreModel> {
		return this._httpClient.get<StoreModel>(
			`https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-stores/${storeId}`
		);
	}
}

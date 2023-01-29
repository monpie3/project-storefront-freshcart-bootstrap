import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
} from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { CategoryModel } from "../../models/category.model";
import { StoreModel } from "../../models/store.model";
import { CategoriesService } from "../../services/categories.service";
import { StoresService } from "../../services/stores.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
	readonly categories$: Observable<CategoryModel[]> =
		this._categoriesService.getAll().pipe(
      shareReplay(1)
    );
	readonly stores$: Observable<StoreModel[]> = this._storesService.getAll();

	constructor(
		private _categoriesService: CategoriesService,
		private _storesService: StoresService
	) {}
}

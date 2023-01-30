import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, combineLatest } from "rxjs";
import { map, shareReplay, switchMap } from "rxjs/operators";
import { StoreModel } from "../../models/store.model";
import { ProductWithCategoryQueryModel } from "../../query-models/product-with-category.query-model";
import { ProductModel } from "../../models/product.model";
import { CategoryModel } from "../../models/category.model";
import { StoresService } from "../../services/stores.service";
import { ProductsService } from "../../services/products.service";

@Component({
	selector: "app-store-products",
	templateUrl: "./store-products.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreProductsComponent {
	readonly store: Observable<StoreModel> = this._activatedRoute.params.pipe(
		switchMap((data) => this._storesService.getOne(data["storeId"]))
	).pipe(shareReplay(1));

	readonly productsByStore$: Observable<
		ProductModel[]
	> = combineLatest([this._productsService.getAll(), this.store]).pipe(
		map(([products, store]: [ProductModel[], StoreModel]) => {
			return products.filter((product) => product.storeIds.includes(store.id));
		})
	);

	constructor(
		private _storesService: StoresService,
		private _activatedRoute: ActivatedRoute,
		private _productsService: ProductsService
	) {}
}

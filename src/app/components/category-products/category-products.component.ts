import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Observable, combineLatest, shareReplay } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { CategoryModel } from "@app/models/category.model";
import { ProductModel } from "@app/models/product.model";
import { ProductsService } from "@app/services/products.service";
import { CategoriesService } from "@app/services/categories.service";

@Component({
	selector: "app-category-products",
	templateUrl: "./category-products.component.html",
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryProductsComponent {
	readonly categories$: Observable<CategoryModel[]> = this._categoriesService
		.getAll()
		.pipe(shareReplay(1));

	readonly category: Observable<CategoryModel> = this._activatedRoute.params
		.pipe(
			switchMap((data) =>
				this._categoriesService.getOne(data["categoryId"])
			)
		)
		.pipe(shareReplay(1));

	private _sortBySubject: BehaviorSubject<string> =
		new BehaviorSubject<string>("Featured");
	public sortBy$: Observable<string> = this._sortBySubject.asObservable();

	productsByCategory$: Observable<ProductModel[]> = combineLatest([
		this._productsService.getAll(),
		this.category,
		this.sortBy$,
	]).pipe(
		map(
			([products, category, sortBy]: [
				ProductModel[],
				CategoryModel,
				string
			]) => {
				const filteredProducts = products.filter(
					(product) => product.categoryId === category.id
				);

				if (sortBy === "Low to High") {
					return this.sortByPrice(filteredProducts, "price", "asc");
				}

				else if (sortBy === "High to Low") {
					return this.sortByPrice(filteredProducts, "price", "desc");
				}

        else if (sortBy === "Avg. Rating") {
					return this.sortByPrice(filteredProducts, "ratingValue", "desc");
				}

        
        else if (sortBy === "Featured") {
					return this.sortByPrice(filteredProducts, "featureValue", "desc");
				}

				return filteredProducts
			}
		)
	);

	constructor(
		private _productsService: ProductsService,
		private _categoriesService: CategoriesService,
		private _activatedRoute: ActivatedRoute
	) {}

	sort(event: any): void {
		this._sortBySubject.next(event.value);
	}

	sortByPrice(
		products: ProductModel[],
		key: string,
		direction: string
	): ProductModel[] {
		return products.sort((a, b) => {
			if (a[key as keyof ProductModel] > b[key as keyof ProductModel])
				return direction === "asc" ? 1 : -1;
			if (a[key as keyof ProductModel] < b[key as keyof ProductModel])
				return direction === "asc" ? -1 : 1;
			return 0;
		});
	}
}

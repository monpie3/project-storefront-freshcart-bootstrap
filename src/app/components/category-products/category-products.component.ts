import {
	ChangeDetectionStrategy,
	Component,
	ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import {
	BehaviorSubject,
	Observable,
	combineLatest,
	of,
	shareReplay,
} from "rxjs";
import { filter, map, switchMap, tap } from "rxjs/operators";
import { CategoryModel } from "../../models/category.model";
import { ProductModel } from "../../models/product.model";
import { ProductsService } from "../../services/products.service";
import { CategoriesService } from "../../services/categories.service";

interface pageParams {
	pageSize: number;
	pageNumber: number;
}

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

	constructor(
		private _productsService: ProductsService,
		private _categoriesService: CategoriesService,
		private _activatedRoute: ActivatedRoute,
		private _router: Router
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

	readonly pageForm: FormGroup = new FormGroup({
		pageSize: new FormControl(5),
		pageNumber: new FormControl(1),
	});

	readonly pageData$: Observable<pageParams> =
		this._activatedRoute.queryParams.pipe(
			map((params) => ({
				pageSize: params["pageSize"]
					? Math.max(1, +params["pageSize"])
					: 5,
				pageNumber: params["pageNumber"]
					? Math.max(1, +params["pageNumber"])
					: 1,
			})),
			tap((params) =>
				this.pageForm.patchValue({
					pageSize: params.pageSize,
					pageNumber: params.pageNumber,
				})
			),
			shareReplay(1)
		);

	readonly productsByCategory$: Observable<ProductModel[]> = combineLatest([
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
					return this.sortByPrice(
						filteredProducts,
						"ratingValue",
						"desc"
					);
				} 
        
        else if (sortBy === "Featured") {
					return this.sortByPrice(
						filteredProducts,
						"featureValue",
						"desc"
					);
				}

				return filteredProducts;
			}
		),
		shareReplay(1)
	);

	readonly pageSizeOptions$: Observable<number[]> = of([5, 10, 15]);

	readonly pageNumberOptions$: Observable<number[]> = combineLatest([
		this.productsByCategory$,
		this.pageData$,
	]).pipe(
		map(([productsByCategory, pageData]: [ProductModel[], pageParams]) => {
			return Array(
				Math.ceil(productsByCategory.length / pageData.pageSize)
			)
				.fill(1)
				.map((x, y) => x + y);
		})
	);

	readonly currentPageData = this.pageForm.valueChanges
		.pipe(
			tap((form) => {
				return this._router.navigate([], {
					queryParams: {
						pageSize: form.pageSize,
						pageNumber: form.pageNumber,
					},
				});
			})
		)
		.subscribe();

	readonly paginatedProducts$: Observable<ProductModel[]> = combineLatest([
		this.productsByCategory$,
		this.pageData$,
	]).pipe(
		map(([products, pageData]: [ProductModel[], pageParams]) => {
			return products.slice(
				(pageData.pageNumber - 1) * pageData.pageSize,
				pageData.pageNumber * pageData.pageSize
			);
		})
	);

  readonly currentPageDataLimitPageNum = combineLatest(
    [this.pageNumberOptions$,
    this.pageData$]
  )
  .pipe(
    tap(([pageNumberOptions, form]) => {

      return this._router.navigate([], {
        queryParams: {
          pageSize: form.pageSize,
          pageNumber: Math.min(form.pageNumber, pageNumberOptions.length)
        },
      });
    })
  )
  .subscribe();
  
}

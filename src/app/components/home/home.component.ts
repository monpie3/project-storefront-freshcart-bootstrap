import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { CategoryModel } from '@app/models/category.model';
import { StoreModel } from '@app/models/store.model';
import { StoreTagModel } from '@app/models/store-tag.model';
import { ProductModel } from '@app/models/product.model';
import { CategoriesService } from '@app/services/categories.service';
import { StoresService } from '@app/services/stores.service';
import { StoreTagsService } from '@app/services/store-tags.service';
import { ProductsService } from '@app/services/products.service';
import { Observable, map, reduce, shareReplay, combineLatest, tap } from 'rxjs';
import { ProductWithCategoryQueryModel } from '@app/query-models/product-with-category.query-model';


@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly categories$: Observable<CategoryModel[]> = this._categoriesService
    .getAll()
    .pipe(shareReplay(1));

  readonly stores$: Observable<StoreModel[]> = this._storesService
    .getAll()
    .pipe(shareReplay(1));

  readonly storeTags$: Observable<StoreTagModel[]> =
    this._storeTagsService.getAll();

  readonly storeTagsMap$ = this.storeTags$.pipe(
    map((storeTags: StoreTagModel[]) => {
      return storeTags.reduce((a, c) => {
        return { ...a, [c.id]: c };
      }, {}) as Record<string, StoreTagModel>;
    })
  );
  readonly productsWithCategory$: Observable<ProductWithCategoryQueryModel[]> = combineLatest([
    this._productsService.getAll(),
    this.categories$
  ]).pipe(
    map(([products, categories]:[ProductModel[], CategoryModel[]]) => {
      const categoryMap = categories.reduce((a, c) => {
          return { ...a, [c.id]: c };
        }, {}) as Record<string, CategoryModel>;

      return products.map((product) => ({
        ...product,
        categoryName: categoryMap[product.categoryId].name
      }))
    })
  )


  readonly productsFruitAndVegetabled$: Observable<ProductWithCategoryQueryModel[]> = this.productsWithCategory$.pipe(
    map((products:ProductWithCategoryQueryModel[]) => {
      return products.filter(product => product.categoryName === "Fruits & Vegetables").sort((a,b) => {
        if (a.featureValue > b.featureValue) return -1;
        if (a.featureValue < b.featureValue) return 1 ;
        return 0
      }
      ).slice(0,5)
    },
  ))
      
  readonly productSnackAndMunchies$: Observable<ProductWithCategoryQueryModel[]> = this.productsWithCategory$.pipe(
    map((products:ProductWithCategoryQueryModel[]) => {
      return products.filter(product => product.categoryName === "Snack & Munchies").sort((a,b) => {
        if (a.featureValue > b.featureValue) return -1;
        if (a.featureValue < b.featureValue) return 1 ;
        return 0
      }
      ).slice(0,5)
    },
  ))


  constructor(
    private _categoriesService: CategoriesService,
    private _storesService: StoresService,
    private _storeTagsService: StoreTagsService, private _productsService: ProductsService
  ) { }

}

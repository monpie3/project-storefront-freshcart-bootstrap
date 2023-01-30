import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, shareReplay } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CategoryModel } from '@app/models/category.model';
import { ProductModel } from '@app/models/product.model';
import { ProductsService } from '@app/services/products.service';
import { CategoriesService } from '@app/services/categories.service';


@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryProductsComponent {

  readonly categories$: Observable<CategoryModel[]> = this._categoriesService
    .getAll()
    .pipe(shareReplay(1));


  readonly category: Observable<CategoryModel> = this._activatedRoute.params.pipe(
    switchMap((data) => this._categoriesService.getOne(data["categoryId"]))
  ).pipe(shareReplay(1));


  readonly productsByCategory$: Observable<ProductModel[]> = combineLatest([
    this._productsService.getAll(),
    this.category
  ]).pipe(
    map(([products, category]: [ProductModel[], CategoryModel]) => {
      return products.filter((product) => product.categoryId === category.id)
    })
  )

  
  constructor(private _productsService: ProductsService, private _categoriesService: CategoriesService, private _activatedRoute: ActivatedRoute) {
  }
}

import { Component } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { CategoryModel } from '@app/models/category.model';
import { StoreModel } from '@app/models/store.model';
import { CategoriesService } from '@app/services/categories.service';
import { StoresService } from '@app/services/stores.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-freshcard-bootstrap-theme';

  readonly categories$: Observable<CategoryModel[]> = this._categoriesService
    .getAll()
    .pipe(shareReplay(1));

  readonly stores$: Observable<StoreModel[]> = this._storesService
    .getAll();

  constructor(private _categoriesService: CategoriesService, private _storesService: StoresService) {
  }
}



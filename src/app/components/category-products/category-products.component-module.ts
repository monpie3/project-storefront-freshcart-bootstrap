import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryProductsComponent } from '@app/components/category-products/category-products.component';
import { PipesModule } from '@app/pipes/custom-pipe.module';

@NgModule({
  imports: [PipesModule, RouterModule, CommonModule],
  declarations: [CategoryProductsComponent],
  providers: [],
  exports: [CategoryProductsComponent]
})
export class CategoryProductsComponentModule {
}

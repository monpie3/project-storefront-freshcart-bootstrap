import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "@app/components/home/home.component";
import { CategoryProductsComponent } from "@app/components/category-products/category-products.component";
import { StoreProductsComponent } from "@app/components/store-products/store-products.component";
import { HomeComponentModule } from "@app/components/home/home.component-module";
import { CategoryProductsComponentModule } from "@app/components/category-products/category-products.component-module";
import { StoreProductsComponentModule } from "@app/components/store-products/store-products.component-module";

const routes: Routes = [
	{ path: "", component: HomeComponent },
	{ path: "categories/:categoryId", component: CategoryProductsComponent },
	{ path: "stores/:storeId", component: StoreProductsComponent },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes),
		HomeComponentModule,
		CategoryProductsComponentModule,
		StoreProductsComponentModule,
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}

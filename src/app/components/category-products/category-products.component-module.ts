import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { PipesModule } from "@app/pipes/custom-pipe.module";
import { CategoryProductsComponent } from "./category-products.component";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { BrowserAnimationsModule } 
    from "@angular/platform-browser/animations";

@NgModule({
	imports: [
		MatCardModule,
		MatButtonModule,
		MatButtonToggleModule,
		ReactiveFormsModule,
		CommonModule,
		PipesModule,
		RouterModule,
		MatFormFieldModule,
    BrowserAnimationsModule 
	],
	declarations: [CategoryProductsComponent],
	providers: [],
	exports: [CategoryProductsComponent],
})
export class CategoryProductsComponentModule {}

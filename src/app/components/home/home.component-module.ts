import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '@app/components/home/home.component';

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [HomeComponent],
  providers: [],
  exports: [HomeComponent]
})
export class HomeComponentModule {
}

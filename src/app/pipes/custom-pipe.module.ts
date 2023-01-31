import { NgModule } from "@angular/core";
import { RoundPipe } from "@app/pipes/custom-pipe.pipe";

@NgModule({
  declarations: [RoundPipe],
  imports: [],
  exports: [RoundPipe]
})
export class PipesModule {}

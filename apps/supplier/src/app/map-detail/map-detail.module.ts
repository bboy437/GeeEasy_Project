import { NgModule } from "@angular/core";
import { MapDetailComponent } from './map-detail/map-detail.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB1OKRa5BEFf5rtLLwZ_pbtsfe5KJNIn5w',
      libraries: ['places'],
    }),
  ],
  declarations: [MapDetailComponent],
  exports: [MapDetailComponent]
})
export class MapDetailModule {}

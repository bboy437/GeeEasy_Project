import { NgModule } from "@angular/core";
import { MapComponent } from './map/map.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB1OKRa5BEFf5rtLLwZ_pbtsfe5KJNIn5w',
      libraries: ['places'],
    }),
  ],
  declarations: [MapComponent],
  exports: [MapComponent]
})
export class MapModule {}

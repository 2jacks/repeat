import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { MuscleGroupsModule } from './modules/muscle-groups/muscle-groups.module';
import { AppSettingsModule } from './modules/app-settings/app-settings.module';
import { HomeModule } from './modules/home/home.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { DatabaseService } from './services/database.service';

@NgModule({
  declarations: [AppComponent, MenuComponent],
  exports: [AppComponent, MenuComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,

    HomeModule,
    AppSettingsModule,
    ExercisesModule,
    MuscleGroupsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DatabaseService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

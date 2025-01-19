import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { MuscleGroupsModule } from './modules/muscle-groups/muscle-groups.module';
import { AppSettingsModule } from './modules/app-settings/app-settings.module';
import { MainModule } from './modules/home/home.module';

@NgModule({
  declarations: [AppComponent, MenuComponent],
  exports: [AppComponent, MenuComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,

    MainModule,
    AppSettingsModule,
    MuscleGroupsModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

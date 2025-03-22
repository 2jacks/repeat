import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { TuiRoot } from '@taiga-ui/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { DatabaseService } from './services/database.service';
import { SharedModule } from './modules/shared/shared.module';

@NgModule({
  declarations: [AppComponent, MenuComponent],
  exports: [AppComponent, MenuComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,

    BrowserAnimationsModule,
    TuiRoot,
    SharedModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DatabaseService,
    NG_EVENT_PLUGINS,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

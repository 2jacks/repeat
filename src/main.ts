import 'reflect-metadata';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

customElements.define('jeep-sqlite', JeepSqlite);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));

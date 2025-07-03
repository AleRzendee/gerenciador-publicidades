import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // <-- Nome corrigido

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // <-- Nome corrigido
    provideHttpClient()
  ]
}).catch((err) => console.error(err));
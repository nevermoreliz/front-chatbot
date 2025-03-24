import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';
import { injectSessionInterceptor } from './interceptors/inject-session.interceptor';
import { LoadingService } from './services/loading.service';
import { NavigationService } from './services/navigation.service';
import { LoadingComponent } from './shared/loading/loading.component';

@NgModule({
  declarations: [AppComponent, NopagefoundComponent, LoadingComponent],
  imports: [BrowserModule, AppRoutingModule, PagesModule, AuthModule],
  providers: [
    provideHttpClient(
      withInterceptors([injectSessionInterceptor])
    ),
    LoadingService,
    NavigationService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { 
  constructor(private navigationService: NavigationService) {
    // Inicializar el servicio de navegación al cargar el módulo
  }
}

import { Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoadingService } from './loading.service';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.setupNavigationListener();
  }

  private setupNavigationListener(): void {
    // Mostrar carga al iniciar navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.loadingService.mostrar();
    });

    // Ocultar carga cuando la navegación termina
    this.router.events.pipe(
      filter(event => 
        event instanceof NavigationEnd || 
        event instanceof NavigationCancel || 
        event instanceof NavigationError
      )
    ).subscribe(() => {
      setTimeout(() => {
        this.loadingService.ocultar();
      }, 300); // Pequeño retraso para mejor experiencia visual
    });
  }
}

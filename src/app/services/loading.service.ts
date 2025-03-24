import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Cambiamos de signal a BehaviorSubject para mantener compatibilidad
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor() { }

  mostrar(): void {
    this.loadingSubject.next(true);
  }

  ocultar(): void {
    this.loadingSubject.next(false);
  }
}
